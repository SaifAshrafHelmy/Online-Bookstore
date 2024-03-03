import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentConfiguration } from './payment.config';
import { PaymobService } from './paymob.service';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentController],
  providers: [PaymentService, PaymobService, PaymentConfiguration],
})
export class PaymentModule {}
