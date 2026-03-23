import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Extra } from './entities/extra.entity';
import { ProductExtra } from './entities/product-extra.entity';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Extra, ProductExtra]), UsersModule],
  controllers: [ProductsController, ExtrasController],
  providers: [ProductsService, ExtrasService],
  exports: [ProductsService, ExtrasService],
})
export class ProductsModule {}
