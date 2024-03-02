import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
// import { OrderItemsModule } from './order_items/order_items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AuthModule } from './auth.module';
import { PaymentModule } from './payment/payment.module';

export const AppModuleImportsArray = [
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
  AuthModule,
  UsersModule,
  BooksModule,
  ReviewsModule,
  OrdersModule,
  // OrderItemsModule,
  PaymentModule,
  MailerModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const SMTP_ADDRESS = configService.get<string>('SMTP_ADDRESS');

      return {
        transport: SMTP_ADDRESS,
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
      };
    },
    inject: [ConfigService],
  }),
];
