import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Extra } from './extra.entity';

@Entity()
export class ProductExtra {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Product,
    (product) => product.productExtras,
    { onDelete: 'CASCADE' }
  )
  product: Product;

  @ManyToOne(
    () => Extra,
    (extra) => extra.productExtras,
    { eager: true }
  )
  extra: Extra;
}