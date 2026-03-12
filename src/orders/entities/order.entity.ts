import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-items.entity';
import { OrderStatus } from '../enums/oder-status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToOne(() => Ticket, (ticket) => ticket.order)
  ticket: Ticket;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
