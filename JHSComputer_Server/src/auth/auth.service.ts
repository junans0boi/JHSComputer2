import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from '../common/enums';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginId: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordText')
      .where('user.loginId = :loginId', { loginId })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    const stored = user.passwordText ?? '';
    const passwordMatch = stored === password;

    if (user.status !== UserStatus.ACTIVE || !passwordMatch) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { sub: user.id, loginId: user.loginId, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        loginId: user.loginId,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async register(data: { loginId: string; password: string; name: string; email?: string; nickname?: string }) {
    const { BadRequestException } = await import('@nestjs/common');
    const existing = await this.userRepository.findOne({ where: { loginId: data.loginId } });
    if (existing) throw new BadRequestException('이미 사용 중인 아이디입니다.');

    const { UserRole, UserStatus } = await import('../common/enums');

    const user = this.userRepository.create({
      loginId: data.loginId,
      passwordText: data.password,
      name: data.name,
      email: data.email ?? null,
      nickname: data.nickname ?? null,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    const saved = await this.userRepository.save(user);

    const payload = { sub: saved.id, loginId: saved.loginId, role: saved.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: saved.id,
        loginId: saved.loginId,
        name: saved.name,
        nickname: saved.nickname,
        email: saved.email,
        role: saved.role,
        status: saved.status,
      },
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token) as { sub: string; loginId: string; role: string };
    } catch {
      return null;
    }
  }
}
