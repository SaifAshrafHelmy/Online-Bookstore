import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './entities/order_item.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Book } from 'src/books/entities/book.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async findAllUserOrders(userId) {
    const currentUser = await this.userRepo.findOneBy({ id: userId });
    // const orders = await this.orderRepo.findBy({ customer: currentUser });
    const orders = await this.orderRepo.find({
      where: { customer: currentUser },
      relations: {
        payment: true,
      },
      order: { id: 'desc' },
    });
    return orders;
  }

  async findOneUserOrder(userId, orderId) {
    const currentUser = await this.userRepo.findOneBy({ id: userId });
    // const orders = await this.orderRepo.findBy({ customer: currentUser });
    const order = await this.orderRepo.findOne({
      where: { customer: currentUser, id: orderId },
      relations: {
        payment: true,
      },
      order: { id: 'desc' },
    });
    if (!order)
      throw new NotFoundException(
        'No orders found with the given id that belong to you.',
      );

    return order;
  }

  async createFullOrder(userId, createOrderDTO: CreateOrderDto) {
    // TODO: This needs to be a transaction, all succeed or all fail
    const currentUser = await this.userRepo.findOneBy({ id: userId });

    const order = new Order({
      customer: currentUser,

      totalAmount: 0,
    });

    const savedOrder = await this.orderRepo.save(order);
    const totalAmount = await this.createOrderItems(
      createOrderDTO.orderItems,
      savedOrder.id,
    );

    return {
      id: savedOrder.id,
      totalAmount: totalAmount,
      createdAt: savedOrder.created_at,
    };
  }

  private async createOrderItems(orderItems, orderId) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    let orderTotalAmount = 0;

    for (const singleItem of orderItems) {
      const unitPrice = await this.getBookPriceAndReduceStock(
        singleItem.bookId,
        singleItem.quantity,
      );

      const savedOrderItem = await this.orderItemRepo.save({
        ...singleItem,
        unitPrice,
        order: order,
      });
      orderTotalAmount += savedOrderItem.unitPrice * savedOrderItem.quantity;
    }
    order.totalAmount = orderTotalAmount;
    await this.orderRepo.save(order);
    return orderTotalAmount;
  }

  private async getBookPriceAndReduceStock(bookId, requiredQuantity) {
    const book = await this.bookRepo.findOne({
      where: { id: bookId },
      // select: { title: true, price: true, stock_quantity: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    if (book.stock_quantity < requiredQuantity)
      throw new UnprocessableEntityException(
        `Sorry, not enough stock for the book (${book.title}) `,
      );
    const newStock = +book.stock_quantity - +requiredQuantity;
    Object.assign(book, { stock_quantity: newStock });

    await this.bookRepo.save(book);

    return book.price;
  }
}
