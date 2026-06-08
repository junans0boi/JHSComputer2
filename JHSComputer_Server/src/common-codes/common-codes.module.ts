import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCode } from './common-code.entity';
import { CommonCodesController } from './common-codes.controller';
import { CommonCodesService } from './common-codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCode])],
  controllers: [CommonCodesController],
  providers: [CommonCodesService],
  exports: [CommonCodesService],
})
export class CommonCodesModule {}
