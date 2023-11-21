import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAllOrders() {
    return this.ordersService.findAll();
  }

  @Post()
  createNewOrder(@Body() createOrderDTO) {
    console.log(createOrderDTO);
    return this.ordersService.create(createOrderDTO);
    // return 'ok';
  }
}
