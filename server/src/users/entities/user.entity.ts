import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
