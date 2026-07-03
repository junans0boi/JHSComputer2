import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendation-posts')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('admin/all')
  async getAdminPosts(@Query('limit') limit = '100') {
    return this.recommendationsService.getAdminPosts(Number(limit) || 100);
  }

  @Post('admin')
  async createAdminPost(@Body() body: any) {
    return this.recommendationsService.createAdminPost(body);
  }

  @Patch('admin/:id')
  async updateAdminPost(@Param('id') id: string, @Body() body: any) {
    return this.recommendationsService.updateAdminPost(Number(id), body);
  }

  @Post('admin/upload-thumbnail')
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
  async generateSummary(@Body() body: any) {
    return this.recommendationsService.generateSummary(body);
  }

  @Get()
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
      limit: Number(limit) || 30,
    });
  }

  @Get(':slug')
  async getPost(@Param('slug') slug: string) {
    return this.recommendationsService.getPost(slug);
  }
}
