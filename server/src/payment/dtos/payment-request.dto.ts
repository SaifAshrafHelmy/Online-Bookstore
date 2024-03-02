import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

export class CardPaymentDetails {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: 'EGP' | 'USD';
}
export class WalletPaymentDetails {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: 'EGP' | 'USD';

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
