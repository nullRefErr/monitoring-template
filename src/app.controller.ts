import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('publish')
  publishMessage(@Query() param: { count: string }) {
    this.appService.publish(parseInt(param.count, 10));
  }
}
