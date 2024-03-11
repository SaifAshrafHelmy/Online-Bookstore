import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User])],
  controllers: [BooksController],
  providers: [BooksService, CloudinaryService, CloudinaryProvider],
  exports: [BooksService],
})
export class BooksModule {}
