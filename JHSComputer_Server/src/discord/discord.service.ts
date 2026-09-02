import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly webhookUrl: string | null;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get<string>('DISCORD_WEBHOOK_URL') ?? null;
  }

  async sendOrderNotification(order: {
    orderNo: string;
    recipientName: string;
    recipientPhone: string;
    address1: string;
    address2?: string | null;
    totalPrice: number;
    assemblyFee: number;
    parts: Array<{ partNameSnapshot: string; quantity: number; publicPrice: number }>;
  }) {
    if (!this.webhookUrl) {
      this.logger.warn('DISCORD_WEBHOOK_URL not configured — skipping notification');
      return;
    }

    const partLines = order.parts
      .map((p) => `> • ${p.partNameSnapshot} ×${p.quantity} — ${p.publicPrice.toLocaleString()}원`)
      .join('\n');

    const embed = {
      title: '🛒 새 주문이 접수됐습니다!',
      color: 0x00b894,
      fields: [
        { name: '주문번호', value: `\`${order.orderNo}\``, inline: true },
        { name: '수령인', value: order.recipientName, inline: true },
        { name: '연락처', value: order.recipientPhone, inline: true },
        { name: '배송지', value: [order.address1, order.address2].filter(Boolean).join(' '), inline: false },
        { name: '주문 부품', value: partLines || '(내역 없음)', inline: false },
        {
          name: '금액',
          value: `부품 합계: **${(order.totalPrice - order.assemblyFee).toLocaleString()}원**\n조립비: **${order.assemblyFee.toLocaleString()}원**\n**총합: ${order.totalPrice.toLocaleString()}원**`,
          inline: false,
        },
      ],
      footer: { text: 'JHSComputer 주문 알림' },
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
      if (!res.ok) {
        this.logger.error(`Discord webhook failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      this.logger.error('Discord webhook error', err);
    }
  }

  async sendStatusNotification(orderNo: string, status: string, memo?: string | null) {
    if (!this.webhookUrl) return;

    const statusLabels: Record<string, string> = {
      WAITING_DEPOSIT: '💳 입금 대기',
      DEPOSIT_CONFIRMED: '✅ 입금 확인',
      PARTS_ORDERING: '📦 부품 주문 중',
      ASSEMBLING: '🔧 조립 중',
      TESTING: '🧪 테스트 중',
      SHIPPING: '🚚 배송 중',
      DELIVERED: '🏠 배송 완료',
      CANCELLED: '❌ 주문 취소',
    };

    const embed = {
      title: `${statusLabels[status] ?? status} — 주문 상태 변경`,
      color: status === 'DELIVERED' ? 0x00b894 : status === 'CANCELLED' ? 0xe17055 : 0x74b9ff,
      fields: [
        { name: '주문번호', value: `\`${orderNo}\``, inline: true },
        { name: '변경 상태', value: statusLabels[status] ?? status, inline: true },
        ...(memo ? [{ name: '메모', value: memo, inline: false }] : []),
      ],
      footer: { text: 'JHSComputer 주문 알림' },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (err) {
      this.logger.error('Discord status webhook error', err);
    }
  }
}
