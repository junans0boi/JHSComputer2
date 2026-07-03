import { Controller, Get, Headers, Param, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('me')
  async getMe(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(token) as { sub: string };
      return this.usersService.getUserDetail(parseInt(payload.sub, 10));
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    return this.usersService.getUserDetail(parseInt(id, 10));
  }
}
