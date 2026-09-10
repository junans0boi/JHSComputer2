import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { Public } from '../auth';
import { BenchmarksService } from './benchmarks.service';
import { ComponentBenchmarksService } from './component-benchmarks.service';

@Controller('benchmarks')
export class BenchmarksController {
  constructor(
    private readonly benchmarksService: BenchmarksService,
    private readonly componentBenchmarksService: ComponentBenchmarksService,
  ) {}

  @Get('summary')
  @Public()
  async getSummary() {
    return this.benchmarksService.getSummary();
  }

  @Get('games')
  @Public()
  async getGames(@Query('q') q?: string, @Query('limit') limit = '100') {
    return this.benchmarksService.getGames({ q, limit: Number(limit) || 100 });
  }

  @Get('combos')
  @Public()
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

  @Get('selector-options')
  @Public()
  async getSelectorOptions() {
    return this.benchmarksService.getSelectorOptions();
  }

  @Get('recommendation-combos')
  @Public()
  async getRecommendationCombos(
    @Query('q') q?: string,
    @Query('cpu') cpu?: string,
    @Query('gpu') gpu?: string,
    @Query('game') game?: string,
    @Query('resolution') resolution?: string,
    @Query('limit') limit = '50',
  ) {
    return this.benchmarksService.getRecommendationCombos({
      q,
      cpu,
      gpu,
      game,
      resolution,
      limit: Number(limit) || 50,
    });
  }

  @Get('recommendation-combos/:comboRef')
  @Public()
  async getRecommendationComboDetail(
    @Param('comboRef') comboRef: string,
    @Query('limit') limit = '500',
  ) {
    const result = await this.benchmarksService.getRecommendationComboDetail(comboRef, Number(limit) || 500);
    if (!result) throw new NotFoundException('추천 조합을 찾을 수 없습니다.');
    return result;
  }

  @Get('recommended-builds')
  @Public()
  async getRecommendedBuilds(
    @Query('q') q?: string,
    @Query('limit') limit = '30',
  ) {
    return this.benchmarksService.getRecommendedBuilds({
      q,
      limit: Number(limit) || 30,
    });
  }

  @Get('recommended-builds/:buildId')
  @Public()
  async getRecommendedBuild(@Param('buildId') buildId: string) {
    return this.benchmarksService.getRecommendedBuild(Number(buildId));
  }

  @Get('combos/:comboKey')
  @Public()
  async getComboDetail(@Param('comboKey') comboKey: string) {
    return this.benchmarksService.getComboDetail(comboKey);
  }

  @Get('combos/:comboKey/games')
  @Public()
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
  @Public()
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

  @Get('components/:partId/scores')
  @Public()
  async getComponentScores(@Param('partId') partId: string) {
    return this.componentBenchmarksService.getScores(Number(partId));
  }

  @Get('components/compare')
  @Public()
  async compareComponentScores(
    @Query('partIds') partIds = '',
    @Query('testId') testId?: string,
  ) {
    const ids = parseComponentPartIds(partIds);
    const parsedTestId = testId && /^\d+$/.test(testId) ? Number(testId) : undefined;
    return this.componentBenchmarksService.compare(ids, parsedTestId);
  }
}

const MAX_COMPONENT_COMPARE_PART_IDS = 12;

export function parseComponentPartIds(value: string) {
  const ids = value
    .split(',')
    .map((partId) => Number(partId.trim()))
    .filter((partId) => Number.isInteger(partId) && partId > 0);
  if (ids.length > MAX_COMPONENT_COMPARE_PART_IDS) {
    throw new BadRequestException(`한 번에 비교할 부품은 최대 ${MAX_COMPONENT_COMPARE_PART_IDS}개입니다.`);
  }
  return ids;
}
