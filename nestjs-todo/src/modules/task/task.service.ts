import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
  ) {}

  findAll() {
    return this.tasksRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
  }

  create(taskData: Partial<Task>) {
    const task = this.tasksRepo.create(taskData);
    return this.tasksRepo.save(task);
  }

  async update(id: number, updateData: Partial<Task>) {
    await this.tasksRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.tasksRepo.delete(id);
  }

  // Keep old methods for backward compatibility if needed
  getTask(id: string) {
    console.log(id);
    return this.findOne(Number(id));
  }

  createTask(body: any) {
    console.log(body);
    return this.create(body);
  }

  updateTask(id: string, body: any) {
    console.log(body);
    return this.update(Number(id), body);
  }

  deleteTask(id: string) {
    console.log(id);
    return this.remove(Number(id));
  }

  async deleteCompleted() {
    return this.tasksRepo.createQueryBuilder()
      .delete()
      .where("completedAt IS NOT NULL")
      .execute();
  }
}

