import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { CurrentUser } from './decorators/user.decorator';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { Auth } from './decorators/auth.decorator';
import { AuthOnlyUser } from './decorators/authOnlyUser.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto){
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @AuthOnlyUser()
  @Get('profile')
  getMyProfile(@CurrentUser() user: any) {
    return this.authService.getMyProfile(user.id);
  }

  @Auth(RolesUser.ADMIN)
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.authService.getUserProfileByAdmin(id);
  }
}
