import { IsObject } from 'class-validator';

export class QuotePreviewDto {
  @IsObject()
  profile!: Record<string, unknown>;
}
