import {
  Controller,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AuthOnlyUser } from 'src/auth/decorators/authOnlyUser.decorator';

@Controller('users')
export class ClientUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @AuthOnlyUser()
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  @AuthOnlyUser()
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }
}
