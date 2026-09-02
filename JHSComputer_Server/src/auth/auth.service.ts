import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SocialProvider, UserRole, UserStatus } from '../common/enums';
import { SocialAccount } from '../users/social-account.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SocialAccount) private readonly socialAccountRepository: Repository<SocialAccount>,
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
    const passwordMatch = stored.startsWith('$2')
      ? await bcrypt.compare(password, stored)
      : stored === password;

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

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      loginId: data.loginId,
      passwordText: hashedPassword,
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

  async googleLogin(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? '';

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });
    if (!tokenRes.ok) throw new UnauthorizedException('Google 토큰 교환 실패');
    const { access_token } = await tokenRes.json() as { access_token: string };

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!profileRes.ok) throw new UnauthorizedException('Google 프로필 조회 실패');
    const profile = await profileRes.json() as { id: string; email: string; name: string; picture: string };
    const { id: googleId, email, name, picture } = profile;

    // 기존 소셜 연결 확인
    const existing = await this.socialAccountRepository.findOne({
      where: { provider: SocialProvider.GOOGLE, providerUserId: googleId },
      relations: ['user'],
    });
    if (existing) {
      const u = existing.user;
      return { accessToken: this.jwtService.sign({ sub: u.id, loginId: u.loginId, role: u.role }), user: u };
    }

    // 동일 이메일 계정 자동 연동
    let user = email ? await this.userRepository.findOne({ where: { email } }) : null;

    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({ email, name: name ?? 'Google 회원', loginId: null, passwordText: null, role: UserRole.USER, status: UserStatus.ACTIVE }),
      );
    }

    await this.socialAccountRepository.save(
      this.socialAccountRepository.create({ userId: user.id, provider: SocialProvider.GOOGLE, providerUserId: googleId, email, profileJson: { name, picture } }),
    );

    return { accessToken: this.jwtService.sign({ sub: user.id, loginId: user.loginId, role: user.role }), user };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token) as { sub: string; loginId: string; role: string };
    } catch {
      return null;
    }
  }
}
