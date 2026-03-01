import { SetMetadata } from '@nestjs/common';
import { RolesUser } from 'src/users/enums/rolesUser.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolesUser[]) =>
  SetMetadata(ROLES_KEY, roles);