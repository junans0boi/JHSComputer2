import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, Public } from '../auth';
import { CreateQuoteDto, DeliveryDto, SaveQuoteSnapshotDto } from './dto/quote.dto';
import { QuotePreviewDto } from './dto/quote-preview.dto';
import { QuotePreviewService } from './quote-preview.service';
import { QuotesService } from './quotes.service';

type AuthenticatedRequest = Request & { user: { sub: string; role: string } };

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly quotePreviewService: QuotePreviewService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getQuotes(
    @Req() request: AuthenticatedRequest,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.quotesService.getQuotes({
      userId: request.user.sub,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get('templates')
  @Public()
  async getTemplates() {
    return this.quotesService.getTemplates();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createQuote(@Req() request: AuthenticatedRequest, @Body() data: CreateQuoteDto) {
    return this.quotesService.createQuote(request.user.sub, data);
  }

  @Post('preview')
  @Public()
  async previewQuote(@Body() data: QuotePreviewDto) {
    return this.quotePreviewService.preview(data.profile);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async saveMyQuote(@Req() request: AuthenticatedRequest, @Body() snapshot: SaveQuoteSnapshotDto) {
    return this.quotesService.saveQuoteSnapshot(request.user.sub, snapshot);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyQuotes(
    @Req() request: AuthenticatedRequest,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.quotesService.getMyQuotes(request.user.sub, parseInt(page, 10), parseInt(limit, 10));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getQuoteDetail(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.quotesService.getQuoteDetail(parseInt(id, 10), request.user.sub, request.user.role);
  }

  @Post(':id/order')
  @UseGuards(JwtAuthGuard)
  async convertToOrder(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() data: DeliveryDto) {
    return this.quotesService.convertToOrder(parseInt(id, 10), data, request.user.sub, request.user.role);
  }
}
