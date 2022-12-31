import { AppConfigModule } from '../config';
import { CatsFactsService } from './cats.facts.service';
import nock from 'nock';
import { testingModuleFactory } from '../utils/testing/testingModuleFactory';

const demo = 'demo4';

describe(`${demo} UserService using nock`, () => {
  let service: CatsFactsService;
  const fact = 'cat fact';
  const successRes = { value: fact };
  const testUrl = 'http://tests.com';
  let mockServer: nock.Interceptor;

  beforeAll(async () => {
    process.env['CAT_FACTS_URL'] = testUrl;

    const module = await testingModuleFactory({
      providers: [CatsFactsService],
      imports: [AppConfigModule],
    });

    service = module.get<CatsFactsService>(CatsFactsService);
  });

  function resetNock() {
    nock.cleanAll();
    mockServer = nock(testUrl).persist().get('/');
  }

  beforeEach(() => {
    resetNock();
  });

  afterAll(() => {
    resetNock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cats fact', async () => {
    mockServer.reply(200, fact);
    const res = await service.get();
    expect(res).toEqual(successRes);
  });

  it('should return error when api responds without a fact', async () => {
    mockServer.replyWithError('network error');
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });

  it('should return empty string when data received is undefined', async () => {
    mockServer.reply(200, undefined);
    const res = await service.get();
    expect(res.value).toEqual('');
  });

  it('should return error when api responds without data field', async () => {
    mockServer.reply(200, { field: 1 });
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });

  it('should return error when api fails with timeout', async () => {
    mockServer.delay({ head: 10000, body: 10000 }).reply(200, fact);
    const res = await service.get();
    expect(res.isFailure()).toBeTruthy();
  });
});
