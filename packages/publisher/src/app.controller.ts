import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('publishWithChannel')
  publishWithChannel(@Query() param: { count: string }) {
    this.appService.publishWithChannel(parseInt(param.count, 10));
  }

  @Get('publishWithoutChannel')
  publishWithoutChannel(@Query() param: { count: string }) {
    this.appService.publishWithoutChannel(parseInt(param.count, 10));
  }
}
