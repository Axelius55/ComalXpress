import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 @OneToOne(() => Order, order => order.ticket)
 @JoinColumn()
 order: Order;

 @Column()
 orderNumber: string;

 @Column()
 total: number;

 @CreateDateColumn()
 createdAt: Date;

}