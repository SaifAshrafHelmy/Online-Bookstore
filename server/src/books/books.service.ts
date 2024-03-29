import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Book } from './entities/book.entity';
import { AddNewBookDTO } from './dtos/add-new-book.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async findAll(filterQueryDTO): Promise<Book[]> {
    const {
      limit,
      offset,
      category,
      author,
      published_year,
      priceGTE,
      priceLTE,
    } = filterQueryDTO;
    const books = await this.bookRepo.find({
      // filters
      where: {
        ...(category && { category: ILike(`%${category}%`) }),
        ...(author && { author: ILike(`%${author}%`) }),
        ...(published_year && { published_year: published_year }),
        ...(priceGTE && { price: MoreThanOrEqual(priceGTE) }),
        ...(priceLTE && { price: LessThanOrEqual(priceLTE) }),
      },

      // fields to select
      select: this.properties_to_be_selected,
      relations: ['seller'],

      // pagination
      skip: offset,
      take: limit,
      order: {
        // if contradictory, next one overrides
        ...(priceLTE && { price: 'DESC' }),
        ...(priceGTE && { price: 'ASC' }),
        id: 'DESC',
        // id: 'ASC',
      },
    });

    if (!books) throw new NotFoundException();
    return books;
  }

  async findOne(bookId: number): Promise<Book> {
    if (!bookId) throw new BadRequestException('Book id must be provided.');

    // const book = await this.bookRepo.findOneBy({ id: bookId });
    const book = await this.bookRepo.findOne({
      where: { id: bookId },
      select: this.properties_to_be_selected,
      relations: ['seller'],
    });
    if (!book) throw new NotFoundException('Book not found');

    return book;
  }

  async addNew(userId: number, book: AddNewBookDTO) {
    if (!book || !userId) throw new BadRequestException();

    const newBook = this.bookRepo.create(book);
    const user = await this.userRepo.findOneBy({ id: userId });
    newBook.seller = user;
    const savedBook = await this.bookRepo.save(newBook);
    return this.findOne(savedBook.id);
  }

  async updateOne(
    bookId: number,
    userId: number,
    updateBookDTO: UpdateBookDTO,
  ): Promise<Book> {
    if (!userId || !bookId || !updateBookDTO) throw new BadRequestException();
    const book = await this.findOne(bookId);
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Current User Not Found');
    }
    if (book.seller.id !== user.id) {
      throw new UnauthorizedException();
    }
    Object.assign(book, updateBookDTO);
    return await this.bookRepo.save(book);
  }

  async deleteOne(bookId: number, userId: number) {
    if (!userId || !bookId) throw new BadRequestException();
    const book = await this.findOne(bookId);
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Current User Not Found');
    }
    if (book.seller.id !== user.id) {
      throw new UnauthorizedException();
    }
    await this.bookRepo.remove(book);
    return {
      message: 'Book successfully deleted.',
    };
  }

  private readonly properties_to_be_selected = {
    id: true,
    title: true,
    author: true,
    description: true,
    price: true,
    category: true,
    stock_quantity: true,
    published_year: true,
    cover_image: true,
    average_rating: true,
    seller: {
      id: true,
      first_name: true,
      last_name: true,
    },
  };
}
