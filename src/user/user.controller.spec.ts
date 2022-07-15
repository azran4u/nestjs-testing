import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent as request } from 'supertest';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    userController = moduleRef.get<UserController>(UserController);
  });

  it('get all users', async () => {
    const res = await request(app.getHttpServer()).get('/users');
    expect(res.body).toEqual(['user1', 'user2']);
    expect(res.statusCode).toEqual(200);
  });

  it('get user by name', async () => {
    const name = 'user1';
    const res = await request(app.getHttpServer()).get(`/users?name=${name}`);
    expect(res.body).toEqual([name]);
    expect(res.statusCode).toEqual(200);
  });

  it('non exists user return empty array', async () => {
    const name = 'non exists user';
    const res = await request(app.getHttpServer()).get(`/users?name=${name}`);
    expect(res.body).toEqual([]);
    expect(res.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
