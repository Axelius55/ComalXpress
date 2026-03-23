import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { Extra } from './entities/extra.entity';
import { ProductExtra } from './entities/product-extra.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,

    @InjectRepository(ProductExtra)
    private readonly productExtraRepository: Repository<ProductExtra>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { extrasIds = [], ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    await this.productRepository.save(product);

    if (extrasIds.length > 0) {
      const extras = await this.extraRepository.find({
        where: { id: In(extrasIds) },
      });

      const relations = extras.map((extra) =>
        this.productExtraRepository.create({
          product,
          extra,
        }),
      );

      await this.productExtraRepository.save(relations);
    }

    return this.findOne(product.id);
  }

  async findAll() {
    const products = await this.productRepository.find({
      relations: {
        productExtras: {
          extra: true,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      extras: product.productExtras.map((pe) => pe.extra),
      productExtras: undefined,
    }));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        productExtras: true,
      },
    });

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    const { extrasIds, ...productData } = updateProductDto;

    Object.assign(product, productData);

    await this.productRepository.save(product);

    if (extrasIds) {
      await this.productExtraRepository.delete({
        product: { id },
      });

      const extras = await this.extraRepository.find({
        where: { id: In(extrasIds) },
      });

      const relations = extras.map((extra) =>
        this.productExtraRepository.create({
          product,
          extra,
        }),
      );

      await this.productExtraRepository.save(relations);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);

    return { message: 'Product deleted' };
  }

  async addExtras(productId: string, extrasIds: string[]) {
    // 1. Buscar producto
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        productExtras: {
          extra: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Validar que vengan IDs
    if (!extrasIds || extrasIds.length === 0) {
      throw new BadRequestException('extrasIds must not be empty');
    }

    // 3. Buscar extras
    const extras = await this.extraRepository.findBy({
      id: In(extrasIds),
    });

    // 4. Validar que todos existan
    if (extras.length !== extrasIds.length) {
      throw new BadRequestException('Some extras not found');
    }

    // 5. Obtener IDs ya existentes
    const existingExtraIds = product.productExtras.map((pe) => pe.extra.id);

    // 6. Filtrar solo nuevos extras
    const newExtras = extras.filter(
      (extra) => !existingExtraIds.includes(extra.id),
    );

    // 7. Si no hay nuevos, evitar duplicados
    if (newExtras.length === 0) {
      return this.findOne(productId);
    }

    // 8. Crear relaciones
    const relations = newExtras.map((extra) =>
      this.productExtraRepository.create({
        product,
        extra,
      }),
    );

    // 9. Guardar
    await this.productExtraRepository.save(relations);

    return this.findOne(productId);
  }

  async removeExtra(productId: string, extraId: string) {
    const result = await this.productExtraRepository.delete({
      product: { id: productId },
      extra: { id: extraId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Extra not assigned to product');
    }

    return { message: 'Extra removed from product' };
  }

  async getExtras(productId: string) {
    const extras = await this.productExtraRepository.find({
      where: { product: { id: productId } },
      relations: ['extra'],
    });

    return extras.map((pe) => pe.extra);
  }
}
