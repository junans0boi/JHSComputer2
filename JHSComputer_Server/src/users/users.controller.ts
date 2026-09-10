import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  async getMe(@Req() request: Request & { user?: { sub: string } }) {
    return this.usersService.getUserDetail(Number(request.user?.sub));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getUserDetail(@Param('id') id: string) {
    return this.usersService.getUserDetail(parseInt(id, 10));
  }
}
