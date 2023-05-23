import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// 커스텀 데코레이터
// createParamDecorator를 사용하여 커스텀 데코레이터를 선언한다.
// ExecutionContext를 ctx인자에 정보를 담고
// switchToHttp().getRequest()를 사용하여 ctx에서 현재 req를 받아온다.(res도 받아올수있다.)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 현재 req를 받아온다.
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
