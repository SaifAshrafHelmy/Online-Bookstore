import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/users/auth.guard';
import { UpdateReviewDTO } from './dtos/update-review.dto';

@UseGuards(AuthGuard)
@Controller('books/:bookId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  createReview(
    @Param('bookId') bookId: number,
    @Body() createReviewDTO: CreateReviewDTO,
    @Req() request,
  ) {
    const user: Partial<User> = request.user;
    if (user.role === 'seller')
      throw new UnauthorizedException(
        'Sellers are not allowed to leave reviews.',
      );

    return this.reviewsService.create(bookId, user.id, createReviewDTO);
  }

  @Get(':id')
  findOneReview(@Param('id') bookId: number) {
    return this.reviewsService.findOne(bookId);
  }

  @Get()
  findBookReviews(@Param('bookId') bookId: number) {
    return this.reviewsService.findBookReviews(bookId);
  }

  @Patch(':reviewId')
  updateReview(
    @Param('reviewId') reviewId: number,
    @Body() updateReviewDTO: UpdateReviewDTO,
    @Req() request,
  ) {
    const user: Partial<User> = request.user;

    return this.reviewsService.updateOne(reviewId, user.id, updateReviewDTO);
  }

  @Delete(':reviewId')
  deleteReview(@Param('reviewId') reviewId: number, @Req() request) {
    const user: Partial<User> = request.user;

    return this.reviewsService.deleteOne(reviewId, user.id);
  }
}
