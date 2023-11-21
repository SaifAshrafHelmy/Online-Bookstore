import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Book } from 'src/books/entities/book.entity';

@Entity()
export class OrderItem {
  constructor(initialData: Partial<OrderItem> = null) {
    if (initialData !== null) {
      Object.assign(this, initialData);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  // @PrimaryColumn({ name: 'order_id', type: 'numeric' })
  // orderId: number;

  @ManyToOne(() => Book, (book) => book.orderItems)
  // @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column()
  bookId: number;

  @Column()
  unitPrice: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  // @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;
}
