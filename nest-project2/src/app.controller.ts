import { Controller, Get, Req, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CatsService } from './cats/cats.service';

@Controller('test')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/:id')
  getTest(@Req() req: Request, @Body() body1, @Param() params1): string {
    const body = req.body;
    const params = req.params.id;
    console.log(body, body1, params, params1);
    return 'test';
  }
}
