import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('인증이 필요합니다.');

    try {
      const payload = this.jwtService.verify(token);
      (request as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.slice(7);
    return null;
  }
}
