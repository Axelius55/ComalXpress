import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

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
    description: "Quantity of the product",
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
