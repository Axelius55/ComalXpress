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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('admins')
@Auth(RolesUser.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client')
  @ApiOperation({ summary: 'Create a new client user' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  createClient(@Body() dto: CreateUserDto) {
    return this.usersService.createUserWithRoles(dto, [RolesUser.CLIENT]);
  }

  @Post('employee')
  @ApiOperation({ summary: 'Create a new employee user' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  createEmployee(@Body() dto: CreateUserDto) {
    return this.usersService.createUserWithRoles(dto, [RolesUser.EMPLOYEE]);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
