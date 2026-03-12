import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => Order, order => order.items)
 order: Order;

 @Column()
 productId: string;

 @Column()
 productName: string;

 @Column()
 price: number;

 @Column()
 quantity: number;

}