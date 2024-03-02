import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity()
export class Order {
  constructor(initialData: Partial<Order> = null) {
    if (initialData !== null) {
      Object.assign(this, initialData);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ name: 'customer_id', type: 'numeric' })
  // customerId: number;

  @Column({ name: 'total_amount', type: 'numeric' })
  totalAmount: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  customer: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment;
}
