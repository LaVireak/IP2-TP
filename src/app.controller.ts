import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// @UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
