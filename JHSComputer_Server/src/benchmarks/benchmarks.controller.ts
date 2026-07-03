import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BenchmarksService } from './benchmarks.service';

@Controller('benchmarks')
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarksService) {}

  @Get('summary')
  async getSummary() {
    return this.benchmarksService.getSummary();
  }

  @Get('games')
  async getGames(@Query('q') q?: string, @Query('limit') limit = '100') {
    return this.benchmarksService.getGames({ q, limit: Number(limit) || 100 });
  }

  @Get('combos')
  async getCombos(
    @Query('q') q?: string,
    @Query('cpu') cpu?: string,
    @Query('gpu') gpu?: string,
    @Query('game') game?: string,
    @Query('resolution') resolution?: string,
    @Query('includeNoFps') includeNoFps = 'false',
    @Query('limit') limit = '50',
  ) {
    return this.benchmarksService.getCombos({
      q,
      cpu,
      gpu,
      game,
      resolution,
      includeNoFps: includeNoFps === 'true',
      limit: Number(limit) || 50,
    });
  }

  @Get('recommended-builds')
  async getRecommendedBuilds(
    @Query('source') source?: string,
    @Query('q') q?: string,
    @Query('limit') limit = '30',
  ) {
    return this.benchmarksService.getRecommendedBuilds({
      source,
      q,
      limit: Number(limit) || 30,
    });
  }

  @Get('recommended-builds/:buildId')
  async getRecommendedBuild(@Param('buildId') buildId: string) {
    return this.benchmarksService.getRecommendedBuild(Number(buildId));
  }

  @Get('combos/:comboKey')
  async getComboDetail(@Param('comboKey') comboKey: string) {
    return this.benchmarksService.getComboDetail(comboKey);
  }

  @Get('combos/:comboKey/games')
  async getComboGames(
    @Param('comboKey') comboKey: string,
    @Query('game') game?: string,
    @Query('resolution') resolution?: string,
    @Query('limit') limit = '200',
  ) {
    return this.benchmarksService.getComboGames({
      comboKey,
      game,
      resolution,
      limit: Number(limit) || 200,
    });
  }

  @Post('quote-performance')
  async getQuotePerformance(
    @Body()
    body: {
      parts?: Array<{ category?: string; name?: string }>;
      games?: string[];
      resolution?: string;
      limit?: number;
    },
  ) {
    return this.benchmarksService.getQuotePerformance({
      parts: body.parts ?? [],
      games: body.games ?? [],
      resolution: body.resolution,
      limit: Number(body.limit) || 80,
    });
  }
}
