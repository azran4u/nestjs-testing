import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppModule } from './app.module';
import { Configuration } from './config/config.factory';
import { afidFactory } from './utils/afid';

async function bootstrap() {
  let app: INestApplication;
  try {
    app = await NestFactory.create(AppModule);
  } catch (error) {
    console.error(`nest factory error ${error}`);
  }
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

  const afidEnabled = false;
  if (afidEnabled) {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();

    try {
      await afidFactory(instance, 'is working');
    } catch (error) {
      logger.error(`afid factory failed ${error}`);
    }
  }

  const port = app.get(ConfigService).get<Configuration>('config').server.port;

  try {
    await app.listen(port);
    logger.info(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`nest factory error ${error}`);
  }
}
bootstrap();
