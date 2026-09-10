import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { OrderStatus } from '../../common/enums';
import { DeliveryDto } from '../../quotes/dto/quote.dto';

export class SyncOrderDto extends DeliveryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  quoteId!: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  memo?: string;
}

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  @Length(1, 40)
  trackingCompany?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  trackingNo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  memo?: string;
}
