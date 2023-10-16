import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Order_details {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"integer",
        nullable:false
        })
    user_id: number;

    @Column({
        type:"double precision",
        nullable:false
        })
    total_amount: number

    @Column({
        type:"varchar",
        length: 20,
        nullable:true
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