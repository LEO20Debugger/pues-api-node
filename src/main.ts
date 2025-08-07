import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// Load environment variables from .env file FIRST
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from '@/src/utils/zod-exception.filters';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Handle Zod validation errors globally
  app.useGlobalFilters(new ZodExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT || 3000, () => {
    const port = process.env.PORT || 3000;
    logger.log(`Server is now listening on port ${port}`);
  });
}
bootstrap();
