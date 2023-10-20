import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { BooksService } from 'src/books/books.service';
import { UpdateReviewDTO } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly booksService: BooksService,
  ) {}

  async create(
    bookId: number,
    userId: number,
    createReviewDTO: CreateReviewDTO,
  ) {
    const currentUser = await this.usersRepo.findOneBy({ id: userId });
    const reviewedBook = await this.booksService.findOne(bookId);
    if (!reviewedBook || !currentUser) throw new BadRequestException();

    const newReview = this.reviewsRepo.create(createReviewDTO);
    newReview.author = currentUser;
    newReview.book = reviewedBook;
    const savedReview = await this.reviewsRepo.save(newReview);
    return this.findOne(savedReview.id);
  }

  async findOne(reviewId: number) {
    const review = await this.reviewsRepo.findOne({
      where: { id: reviewId },
      relations: {
        author: true,
      },
      select: this.properties_to_be_selected,
    });
    if (!review) throw new NotFoundException();
    return review;
  }

  async findBookReviews(bookId: number) {
    // check if book exists first
    await this.booksService.findOne(bookId);

    const reviews = await this.reviewsRepo.find({
      where: {
        book: {
          id: bookId,
        },
      },
      relations: {
        author: true,
      },
      select: this.properties_to_be_selected,
    });
    if (!reviews) throw new NotFoundException();
    return reviews;
  }

  async updateOne(
    reviewId: number,
    userId: number,
    updateReviewDTO: UpdateReviewDTO,
  ) {
    const existingReview = await this.reviewsRepo.findOne({
      where: { id: reviewId },
      relations: {
        author: true,
      },
      select: this.properties_to_be_selected,
    });
    if (!existingReview) throw new NotFoundException();

    if (existingReview.author.id !== userId)
      throw new UnauthorizedException("You're not the author of this review.");

    const newReview = Object.assign(existingReview, updateReviewDTO);
    const savedReview = await this.reviewsRepo.save(newReview);
    return savedReview;
  }
  async deleteOne(reviewId: number, userId: number) {
    const existingReview = await this.reviewsRepo.findOne({
      where: { id: reviewId },
      relations: {
        author: true,
      },
      select: this.properties_to_be_selected,
    });
    if (!existingReview) throw new NotFoundException();

    if (existingReview.author.id !== userId)
      throw new UnauthorizedException("You're not the author of this review.");

    await this.reviewsRepo.remove(existingReview);

    return {
      message: 'Book successfully deleted.',
    };
  }

  private readonly properties_to_be_selected = {
    id: true,
    comment: true,
    rating: true,
    created_at: true,
    author: {
      id: true,
      first_name: true,
      last_name: true,
    },
  };
}
