import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { Public, RateLimit } from '../auth';
import { AiChatDto } from './ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @Public()
  @RateLimit(20, 60_000)
  async chat(@Body() body: AiChatDto) {
    return this.aiService.chat(body.history ?? [], body.message);
  }
}
