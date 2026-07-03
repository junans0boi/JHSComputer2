import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { loginId?: string; password?: string }) {
    return this.authService.login(body.loginId ?? '', body.password ?? '');
  }

  @Post('register')
  async register(@Body() body: { loginId?: string; password?: string; name?: string; email?: string; nickname?: string }) {
    return this.authService.register({
      loginId: body.loginId ?? '',
      password: body.password ?? '',
      name: body.name ?? '회원',
      email: body.email,
      nickname: body.nickname,
    });
  }
}
