import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// 미들웨어 생성하기
// 생성할 미들웨어 클래스에 implements NestMiddleware를 해준다.
// express와 마찬가지로 use를 사용하여 미들웨어 작성

@Injectable() // 미들웨어도 provider(공급자)이기에 Injectable 데코를 달아준다.
export class LoggerMiddleware implements NestMiddleware {
  // nest에서 지원하는 Logger클래스를 이용하여 더 보기 좋게 log할수있다.
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.ip} ${req.method} ${req.originalUrl}`);
    // 응답 요청이 끝났을때 로그 찍기 (res의 on메서드 사용)
    res.on('finish', () => {
      this.logger.log(res.statusCode);
    });
    next();
  }
}
// 생성한 미들웨어를 적용할 모듈에 가서 적용시킨다.

// 글로벌로 사용할 미들웨어 // 글로벌로 사용할 미들웨어는 함수로 선언한다. 클래스를 인스턴스하지 않기때문에?
export const globalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('글로벌 미들웨어 실행');
  console.log(req.rawHeaders[3]);
  next();
};
