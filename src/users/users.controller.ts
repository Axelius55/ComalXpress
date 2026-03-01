import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesUser } from './enums/rolesUser.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Post()
  createUser(@Body() createUserDto: CreateUserDto, roles: RolesUser) {
    return this.usersService.createUserWithRoles(createUserDto, [roles]);
  }

  @Get()
  findAllUsersClients() {
    return this.usersService.findAllUsersClients();
  }

  @Get(':id')
  findOneUserClient(@Param('id') id: string) {
    return this.usersService.findOneUserClient(id);
  }

  @Patch(':id')
  updateUserClient(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  removeUserClient(@Param('id') id: string) {
    return this.usersService.removeClient(id);
  }
}
