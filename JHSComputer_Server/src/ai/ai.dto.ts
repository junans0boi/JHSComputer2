import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, Length, ValidateNested } from 'class-validator';

export class AiTextPartDto {
  @IsString()
  @Length(1, 2_000)
  text!: string;
}

export class AiHistoryMessageDto {
  @IsIn(['user', 'model'])
  role!: 'user' | 'model';

  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => AiTextPartDto)
  parts!: AiTextPartDto[];
}

export class AiChatDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => AiHistoryMessageDto)
  history: AiHistoryMessageDto[] = [];

  @IsString()
  @Length(1, 2_000)
  message!: string;
}
