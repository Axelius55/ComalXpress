import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    name: 'productId',
    example: '2aa156ee-dd81-47d6-8fc5-d5dc804c1ff8',
    description: 'Product ID',
    required: true,
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    name: 'quantity',
    example: 2,
    description: 'Quantity of the product',
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    name: 'extras',
    description: 'Selected extras for the product',
    required: false,
    type: [String],
    example: ['uuid-extra-pollo', 'uuid-extra-huevo'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  extras?: string[];

  @ApiProperty({
    name: 'notes',
    description: 'Special instructions for the item',
    required: false,
    example: 'sin crema, salsa aparte',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
