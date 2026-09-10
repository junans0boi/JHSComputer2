import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth';
import { CommonCodesService } from './common-codes.service';

@Controller('common-codes')
export class CommonCodesController {
  constructor(private readonly commonCodesService: CommonCodesService) {}

  @Get('groups')
  @Public()
  async getGroups() {
    return this.commonCodesService.getGroups();
  }

  @Get()
  @Public()
  async getCodes(@Query('group') group?: string) {
    return this.commonCodesService.getCodes(group);
  }

  @Get(':group')
  @Public()
  async getCodesByGroup(@Param('group') group: string) {
    return this.commonCodesService.getCodes(group);
  }
}
