import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AdminUsersController } from './users-admin.controller';
import { ClientUsersController } from './users-client.controller';
import { EmployeeUsersController } from './users-employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    AdminUsersController,
    ClientUsersController,
    EmployeeUsersController,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
