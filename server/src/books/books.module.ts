import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret =
          configService.get<string>('JWT_SECRET') || 'j4234j23DS$';
        // console.log(`JWT_SECRET from configService: ${jwtSecret}`); // Log the JWT secret
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '1hr' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
