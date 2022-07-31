import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppConfigModule } from '../config';
import { UserService } from './user.service';

const moduleMocker = new ModuleMocker(global);

const demo = 'demo3';

jest.mock('axios');

describe(`${demo} UserService`, () => {
  let service: UserService;
  const fact = 'cat fact';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [AppConfigModule],
    })
      .useMocker((token) => {
        if (token === WINSTON_MODULE_PROVIDER) {
          return { error: jest.fn() };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cats facts', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: { fact } });
    const res = await service.getCatFacts();
    expect(res).toEqual(fact);
  });

  it('should return error when api responds without a fact', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: {} });
    try {
      const res = await service.getCatFacts();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should return error when api responds without data field', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ status: 200 });
    try {
      const res = await service.getCatFacts();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should return error when api responds with undefined', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue(undefined);
    service.getCatFacts().catch((error) => expect(error).toBeDefined());

    try {
      const res = await service.getCatFacts();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should return error when api fails', async () => {
    // @ts-ignore
    axios.get.mockImplementation(() => {
      throw new Error();
    });
    try {
      const res = await service.getCatFacts();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
