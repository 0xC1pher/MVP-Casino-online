// users/users.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin', 10)
    }
  ];

  async findOne(username: string) {
    return this.users.find(user => user.username === username);
  }
}
