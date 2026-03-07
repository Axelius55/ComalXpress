import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AddExtrasDto {

  @ApiProperty({
    example: [
      'c6e1c9b8-7a7e-4d12-a45e-9c7a7e0f0c1d',
      '1a2b3c4d-5e6f-7g8h-9i10-jk11lm12no13'
    ],
    description: 'Lista de IDs de extras a asignar al producto',
  })  
  @IsArray()
  @IsUUID('4', { each: true })
  extrasIds: string[];

}