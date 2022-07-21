import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('demo3')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    const res = await this.userService.getCatFacts();
    return res;
  }
}
