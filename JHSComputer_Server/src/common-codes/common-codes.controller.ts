import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommonCodesService } from './common-codes.service';

@Controller('common-codes')
export class CommonCodesController {
  constructor(private readonly commonCodesService: CommonCodesService) {}

  @Get('groups')
  async getGroups() {
    return this.commonCodesService.getGroups();
  }

  @Get()
  async getCodes(@Query('group') group?: string) {
    return this.commonCodesService.getCodes(group);
  }

  @Get(':group')
  async getCodesByGroup(@Param('group') group: string) {
    return this.commonCodesService.getCodes(group);
  }
}
