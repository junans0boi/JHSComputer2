import { Controller, Get, Param, Query } from '@nestjs/common';
import { PartsService } from './parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async getParts(
    @Query('categoryId') categoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.partsService.getParts({
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      keyword,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get('categories')
  async getCategories() {
    return this.partsService.getCategories();
  }

  @Get(':id')
  async getPartDetail(@Param('id') id: string) {
    return this.partsService.getPartDetail(parseInt(id, 10));
  }
}
