import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { agent as request } from 'supertest';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const demo = 'demo3';
const uri = `/${demo}`;

jest.mock('axios');

describe(`${demo} UserController`, () => {
  let controller: UserController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get cats facts', async () => {
    const fact = 'cat fact';
    // @ts-ignore
    axios.get.mockResolvedValue({ data: { fact }, status: 200 });
    const res = await request(app.getHttpServer()).get(uri);
    expect(res.statusCode).toEqual(200);
  });
});
