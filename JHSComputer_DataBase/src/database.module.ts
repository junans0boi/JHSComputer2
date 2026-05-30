import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSetupService } from './database-setup.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.server', '.env', '../.env'],
    }),
  ],
  providers: [DatabaseSetupService],
})
export class DatabaseModule {}
