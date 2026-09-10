import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from '../auth';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @Public()
  check() {
    return {
      success: true,
      data: {
        service: 'jhs-computer-api',
        status: 'ok',
      },
      message: 'OK',
    };
  }

  @Get('ready')
  @Public()
  async ready() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        success: true,
        data: { service: 'jhs-computer-api', status: 'ready', database: 'ok' },
        message: 'Ready',
      };
    } catch {
      throw new ServiceUnavailableException({
        success: false,
        data: { service: 'jhs-computer-api', status: 'not_ready', database: 'unavailable' },
        message: 'Database is unavailable',
      });
    }
  }
}
