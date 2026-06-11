import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { TaskType } from '../types/task.type';
import { TaskService } from '../../modules/task/task.service';
import { ForbiddenException } from '@nestjs/common';

@Resolver(() => TaskType)
export class TaskCodeFirstResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [TaskType])
  async tasks() {
    return this.taskService.findAll();
  }

  @Mutation(() => TaskType)
  async createTask(@Args('name') name: string) {
    return this.taskService.create({
      name,
      description: '',
      createdAt: new Date(),
      completedAt: null,
    });
  }

  @Mutation(() => TaskType)
  async toggleTaskStatus(
    @Args('id', { type: () => ID }) id: number,
    @Context() context: any,
  ) {
    const task = await this.taskService.findOne(Number(id));
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const completedAt = task.completedAt ? null : new Date();
    return this.taskService.update(Number(id), { completedAt });
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id', { type: () => ID }) id: number,
    @Context() context: any,
  ) {
    const req = context.req;
    const role = req?.headers?.['x-hasura-role'];

    // Enforce permission: only 'admin' role can delete tasks
    if (role === 'user') {
      throw new ForbiddenException('Access Denied: Users are not allowed to delete tasks');
    }

    await this.taskService.remove(Number(id));
    return true;
  }

  @Mutation(() => Boolean)
  async deleteCompletedTasks(@Context() context: any) {
    const req = context.req;
    const role = req?.headers?.['x-hasura-role'];

    // Enforce permission: only 'admin' role can delete tasks
    if (role === 'user') {
      throw new ForbiddenException('Access Denied: Users are not allowed to delete tasks');
    }

    await this.taskService.deleteCompleted();
    return true;
  }
}
