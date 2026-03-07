import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Chilaquiles verdes',
    required: true,
    description: 'Nombre del producto',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Totopos bañados en salsa verde',
    description: 'Descripción del producto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 55,
    required: true,
    description: 'Precio base del producto',
  })
  @IsNumber()
  @Min(0)
  basePrice: number;
  
  @ApiPropertyOptional({
    example: 'https://miapp.com/images/chilaquiles.jpg',
    description: 'Imagen del producto',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto está activo',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // extras asignados
  @ApiPropertyOptional({
    example: [
      'c6e1c9b8-7a7e-4d12-a45e-9c7a7e0f0c1d',
      '1a2b3c4d-5e6f-7g8h-9i10-jk11lm12no13',
    ],
    description: 'IDs de extras asociados al producto',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  extrasIds?: string[];
}
