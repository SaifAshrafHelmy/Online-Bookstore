import { Order } from 'src/orders/entities/order.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  paymobOrderId: number;

  @Column()
  payment_method: 'card' | 'wallet';

  @Column()
  status: 'failed' | 'pending' | 'complete';

  @Column()
  amount: number;

  @Column()
  currency: 'EGP' | 'USD';

  @UpdateDateColumn()
  updated_at: Date;
}
/* 
Payment_id
order_id
paymob_payment_id
payment_method: card or wallet?
status
amount
currency?
*/
