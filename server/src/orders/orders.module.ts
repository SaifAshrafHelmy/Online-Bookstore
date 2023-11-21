import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Book]),
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
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
