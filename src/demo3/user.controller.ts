import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('demo3')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('json')
  async getJson() {
    const fact = await this.userService.getCatFacts();
    return { fact };
  }

  @Get('text')
  async getText() {
    return this.userService.getCatFacts();
  }
}
