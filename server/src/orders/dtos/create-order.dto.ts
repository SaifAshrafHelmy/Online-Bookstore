import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderItem } from '../entities/order_item.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  orderItems: OrderItem[];
}
