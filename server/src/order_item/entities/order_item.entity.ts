import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order_item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"integer",
        nullable:false
        })
    order_id: number;

    @Column({
        type:"integer",
        nullable:false
        })
    product_id: number;

    @Column({
        type:"integer",
        nullable:false
        })
    quantity: number;



}

/* 
CREATE TABLE "public"."orders_item" (
  "id" integer NOT NULL,
  "order_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "quantity" integer NOT NULL,
  CONSTRAINT "_copy_2" PRIMARY KEY ("id", "order_id", "product_id"),
  CONSTRAINT "fk_order_items_orders_details_1" FOREIGN KEY ("order_id") REFERENCES "public"."orders_details" ("id")
)
;




*/