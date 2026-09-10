import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddCartQuoteDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Get()
  async getCart(@Req() request: Request & { user?: { sub: string } }) {
    return this.cartService.getCart(request.user!.sub);
  }

  @Post()
  async addCartQuote(@Req() request: Request & { user?: { sub: string } }, @Body() body: AddCartQuoteDto) {
    return this.cartService.addCartQuote(request.user!.sub, { clientCartId: body.clientCartId, quote: body.quote });
  }

  @Delete(':cartQuoteId')
  async deleteCartQuote(@Req() request: Request & { user?: { sub: string } }, @Param('cartQuoteId') cartQuoteId: string) {
    return this.cartService.deleteCartQuote(request.user!.sub, cartQuoteId);
  }
}
