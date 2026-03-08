import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateExtraDto {

  @ApiProperty({
    example: 'Pollo',
    required: true,
    type: String,
    description: 'Nombre del extra',
  })  
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    required: true,
    type: Number,
    description: 'Precio del extra',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    required: false,
    description: 'Indica si el extra está activo',
  })
  @IsOptional()
  isActive?: boolean;

}