import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesUser } from 'src/users/enums/rolesUser.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // roles requeridos por el endpoint
    const requiredRoles = this.reflector.getAllAndOverride<RolesUser[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // si no hay roles requeridos es acceso libre
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      return false;
    }

    // el usuario tiene AL MENOS UNO de los roles requeridos?
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
