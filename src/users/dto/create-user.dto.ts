import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Luis',
    required: true,
    type: String,
    description: 'User first name'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
  
  @ApiProperty({
    example: 'Herrera',
    required: true,
    type: String,
    description: 'User last name'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: 'luis@email.com',
    required: true,
    type: String,
    description: 'User email'
  })
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'password123',
    required: true,
    type: String,
    description: 'User password'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
