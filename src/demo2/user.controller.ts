import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('demo2')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete()
  remove(@Query('user') user: string) {
    this.userService.remove(user);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Post()
  add(@Body('user') user: string) {
    this.userService.add(user);
  }
}
