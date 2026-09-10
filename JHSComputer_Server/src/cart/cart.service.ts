import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CartService {
  constructor(private readonly dataSource: DataSource) {}

  async getCart(userId: string) {
    const rows = await this.dataSource.query(
      `
      SELECT
        CART_QUOTE_ID AS cartQuoteId,
        CLIENT_CART_ID AS clientCartId,
        TITLE AS title,
        TOTAL_PRICE AS totalPrice,
        QUOTE_SNAPSHOT_JSON AS quote,
        CREATED_DT AS createdAt
      FROM user_cart_quotes
      WHERE USER_ID = ?
      ORDER BY CREATED_DT DESC
      `,
      [userId],
    );
    return { items: rows, total: rows.length };
  }

  async addCartQuote(userId: string, data: { clientCartId?: string; quote: any }) {
    const quote = data.quote;
    if (!quote || typeof quote !== 'object' || Array.isArray(quote)) {
      throw new BadRequestException('견적 형식이 올바르지 않습니다.');
    }
    const serializedQuote = JSON.stringify(quote);
    if (serializedQuote.length > 100_000) throw new BadRequestException('장바구니 견적이 너무 큽니다.');
    const title = typeof quote.title === 'string' ? quote.title.slice(0, 255) : typeof quote.id === 'string' ? quote.id.slice(0, 255) : 'PC 견적';
    const total = Number(quote.total ?? 0);
    if (!Number.isSafeInteger(total) || total < 0 || total > 100_000_000) {
      throw new BadRequestException('견적 금액이 올바르지 않습니다.');
    }
    const clientCartId = data.clientCartId ?? quote.id ?? null;
    await this.dataSource.query(
      `
      INSERT INTO user_cart_quotes (USER_ID, CLIENT_CART_ID, TITLE, TOTAL_PRICE, QUOTE_SNAPSHOT_JSON)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        TITLE = VALUES(TITLE),
        TOTAL_PRICE = VALUES(TOTAL_PRICE),
        QUOTE_SNAPSHOT_JSON = VALUES(QUOTE_SNAPSHOT_JSON),
        UPDATED_DT = NOW()
      `,
      [userId, clientCartId, title, total, serializedQuote],
    );
    return { ok: true };
  }

  async deleteCartQuote(userId: string, cartQuoteId: string) {
    await this.dataSource.query('DELETE FROM user_cart_quotes WHERE USER_ID = ? AND CART_QUOTE_ID = ?', [userId, cartQuoteId]);
    return { ok: true };
  }
}
