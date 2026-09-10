import { IsObject, IsOptional, IsString, Length } from 'class-validator';

export class AddCartQuoteDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  clientCartId?: string;

  @IsObject()
  quote!: Record<string, unknown>;
}
