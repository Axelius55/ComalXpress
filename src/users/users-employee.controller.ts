import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesUser } from './enums/rolesUser.enum';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('employees')
@Auth(RolesUser.EMPLOYEE, RolesUser.ADMIN)
export class EmployeeUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get employee profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update employee profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Get('clients')
  @ApiOperation({ summary: 'Get all clients' })
  findClients() {
    return this.usersService.findClients();
  }

  @Get('clients/:id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  findClientById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('clients/:id/desactivate')
  @ApiOperation({ summary: 'Deactivate a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  deactivateClient(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch('clients/:id/activate')
  @ApiOperation({ summary: 'Activate a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}
