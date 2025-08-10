import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from '@/src/utils/zod-exception.filters';
import { SentryExceptionFilter } from '@/src/utils/sentry-exception.filter';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global validation and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ZodExceptionFilter(), new SentryExceptionFilter());

  await app.listen(process.env.PORT || 3000);
  logger.log(`Server running on port ${process.env.PORT || 3000}`);
}

bootstrap();
