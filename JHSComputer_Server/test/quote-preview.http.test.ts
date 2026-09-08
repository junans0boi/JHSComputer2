import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../src/auth';
import { QuotesController } from '../src/quotes/quotes.controller';
import { QuotesService } from '../src/quotes/quotes.service';
import { QuotePreviewService } from '../src/quotes/quote-preview.service';

@Module({
  controllers: [QuotesController],
  providers: [
    { provide: QuotesService, useValue: {} },
    { provide: JwtService, useValue: {} },
    { provide: JwtAuthGuard, useValue: { canActivate: () => true } },
    { provide: Reflector, useValue: new Reflector() },
    { provide: 'UserRepository', useValue: {} },
    { provide: QuotePreviewService, useValue: { preview: async () => ({ status: 'READY', candidates: [] }) } },
  ],
})
class PreviewHttpTestModule {}

test('POST /quotes/preview returns 201 through Nest validation and routing', async () => {
  const app = await createApp();
  try {
    const response = await fetch(`${app.url}/quotes/preview`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ profile: { profileVersion: 2 } }),
    });

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { status: 'READY', candidates: [] });
  } finally {
    await app.close();
  }
});

test('POST /quotes/preview rejects a non-object profile at the HTTP seam', async () => {
  const app = await createApp();
  try {
    const response = await fetch(`${app.url}/quotes/preview`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ profile: 'invalid' }),
    });

    assert.equal(response.status, 400);
  } finally {
    await app.close();
  }
});

async function createApp() {
  try {
    const nestApp = await NestFactory.create(PreviewHttpTestModule, { logger: false });
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await nestApp.listen(0);
    const address = (nestApp.getHttpServer() as { address: () => { port: number } }).address();
    return { app: nestApp, url: `http://127.0.0.1:${address.port}`, close: () => nestApp.close() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
