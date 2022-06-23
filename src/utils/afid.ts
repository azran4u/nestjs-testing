import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Configuration } from '../config/config.factory';
import { afidFactory } from './afid.factory';

export async function afid(app: INestApplication) {
  const isAfidEnabled = app.get(ConfigService).get<Configuration>('config')
    .afid.enabled;
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

  if (isAfidEnabled) {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();

    try {
      await afidFactory(instance, 'is working');
    } catch (error) {
      const message = `afid initialization failed ${error}`;
      logger.error(message);
      throw new InternalServerErrorException(message);
    }
  }
}
