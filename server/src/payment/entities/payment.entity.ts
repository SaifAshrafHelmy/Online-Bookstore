import {
  Column,
  Entity,
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
