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
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const DN_USERNAME = configService.get<string>('DN_USERNAME');
      const DB_PASSWORD = configService.get<string>('DB_PASSWORD');
      const DB_NAME = configService.get<string>('DB_NAME');
      const DB_PORT = configService.get<number>('DB_PORT');

      return {
        type: 'postgres',
        host: 'localhost',
        port: DB_PORT,
        username: DN_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migrations/*.js'],
        // @TODO: Disable in production
        synchronize: true,
      };
    },
    inject: [ConfigService],
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
