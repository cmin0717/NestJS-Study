import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// 인터셉터 만들기
@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 여기 부분이 인터셉터의 프리 컨트롤러
    console.log('Before...');

    const now = Date.now();
    // 리턴 부분이 인터셉터의 사후 요청부분(post-request)
    return (
      next
        .handle()
        // .pipe(tap(() => console.log(`After...${Date.now() - now}ms`)));
        .pipe(
          map((data) => {
            // 여기서 나오는 data는 인터셉트를 적용시킨 곳에서의 리턴값이 들어온다.
            return { sucess: true, data: data, now: now };
          }),
        )
    );
  }
}
