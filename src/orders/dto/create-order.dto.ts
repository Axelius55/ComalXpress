import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './create-order-items.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    name: 'items',
    description: 'List of items in the order',
    required: true,
    type: [CreateOrderItemDto],
    example: [
      {
        productId: 'uuid-product-id',
        quantity: 1,
        extras: [
          'uuid-extra-pollo'
        ],
        notes: 'sin crema'
      }
    ],
  })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
