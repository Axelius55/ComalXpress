import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductExtra } from "./product-extra.entity";

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('float')
  basePrice: number;

  @Column('text', { nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => ProductExtra,
    (productExtra) => productExtra.product,
    { cascade: true }
  )
  productExtras: ProductExtra[];

}
