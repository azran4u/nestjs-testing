import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { UserService } from './user.service';

const demo = 'demo3';

jest.mock('axios');

describe(`${demo} UserService`, () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cats facts', async () => {
    const fact = 'cat fact';
    // @ts-ignore
    axios.get.mockResolvedValue({ data: { fact }, status: 200 });
    const res = await service.getCatFacts();
    expect(res).toEqual(fact);
  });

  it('should return error when api responds without a fact', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: {}, status: 200 });
    try {
      const res = await service.getCatFacts();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should return error when api responds without data', async () => {
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
