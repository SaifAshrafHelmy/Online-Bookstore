import { Max, Min } from 'class-validator';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.reviews)
  book: Book;

  @ManyToOne(() => User, (user) => user.reviews)
  author: User;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @Min(0)
  @Max(10)
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  //   @Column({
  //     type: 'timestamp',
  //     nullable: false,
  //   })
  //   time_stamp: Date;
}

/* 
CREATE TABLE "public"."reviews" (
  "id" serial,
  "book_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "comment" varchar(255),
  "rating" integer NOT NULL,
  "timestamp" date NOT NULL,
  CONSTRAINT "_copy_4" PRIMARY KEY ("id", "book_id", "user_id"),
  CONSTRAINT "fk_revs_books_1" FOREIGN KEY ("book_id") REFERENCES "public"."books" ("id"),
  CONSTRAINT "fk_revs_users_1" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id")
)
;



*/
