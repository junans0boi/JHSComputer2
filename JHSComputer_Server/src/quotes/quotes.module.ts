import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { Quote } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { QuoteTemplate } from './quote-template.entity';
import { Part } from '../parts/part.entity';
import { PartCategory } from '../parts/part-category.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, QuoteTemplate, Part, PartCategory, User, Order, OrderItem])],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
