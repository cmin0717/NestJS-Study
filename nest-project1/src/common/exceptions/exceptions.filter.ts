import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 예외처리 필터 만들기

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // exception변수에는 우리가 throw new HttpException를 사용하여 에러를 던져줄때 넣어둔 에러 메세지와 코드등이 있다.
    const status = exception.getStatus();
    const error = exception.getResponse();

    // express에서 res.status(status).send({...보낼내용})과 아래 코드가 똑같은것
    if (typeof error === 'string') {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: error,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error,
      });
    }
  }
}
