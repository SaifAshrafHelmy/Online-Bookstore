import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { BooksModule } from 'src/books/books.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User]),
    BooksModule,
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
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
