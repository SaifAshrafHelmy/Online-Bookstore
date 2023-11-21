import { IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderItemDto } from './orderItem.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
