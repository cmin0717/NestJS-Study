import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// 미들웨어 생성하기

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.ip} ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
      this.logger.log(res.statusCode);
    });
    next();
  }
}

export const globalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('글로벌 미들웨어 실행');
  console.log(req.rawHeaders[3]);
  next();
};
