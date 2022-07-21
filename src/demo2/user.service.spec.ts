import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

const demo = 'demo2';

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

  it('should get all users', () => {
    const res = service.getAll();
    expect(res).toEqual([]);
  });

  it('should add user', () => {
    const user = 'user1';
    service.add(user);
    const res = service.getAll();
    expect(res).toEqual([user]);
  });

  it('should throw when trying to add empty user', () => {
    const user = undefined;
    try {
      const res = service.add(user);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should throw when trying to remove empty user', () => {
    const user = undefined;
    try {
      const res = service.remove(user);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
