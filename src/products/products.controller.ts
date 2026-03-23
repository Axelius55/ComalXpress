import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddExtrasDto } from './dto/add-extras.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { AuthOnlyUser } from 'src/auth/decorators/authOnlyUser.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @AuthOnlyUser()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @AuthOnlyUser()
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/extras')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Asignar extras a un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  addExtras(@Param('id') id: string, @Body() dto: AddExtrasDto) {
    return this.productsService.addExtras(id, dto.extrasIds);
  }

  @Delete(':productId/extras/:extraId')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Eliminar un extra de un producto' })
  @ApiParam({
    name: 'productId',
    description: 'ID del producto al cual se desea eliminar el extra',
  })
  @ApiParam({
    name: 'extraId',
    description: 'ID del extra a eliminar del producto',
  })
  removeExtra(
    @Param('productId') productId: string,
    @Param('extraId') extraId: string,
  ) {
    return this.productsService.removeExtra(productId, extraId);
  }

  @Get(':id/extras')
  @AuthOnlyUser()
  @ApiOperation({ summary: 'Obtener los extras de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  getExtras(@Param('id') id: string) {
    return this.productsService.getExtras(id);
  }
}
