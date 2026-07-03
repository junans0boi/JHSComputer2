import { Controller, Get, Param, Query, Post, Body, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
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

  @Get('track/:orderNo')
  async getOrderByNo(@Param('orderNo') orderNo: string) {
    return this.ordersService.getOrderByNo(orderNo);
  }

  @Get(':id')
  async getOrderDetail(@Param('id') id: string) {
    return this.ordersService.getOrderDetail(parseInt(id, 10));
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('memo') memo?: string,
  ) {
    return this.ordersService.updateOrderStatus(parseInt(id, 10), status, memo);
  }

  @Patch(':id/shipping')
  async updateShipping(
    @Param('id') id: string,
    @Body('trackingCompany') trackingCompany?: string,
    @Body('trackingNo') trackingNo?: string,
    @Body('memo') memo?: string,
  ) {
    return this.ordersService.updateShipping(parseInt(id, 10), { trackingCompany, trackingNo, memo });
  }

  @Post('sync')
  async syncOrder(@Body() data: any) {
    return this.ordersService.syncOrder(data);
  }

  @Post()
  async createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }
}
