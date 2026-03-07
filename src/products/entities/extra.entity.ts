import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductExtra } from './product-extra.entity';


@Entity()
export class Extra {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('float')
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => ProductExtra,
    (productExtra) => productExtra.extra,
  )
  productExtras: ProductExtra[];
}