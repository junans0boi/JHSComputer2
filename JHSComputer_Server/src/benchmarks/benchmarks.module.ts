import { Module } from '@nestjs/common';
import { BenchmarksController } from './benchmarks.controller';
import { BenchmarksService } from './benchmarks.service';
import { ComponentBenchmarksService } from './component-benchmarks.service';

@Module({
  controllers: [BenchmarksController],
  providers: [BenchmarksService, ComponentBenchmarksService],
  exports: [BenchmarksService],
})
export class BenchmarksModule {}
