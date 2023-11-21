import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
