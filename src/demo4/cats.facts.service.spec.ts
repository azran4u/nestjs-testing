import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppConfigModule } from '../config';
import { CatsFactsService } from './cats.facts.service';
import nock from 'nock';

const moduleMocker = new ModuleMocker(global);

const demo = 'demo4';

describe(`${demo} UserService using nock`, () => {
  let service: CatsFactsService;
  const fact = 'cat fact';
  const successRes = { value: fact };
  const testUrl = 'http://tests.com';

  beforeAll(async () => {
    process.env['CAT_FACTS_URL'] = testUrl;
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsFactsService],
      imports: [AppConfigModule],
    })
      .useMocker((token) => {
        if (token === WINSTON_MODULE_PROVIDER) {
          return {
            error: jest.fn(),
            child: jest.fn().mockReturnValue({ error: jest.fn() }),
          };
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
    service = module.get<CatsFactsService>(CatsFactsService);
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cats fact', async () => {
    const scope = nock(testUrl).persist().get('/').reply(200, fact);
    const res = await service.get();
    expect(res).toEqual(successRes);
  });

  it('should return error when api responds without a fact', async () => {
    const scope = nock(testUrl)
      .persist()
      .get('/')
      .replyWithError('network error');
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });

  it('should return empty string when data received is undefined', async () => {
    const scope = nock(testUrl).persist().get('/').reply(200, undefined);
    const res = await service.get();
    expect(res.value).toEqual('');
  });

  it('should return error when api responds without data field', async () => {
    const scope = nock(testUrl).persist().get('/').reply(200, { field: 1 });
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });

  it('should return error when api fails with timeout', async () => {
    const scope = nock(testUrl)
      .persist()
      .get('/')
      .delay({ head: 10000, body: 10000 })
      .reply(200, fact);
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });
});
