import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'User email',
    required: true,
    type: String,
    maxLength: 100
  })
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: true,
    type: String,
    minLength: 6,
    maxLength: 100
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
