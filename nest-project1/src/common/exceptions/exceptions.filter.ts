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
  // catch를 이용하여 예외상황에서 throw한 에러들을 담아 여기서 실행 시킨다.
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // exception변수에는 우리가 throw new HttpException를 사용하여 에러를 던져줄때 넣어둔 에러 메세지와 코드등이 있다.
    const status = exception.getStatus();
    const error = exception.getResponse();

    // express에서 res.status(status).send({...보낼내용})과 아래 코드가 똑같은것
    // error 타입이 스트링이라면 throw시 직접 에러 메세지를 넣어준 경우임으로 if문과 같이 처리한다.
    if (typeof error === 'string') {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: error,
      });
    } else {
      // error가 스트링이 아니라면 원래 HttpException형태의 응답을 담기에 객체분해로 리턴해준다.
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error,
      });
    }
  }
}
