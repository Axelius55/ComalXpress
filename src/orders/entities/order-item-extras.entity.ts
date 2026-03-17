import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-items.entity";

@Entity()
export class OrderItemExtra {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, orderItem => orderItem.extras, {
    onDelete: 'CASCADE'
  })
  orderItem: OrderItem;

  @Column()
  extraId: string;

  @Column()
  name: string;

  @Column('float')
  price: number;

}