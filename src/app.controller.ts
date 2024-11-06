import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/film')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getFilm(@Query('title') title: string) {
    return this.appService.getFilm(title);
  }
}
