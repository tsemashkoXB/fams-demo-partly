import 'dotenv/config';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';
import { uploadsRoot } from './config/uploads';

async function bootstrap() {
  validateEnv(process.env);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
  });
  app.use('/uploads', express.static(uploadsRoot));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
