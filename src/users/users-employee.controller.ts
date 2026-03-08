import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesUser } from './enums/rolesUser.enum';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('employees')
@Auth(RolesUser.EMPLOYEE, RolesUser.ADMIN)
export class EmployeeUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Get('clients')
  findClients() {
    return this.usersService.findClients();
  }

  @Get('clients/:id')
  findClientById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('clients/:id/desactivate')
  deactivateClient(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch('clients/:id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}
