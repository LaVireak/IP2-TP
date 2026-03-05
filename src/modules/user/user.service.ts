import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(userData: Partial<User>) {
    const user = this.usersRepo.create(userData);
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find({ relations: ['tasks'] });
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id }, relations: ['tasks'] });
  }

  async update(id: number, updateData: Partial<User>) {
    await this.usersRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.usersRepo.delete(id);
  }

  // Keep old methods for backward compatibility if needed
  createUser(body: any) {
    console.log(body);
    return this.create(body);
  }

  getUser(username: string) {
    console.log(username);
    return this.usersRepo.findOne({ where: { username } });
  }

  updateUser(body: any) {
    console.log(body);
    return this.update(body.id, body);
  }

  deleteUser(username: string) {
    console.log(username);
    return this.usersRepo.delete({ username });
  }
}
