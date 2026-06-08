import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  async getQuotes(
    @Query('userId') userId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.quotesService.getQuotes({
      userId: userId ? parseInt(userId, 10) : undefined,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get('templates')
  async getTemplates() {
    return this.quotesService.getTemplates();
  }

  @Post('estimate')
  async estimateQuote(@Body() data: any) {
    return this.quotesService.estimateQuote(data);
  }

  @Get(':id')
  async getQuoteDetail(@Param('id') id: string) {
    return this.quotesService.getQuoteDetail(parseInt(id, 10));
  }

  @Post(':id/order')
  async convertToOrder(@Param('id') id: string, @Body() data: any) {
    return this.quotesService.convertToOrder(parseInt(id, 10), data);
  }

  @Post()
  async createQuote(@Body() data: any) {
    return this.quotesService.createQuote(data);
  }
}
