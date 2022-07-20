import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

@Controller('demo1')
export class UserController {
  users = ['user1', 'user2'];

  @Get()
  findByName(@Query('name') name: string): string[] {
    if (!name) return this.users;
    if (name === 'throw') throw new BadRequestException();
    if (this.users.includes(name)) return [name];
    return [];
  }
}
