import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { agent as request } from 'supertest';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const demo = 'demo2';
const uri = `/${demo}`;

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

  it('should get all users', async () => {
    const res = await request(app.getHttpServer()).get(uri);
    expect(res.body).toEqual([]);
    expect(res.statusCode).toEqual(200);
  });

  it('should add user', async () => {
    await request(app.getHttpServer()).post(uri).send({ user: 'user1' });
    const res = await request(app.getHttpServer()).get(uri);
    expect(res.body).toEqual(['user1']);
    expect(res.statusCode).toEqual(200);
  });

  it('should remove user', async () => {
    const user = 'user1';
    await request(app.getHttpServer()).post(uri).send({ user });
    await request(app.getHttpServer()).delete(`${uri}?user=${user}`);
    const res = await request(app.getHttpServer()).get(uri);
    expect(res.body).toEqual([]);
    expect(res.statusCode).toEqual(200);
  });

  it('should error when trying to add empty user', async () => {
    const res = await request(app.getHttpServer()).post(uri).send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should error when trying to remove empty user', async () => {
    const res = await request(app.getHttpServer()).delete(uri);
    expect(res.statusCode).toEqual(400);
  });
});
