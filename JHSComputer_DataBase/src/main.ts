import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from './database.module';
import { DatabaseSetupService } from './database-setup.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DatabaseModule, {
    logger: ['log', 'warn', 'error'],
  });

  const logger = new Logger('DatabaseBootstrap');

  try {
    const setup = app.get(DatabaseSetupService);
    await setup.run(process.argv.slice(2));
    logger.log('Database setup completed.');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('DatabaseBootstrap');
  logger.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
