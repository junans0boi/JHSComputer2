import { Controller, Get, Param, Query, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly jwtService: JwtService,
  ) {}

  private getUserIdFromAuth(auth: string): string {
    const token = auth?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(token) as { sub: string };
      return payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
  }

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

  @Post()
  async createQuote(@Body() data: any) {
    return this.quotesService.createQuote(data);
  }

  @Post('save')
  async saveMyQuote(@Headers('authorization') auth: string, @Body() snapshot: any) {
    const userId = this.getUserIdFromAuth(auth);
    return this.quotesService.saveQuoteSnapshot(userId, snapshot);
  }

  @Get('my')
  async getMyQuotes(
    @Headers('authorization') auth: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const userId = this.getUserIdFromAuth(auth);
    return this.quotesService.getMyQuotes(userId, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async getQuoteDetail(@Param('id') id: string) {
    return this.quotesService.getQuoteDetail(parseInt(id, 10));
  }

  @Post(':id/order')
  async convertToOrder(@Param('id') id: string, @Body() data: any) {
    return this.quotesService.convertToOrder(parseInt(id, 10), data);
  }
}
