import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { nestModuleMocker } from './nestModuleMocker';

export async function testingModuleFactory(metadata: ModuleMetadata) {
  return Test.createTestingModule(metadata)
    .useMocker(nestModuleMocker)
    .compile();
}
