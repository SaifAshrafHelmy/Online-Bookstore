import { Order_item } from 'src/order_items/entities/order_item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Order_item, (order_item) => order_item.order)
  order_items: Order_item[];

  @Column({
    type: 'double precision',
    nullable: false,
  })
  total_amount: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  payment_method: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
}

/* 
CREATE TABLE "public"."orders_details" (
  "id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "total_amount" double precision NOT NULL,
  "timestamp" date NOT NULL,
  "payment_method" varchar(255),
  CONSTRAINT "_copy_3" PRIMARY KEY ("id", "user_id"),
  CONSTRAINT "fk_orders_details_users_1" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id")
)
;



*/
