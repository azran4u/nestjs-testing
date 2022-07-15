import { Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UserController {
  users = ['user1', 'user2'];

  @Get()
  findByName(@Query('name') name: string): string[] {
    if (!name) return this.users;
    if (this.users.includes(name)) return [name];
    return [];
  }
}
