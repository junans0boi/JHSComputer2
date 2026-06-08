import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';
import { Part } from './part.entity';
import { PartCategory } from './part-category.entity';
import { SupplierOffer } from './supplier-offer.entity';
import { SupplierOfferPrice } from './supplier-offer-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Part,
      PartCategory,
      SupplierOffer,
      SupplierOfferPrice,
    ]),
  ],
  controllers: [PartsController],
  providers: [PartsService],
  exports: [PartsService],
})
export class PartsModule {}
