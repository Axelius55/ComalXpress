import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesUser } from './enums/rolesUser.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admins')
@Auth(RolesUser.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client')
  createClient(@Body() dto: CreateUserDto) {
    return this.usersService.createUserWithRoles(dto, [RolesUser.CLIENT]);
  }

  @Post('employee')
  createEmployee(@Body() dto: CreateUserDto) {
    return this.usersService.createUserWithRoles(dto, [RolesUser.EMPLOYEE]);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/desactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
