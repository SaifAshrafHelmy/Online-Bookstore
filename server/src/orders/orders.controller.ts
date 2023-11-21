import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/users/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAllOrders(@Req() request) {
    const user: Partial<User> = request.user;
    if (user.role !== 'customer') {
      console.log('not a customer!');
      throw new UnauthorizedException("you're not a customer!");
    }

    return this.ordersService.findAllUserOrders(user.id);
  }

  @Post()
  createFullOrder(@Body() createOrderDTO: CreateOrderDto, @Req() request) {
    const user: Partial<User> = request.user;
    if (user.role !== 'customer') {
      console.log('not a customer!');
      throw new UnauthorizedException("you're not a customer!");
    }
    return this.ordersService.createFullOrder(user.id, createOrderDTO);
    // return 'ok';
  }
}
