import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth';
import { Public } from '../auth';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendation-posts')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  // ── 공개 엔드포인트 ──────────────────────────────────────────────

  @Get()
  @Public()
  async getPosts(
    @Query('q') q?: string,
    @Query('game') game?: string,
    @Query('resolution') resolution?: string,
    @Query('budgetMax') budgetMax?: string,
    @Query('part') part?: string,
    @Query('cpuBrand') cpuBrand?: string,
    @Query('gpuBrand') gpuBrand?: string,
    @Query('comboType') comboType?: string,
    @Query('sort') sort = 'popular',
    @Query('limit') limit = '30',
  ) {
    return this.recommendationsService.getPosts({
      q,
      game,
      resolution,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      part,
      cpuBrand,
      gpuBrand,
      comboType,
      sort,
      limit: normalizeLimit(limit, 30),
    });
  }

  @Get(':slug')
  @Public()
  async getPost(@Param('slug') slug: string) {
    return this.recommendationsService.getPost(slug);
  }

  // ── 관리자 전용 엔드포인트 ──────────────────────────────────────

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminPosts(@Query('limit') limit = '100') {
    return this.recommendationsService.getAdminPosts(normalizeLimit(limit, 100));
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createAdminPost(@Body() body: any) {
    return this.recommendationsService.createAdminPost(body);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAdminPost(@Param('id') id: string, @Body() body: any) {
    return this.recommendationsService.updateAdminPost(Number(id), body);
  }

  @Post('admin/upload-thumbnail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, callback) => {
        const uploadDir = join(process.cwd(), 'uploads', 'recommendations');
        mkdirSync(uploadDir, { recursive: true });
        callback(null, uploadDir);
      },
      filename: (_req, file, callback) => {
        const safeExt = extname(file.originalname || '').toLowerCase() || '.png';
        callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/recommendations/${file.filename}` };
  }

  @Post('admin/generate-summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async generateSummary(@Body() body: any) {
    return this.recommendationsService.generateSummary(body);
  }
}

function normalizeLimit(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(1, Math.floor(parsed))) : fallback;
}
