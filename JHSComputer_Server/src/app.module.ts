import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from './discord/discord.module';
import { HealthController } from './health/health.controller';
import { PartsModule } from './parts/parts.module';
import { QuotesModule } from './quotes/quotes.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { CommonCodesModule } from './common-codes/common-codes.module';
import { BenchmarksModule } from './benchmarks/benchmarks.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { AiModule } from './ai/ai.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AdminModule } from './admin/admin.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RateLimitGuard } from './common/rate-limit.guard';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../.env'],
      validate: (env) => {
        if (env.NODE_ENV === 'production') {
          const required = ['JWT_SECRET', 'DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'CORS_ORIGINS'];
          const missing = required.filter((key) => !env[key]);
          if (missing.length) throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
          if (String(env.JWT_SECRET).length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production.');
          if (env.DB_SYNC === 'true') throw new Error('DB_SYNC=true is forbidden in production.');
        }
        return env;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? 3306),
        username: config.get<string>('DB_USERNAME') ?? 'jhs_dev',
        password: config.get<string>('DB_PASSWORD') ?? 'jhs_dev_password',
        database: config.get<string>('DB_DATABASE') ?? 'jhs_computer_dev',
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('DB_SYNC') === 'true',
        charset: 'utf8mb4',
      }),
    }),
    TypeOrmModule.forFeature([User]),
    DiscordModule,
    PartsModule,
    QuotesModule,
    OrdersModule,
    UsersModule,
    CommonCodesModule,
    BenchmarksModule,
    AuthModule,
    CartModule,
    AiModule,
    RecommendationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RateLimitGuard },
  ],
})
export class AppModule {}
