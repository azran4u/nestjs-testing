import { InstanceToken } from '@nestjs/core/injector/module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { nestMetadataMock } from './nestMetadataMock';
import { winstonLoggerMock } from './winstonLoggerMock';

export function nestModuleMocker(token: InstanceToken) {
  if (token === WINSTON_MODULE_PROVIDER) {
    return winstonLoggerMock;
  }

  if (typeof token === 'function') {
    return nestMetadataMock(token);
  }
}
