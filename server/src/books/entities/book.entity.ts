import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  category: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'double precision',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  cover_image: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  stock_quantity: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  published_year: number;

  @Column({
    type: 'double precision',
    nullable: true,
  })
  average_rating: number;

  @ManyToOne(() => User, (user) => user.books_for_sale)
  seller: User;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
}

/* 
CREATE TABLE "public"."books" (
  "id" serial,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "category" varchar(255) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "price" double precision NOT NULL,
  "cover_image" text NOT NULL,
  "stock_quantity" integer(0) NOT NULL,
  "published_year" date NOT NULL,
  "average_rating" double precision,
  CONSTRAINT "books_pkey" PRIMARY KEY ("id", "author")
)
;


*/
