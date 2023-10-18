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
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { AuthGuard } from 'src/users/auth.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  // TODO: get the req id from the jwt token and register it here to pass it to methods
  // TODO: Turn the user id into a param decorator

  @Post()
  addNewBook(@Body() addNewBookDTO: AddNewBookDTO, @Req() request) {
    // TODO: user current user session ID
    const user: Partial<User> = request.user;
    if (user.role !== 'seller') throw new UnauthorizedException();
    return this.booksService.addNew(user.id, addNewBookDTO);
  }

  @Get()
  findAllBooks(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.booksService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOneBook(@Param('id') bookId: number) {
    return this.booksService.findOne(bookId);
  }

  @Patch(':id')
  updateBook(
    @Param('id') bookId: number,
    @Body() updateBookDTO: UpdateBookDTO,
    @Req() request,
  ) {
    // TODO: user current user session ID
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
