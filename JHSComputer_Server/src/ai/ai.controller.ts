import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { history: any[]; message: string }) {
    const { history = [], message } = body;
    return this.aiService.chat(history, message);
  }
}
