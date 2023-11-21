import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './entities/order_item.entity';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const orders = await this.orderRepo.find({});
    console.log(orders);
    return orders;
  }

  async create(createOrderDTO: CreateOrderDto) {
    const userId = 47;
    const currentUser = await this.userRepo.findOneBy({ id: userId });

    const order = new Order({
      customer: currentUser,

      totalAmount: createOrderDTO.totalAmount,
    });

    order.orderItems = createOrderDTO.orderItems;

    const savedOrder = await this.orderRepo.save(order);
    for (const singleItem of createOrderDTO.orderItems) {
      await this.orderItemRepo.save({
        ...singleItem,
        orderId: savedOrder.id,
      });
    }
    return savedOrder;
  }

  // async createNewOrder(createOrderDTO) {
  //   // const userId = 47;
  //   // const currentUser = await this.userRepo.findOneBy({ id: userId });
  //   const order_item: OrderItem = new OrderItem({
  //     bookId: 5,
  //     quantity: 1,
  //   });
  //   const saved_order_item = await this.orderItemRepo.save(order_item);
  //   const order_items: OrderItem[] = [saved_order_item];
  //   const newOrder = this.orderRepo.create({
  //     customerId: 47,
  //     order_items: order_items,
  //   });
  //   const savedNewOrder = await this.orderRepo.save(newOrder);
  //   console.log(savedNewOrder);
  //   return savedNewOrder;
  // }
}

// async createNewOrder(createOrderDTO) {
//   const userId = 47;
//   // const currentUser = await this.userRepo.findOneBy({ id: userId });

//   const newOrder = new Order({
//     customerId: userId,
//     totalAmount: createOrderDTO.totalAmount,
//   });
//   newOrder.order_items = createOrderDTO.orderItems;
//   const savedNewOrder = this.orderRepo.save(newOrder);
//   return savedNewOrder;
// }
