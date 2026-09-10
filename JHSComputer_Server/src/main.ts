import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.disable('x-powered-by');
  app.set('trust proxy', config.get<string>('TRUST_PROXY') === 'true');
  app.use(json({ limit: config.get<string>('JSON_BODY_LIMIT') ?? '256kb' }));
  app.use(urlencoded({ extended: true, limit: config.get<string>('JSON_BODY_LIMIT') ?? '256kb' }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  const configuredOrigins = (config.get<string>('CORS_ORIGINS') ?? config.get<string>('FRONTEND_URL') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const developmentOrigins = config.get<string>('NODE_ENV') === 'development'
    ? [
        'http://localhost:6001',
        'http://127.0.0.1:6001',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]
    : [];
  const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  });
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (config.get<string>('NODE_ENV') === 'production') {
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = config.get<number>('API_PORT') ?? 6002;
  await app.listen(port);
  console.log(`🚀 API 서버 실행 중: http://localhost:${port}/api`);
}

void bootstrap();
