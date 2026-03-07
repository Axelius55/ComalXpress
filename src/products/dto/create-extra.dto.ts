import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateExtraDto {

  @ApiProperty({
    example: 'Pollo',
    required: true,
    description: 'Nombre del extra',
  })  
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    required: true,
    description: 'Precio del extra',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el extra está activo',
  })
  @IsOptional()
  isActive?: boolean;

}