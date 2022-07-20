import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users: string[] = [];

  add(user: string) {
    if (!user) throw new BadRequestException();
    this.users.push(user);
  }

  remove(user: string) {
    if (!user) throw new BadRequestException();
    this.users = this.users.filter((x) => x !== user);
  }

  getAll() {
    return this.users;
  }
}
