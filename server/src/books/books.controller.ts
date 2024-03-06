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
import { AddNewBookDTO } from './dtos/add-new-book.dto';
import { BooksService } from './books.service';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { AuthGuard, Public } from 'src/users/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { FilterQueryDTO } from './dtos/filter-query.dto';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  addNewBook(@Body() addNewBookDTO: AddNewBookDTO, @Req() request) {
    const user: Partial<User> = request.user;
    if (user.role !== 'seller')
      throw new UnauthorizedException("customers can't list new books");

    return this.booksService.addNew(user.id, addNewBookDTO);
  }

  @Get()
  @Public()
  findBooks(@Query() filterQueryDTO: FilterQueryDTO) {
    return this.booksService.findAll(filterQueryDTO);
  }

  @Get(':id')
  @Public()
  findOneBook(@Param('id') bookId: number) {
    return this.booksService.findOne(bookId);
  }

  @Patch(':id')
  updateBook(
    @Param('id') bookId: number,
    @Body() updateBookDTO: UpdateBookDTO,
    @Req() request,
  ) {
    const user: Partial<User> = request.user;
    if (user.role !== 'seller') throw new UnauthorizedException();

    return this.booksService.updateOne(bookId, user.id, updateBookDTO);
  }

  @Delete(':id')
  deleteBook(@Param('id') bookId: number, @Req() request) {
    const user: Partial<User> = request.user;
    if (user.role !== 'seller') throw new UnauthorizedException();

    return this.booksService.deleteOne(bookId, user.id);
  }
}
