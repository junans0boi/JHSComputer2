import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonCode } from './common-code.entity';

@Injectable()
export class CommonCodesService {
  constructor(
    @InjectRepository(CommonCode)
    private commonCodeRepository: Repository<CommonCode>,
  ) {}

  async getGroups() {
    const rows = await this.commonCodeRepository
      .createQueryBuilder('code')
      .select('code.group', 'group')
      .addSelect('COUNT(*)', 'count')
      .where('code.isActive = :isActive', { isActive: true })
      .groupBy('code.group')
      .orderBy('code.group', 'ASC')
      .getRawMany<{ group: string; count: string }>();

    return rows.map((row) => ({
      group: row.group,
      count: Number(row.count),
    }));
  }

  async getCodes(group?: string) {
    const query = this.commonCodeRepository.find({
      where: group ? { group, isActive: true } : { isActive: true },
      order: { group: 'ASC', sortOrder: 'ASC', code: 'ASC' },
    });

    return query;
  }
}
