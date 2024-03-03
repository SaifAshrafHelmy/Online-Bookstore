import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Payment } from '../entities/payment.entity';

export class PayWithCardDTO {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}

export class PayWithWalletDTO {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export type PaymentData = Omit<Payment, 'id' | 'updated_at'>;
