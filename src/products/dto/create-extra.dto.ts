import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateExtraDto {

  @ApiProperty({
    example: 'Pollo',
    required: true,
    type: String,
    description: 'Nombre del extra',
  })  
  @IsString()
  @MinLength(3)
  @MaxLength(50)
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
  @IsBoolean()
  isActive?: boolean;

}