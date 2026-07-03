import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

const JWT_SECRET = process.env.JWT_SECRET ?? 'jhs-computer-secret-key-2024';

@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '7d' } })],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
