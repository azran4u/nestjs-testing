import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent as request } from 'supertest';
import { Demo4Module } from './demo4.module';
import { CatsFactsService } from './cats.facts.service';

const demo = 'demo4';
const uri = `/${demo}`;

jest.mock('axios');

describe(`${demo} UserController`, () => {
  let app: INestApplication;
  const fact = 'cat fact';
  let catsFactsService = { getCatFacts: jest.fn().mockResolvedValue(fact) };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [Demo4Module],
    })
      .overrideProvider(CatsFactsService)
      .useValue(catsFactsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET ${demo}/json`, async () => {
    const res = await request(app.getHttpServer()).get(`${uri}/json`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ fact });
  });

  it(`/GET ${demo}/text`, async () => {
    const res = await request(app.getHttpServer()).get(`${uri}/text`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(fact);
  });

  afterAll(async () => {
    await app.close();
  });
});
