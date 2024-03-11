import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddNewBookDTO } from './dtos/add-new-book.dto';
import { BooksService } from './books.service';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { AuthGuard, Public } from 'src/users/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { FilterQueryDTO } from './dtos/filter-query.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // @Post('/upload/image/')
  // @UseInterceptors(FileInterceptor('cover-image'))
  // uploadImage() {
  //   return this.cloudinaryService.uploadFile(file);
  // }

  @Post()
  @UseInterceptors(FileInterceptor('cover_image'))
  async addNewBook(
    @Body('book_data') addNewBookDTO: any,
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('your book:', addNewBookDTO);
    addNewBookDTO = JSON.parse(addNewBookDTO);
    const bookInstance = plainToInstance(AddNewBookDTO, addNewBookDTO);
    const valid = await validate(bookInstance);
    if (!valid) {
      throw new BadRequestException();
    }
    const user: Partial<User> = request.user;
    if (user.role !== 'seller')
      throw new UnauthorizedException("customers can't list new books");

    if (file) {
      console.log('GOT A FILEEEEEEEEEEEEEEEEEE');
      const { url } = await this.cloudinaryService.uploadFile(file);
      console.log(url);
      addNewBookDTO.cover_image = url;
    }
    if (!file) {
      console.log('DID NOTTTTTTTT GET A FILE');
    }

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
