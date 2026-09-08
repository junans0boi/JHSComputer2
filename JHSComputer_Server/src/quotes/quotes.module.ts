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
import { Payment } from '../orders/payment.entity';
import { SupplierOffer } from '../parts/supplier-offer.entity';
import { SupplierProduct } from '../parts/supplier-product.entity';
import { AuthModule } from '../auth/auth.module';
import { BenchmarksModule } from '../benchmarks/benchmarks.module';
import { QuotePreviewService } from './quote-preview.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, QuoteTemplate, Part, PartCategory, User, Order, OrderItem, Payment, SupplierOffer, SupplierProduct]), AuthModule, BenchmarksModule],
  controllers: [QuotesController],
  providers: [QuotesService, QuotePreviewService],
  exports: [QuotesService],
})
export class QuotesModule {}
