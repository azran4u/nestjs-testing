import { InstanceToken } from '@nestjs/core/injector/module';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

export function nestMetadataMock(token: InstanceToken) {
  const moduleMocker = new ModuleMocker(global);
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  return new Mock();
}
