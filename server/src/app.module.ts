import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersDetailsModule } from './orders_details/orders_details.module';
import { OrderItemModule } from './order_item/order_item.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'online-bookstore',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      // @TODO: Disable in production
      synchronize: true,
    }),
    UsersModule,
    BooksModule,
    ReviewsModule,
    OrdersDetailsModule,
    OrderItemModule,
    MailerModule.forRoot({
      transport:
        'smtps://saifashrafhelmy@gmail.com:peyuammemxsghirn@smtp.gmail.com',
      defaults: {
        from: '"Booktopia" <saifashrafhelmy@gmail.com>',
      },
      template: {
        dir: __dirname + '/ejs_templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
