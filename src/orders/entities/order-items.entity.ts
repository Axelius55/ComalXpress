import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { OrderItemExtra } from './order-item-extras.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => OrderItemExtra, (extra) => extra.orderItem, {
    cascade: true,
  })
  extras: OrderItemExtra[];
}
