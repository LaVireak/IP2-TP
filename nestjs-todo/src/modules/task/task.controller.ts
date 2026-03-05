import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  getAllTasks() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.findOne(Number(id));
  }

  @Post('/')
  createTask(@Body() body: any) {
    return this.taskService.create(body);
  }

  @Patch('/:id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    return this.taskService.update(Number(id), body);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.remove(Number(id));
  }
}
