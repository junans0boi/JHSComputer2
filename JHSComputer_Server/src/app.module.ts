import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../.env'],
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
        charset: 'utf8mb4_unicode_ci',
      }),
    }),
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
