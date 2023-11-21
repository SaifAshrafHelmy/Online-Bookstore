import { Book } from 'src/books/entities/book.entity';
import { Order } from 'src/orders/entities/order.entity';
// import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserRole {
  // ADMIN = 'admin',

  CUSTOMER = 'customer',
  SELLER = 'seller',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  last_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  profile_picture: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone_number: string;

  @OneToMany(() => Book, (book) => book.seller)
  books_for_sale: Book[];

  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}

/* 
CREATE TABLE "public"."users" (
  "id" serial,
  "email" varchar(255) NOT NULL,
  "password" text NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "profile_picture" text,
  "address" varchar(255),
  "phone_number" varchar(255),
  PRIMARY KEY ("id")
)
;

*/
