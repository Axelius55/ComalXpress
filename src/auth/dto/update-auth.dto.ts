import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register-user.dto';

export class UpdateAuthDto extends PartialType(RegisterDto) {}
