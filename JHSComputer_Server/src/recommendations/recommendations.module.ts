import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
