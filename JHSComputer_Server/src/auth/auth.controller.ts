import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Public, RateLimit } from './index';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @RateLimit(10, 60_000)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.loginId, body.password);
  }

  @Post('register')
  @Public()
  @RateLimit(5, 60_000)
  async register(@Body() body: RegisterDto) {
    return this.authService.register({
      loginId: body.loginId,
      password: body.password,
      name: body.name,
      email: body.email,
      nickname: body.nickname,
    });
  }

  @Get('google')
  @Public()
  googleRedirect(@Res() res: Response) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? '',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  @Get('google/callback')
  @Public()
  @RateLimit(10, 60_000)
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'https://jhspc.kro.kr';
    try {
      const { accessToken, user } = await this.authService.googleLogin(code);
      const params = new URLSearchParams({
        token: accessToken,
        id: String(user.id),
        name: user.name ?? '',
        role: user.role,
        email: user.email ?? '',
        loginId: user.loginId ?? '',
        nickname: user.nickname ?? '',
        status: user.status,
      });
      return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch {
      return res.redirect(`${frontendUrl}/login?error=oauth`);
    }
  }
}
