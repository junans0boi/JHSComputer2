import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, Public, RateLimit, Roles, RolesGuard } from '../auth';
import { QuotesService } from '../quotes/quotes.service';
import { SyncOrderDto, UpdateOrderStatusDto, UpdateShippingDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

type AuthenticatedRequest = Request & { user: { sub: string; role: string } };

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly quotesService: QuotesService,
  ) {}

  // ── 공개 엔드포인트 ──────────────────────────────────────────────

  @Get('track/:orderNo')
  @Public()
  async getOrderByNo(@Param('orderNo') orderNo: string) {
    return this.ordersService.getOrderByNo(orderNo);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @RateLimit(5, 60_000)
  async syncOrder(@Req() request: AuthenticatedRequest, @Body() data: SyncOrderDto) {
    return this.quotesService.convertToOrder(data.quoteId, data, request.user.sub, request.user.role);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(
    @Req() request: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.ordersService.getMyOrders(request.user.sub, parseInt(page, 10), parseInt(limit, 10));
  }

  // ── 관리자 전용 엔드포인트 ──────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getOrders(
    @Query('userId') userId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.ordersService.getOrders({
      userId: userId ? parseInt(userId, 10) : undefined,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getOrderDetail(@Param('id') id: string) {
    return this.ordersService.getOrderDetail(parseInt(id, 10));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateOrderStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(parseInt(id, 10), data.status, data.memo, request.user.sub);
  }

  @Patch(':id/shipping')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateShipping(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateShippingDto,
  ) {
    return this.ordersService.updateShipping(parseInt(id, 10), data, request.user.sub);
  }
}
