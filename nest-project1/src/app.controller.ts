import { Controller, Get, Req, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CatsService } from './cats/cats.service';

// Controller안에 엔드포인터를 넣어주어 줄수 있다. 라우터 느낌으로 사용하면 될듯하다.
@Controller('test')
export class AppController {
  // 의존성 주입
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}
  // 이렇게 다른 서비스를 의존성 주입으로 사용할수있다.
  // 하지만 주의해야할점은 catsService를 다른곳에서 사용하려면 해당 서비스를 provider로 지정한 모듈에서 exports해주어야만 한다.
  // 또한 현재 CatsService가 속해있는 모듈이 현재 모듈에 import되어있기에 import된 모듈의 provider를 사용할수잇는것이다.
  // 현재 모듈의 provider에 catsService를 추가하여 사용할수도 있지만 좋은 코드가 아니다.
  // 나중가서도 provider에 계속해서 추가해 나아갈수는 없기에

  @Get('hello')
  // 이런식으로 get의 엔드포인트를 정할수있으며 req, res를 받아올수있다.
  getHello(): string {
    // console.log(req);
    // console.log(res);
    return this.appService.getHello();
  }

  @Get('test/:id') // 동적 라우팅도 가능하다.
  getTest(@Req() req: Request, @Body() body1, @Param() params1): string {
    // 아래와 같은 방향으로 사용할수도 있지만 Nest에서는 매개변수로 받아사용하는게 관례이다?
    // body
    const body = req.body;
    // params
    const params = req.params.id;
    console.log(body, body1, params, params1);
    return 'test';
  }
}
