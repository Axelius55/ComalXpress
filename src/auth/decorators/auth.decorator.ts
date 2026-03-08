import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ActiveUserGuard } from '../guards/active-user.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: RolesUser[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, ActiveUserGuard, RolesGuard),
  );
}
