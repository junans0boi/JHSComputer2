import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 50)
  loginId!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}

export class RegisterDto {
  @IsString()
  @Length(3, 50)
  @Matches(/^[A-Za-z0-9_.-]+$/, { message: '아이디는 영문, 숫자, _, ., -만 사용할 수 있습니다.' })
  loginId!: string;

  @IsString()
  @Length(8, 128)
  password!: string;

  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 100)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nickname?: string;
}
