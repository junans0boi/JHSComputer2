import { Body, Controller, Delete, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
  ) {}

  private userId(auth: string) {
    const token = auth?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    try {
      return (this.jwtService.verify(token) as { sub: string }).sub;
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get()
  async getCart(@Headers('authorization') auth: string) {
    return this.cartService.getCart(this.userId(auth));
  }

  @Post()
  async addCartQuote(@Headers('authorization') auth: string, @Body() body: { clientCartId?: string; quote?: any }) {
    return this.cartService.addCartQuote(this.userId(auth), { clientCartId: body.clientCartId, quote: body.quote });
  }

  @Delete(':cartQuoteId')
  async deleteCartQuote(@Headers('authorization') auth: string, @Param('cartQuoteId') cartQuoteId: string) {
    return this.cartService.deleteCartQuote(this.userId(auth), cartQuoteId);
  }
}
