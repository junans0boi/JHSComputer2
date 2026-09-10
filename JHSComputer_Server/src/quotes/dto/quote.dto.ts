import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class QuotePartSnapshotDto {
  @IsString()
  @Length(1, 30)
  category!: string;

  @IsString()
  @Length(1, 700)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  memo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  productNo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  detailUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  offerId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 700)
  offerName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  stockStatus?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  supplier?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  priceCheckedAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  publicPrice?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(64)
  quantity = 1;

  // Kept for backwards-compatible clients. The server never trusts this value.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  price?: number;
}

export class SaveQuoteSnapshotDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  purpose?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  budget?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(32)
  @IsString({ each: true })
  compatibility?: string[];

  @IsOptional()
  @IsObject()
  input?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  profile?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  preview?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  performance?: unknown[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  @Type(() => QuotePartSnapshotDto)
  parts!: QuotePartSnapshotDto[];
}

export class DeliveryDto {
  @IsString()
  @Length(1, 100)
  recipientName!: string;

  @IsString()
  @Length(7, 20)
  recipientPhone!: string;

  @IsString()
  @Length(3, 20)
  postalCode!: string;

  @IsString()
  @Length(1, 255)
  address1!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  address2?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  deliveryMemo?: string;
}

export class CreateQuoteDto extends SaveQuoteSnapshotDto {}
