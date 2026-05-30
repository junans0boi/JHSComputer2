import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller';

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
  ],
  controllers: [HealthController],
})
export class AppModule {}
