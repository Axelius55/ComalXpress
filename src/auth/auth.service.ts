import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('REGISTER DTO:', registerDto);
    return this.usersService.createUserWithRoles(registerDto, [
      RolesUser.CLIENT,
    ]);
  }

  async login(loginDto: LoginDto) {
    const userExists = await this.usersService.findOneByEmailForAuth(
      loginDto.email,
    );

    if (!userExists) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userExists.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: userExists.id,
      email: userExists.email,
      roles: userExists.roles,
      isActive: userExists.isActive
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userExists.id,
        name: userExists.name,
        lastName: userExists.lastName,
        email: userExists.email,
      },
    };
  }

  // Perfil propio
  async getMyProfile(id: string) {
    const user = await this.usersService.findOneUserClient(id);

    return this.buildProfileResponse(user);
  }

  // Perfil de cualquier usuario (ADMIN)
  async getUserProfileByAdmin(id: string) {
    const user = await this.usersService.findOneUserClient(id);

    return this.buildProfileResponse(user);
  }

  private buildProfileResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      points: user.points,
      status: user.isActive,
    };
  }
}
