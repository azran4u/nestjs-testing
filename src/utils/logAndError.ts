import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'winston';

export function logAndThrow(error: any, logger: Logger, message: string) {
  const errorMessage = `${message} ${error?.message}`;
  logger.error(errorMessage);
  throw new InternalServerErrorException(errorMessage);
}
