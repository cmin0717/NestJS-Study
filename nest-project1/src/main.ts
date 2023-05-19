import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 글로벌 미들웨어 설치
  app.use(globalMiddleware);
  // 글로벌 예외처리 필터
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(8000);
}
bootstrap();

// nestJS의 전체적인 사이클 흐름(요청 수명 주기)
// 들어오는 요청
// 글로벌 바인딩된 미들웨어
// 모듈 바운드 미들웨어
// 글로벌 가드
// 컨트롤러 가드
// 루트 가드
// 글로벌 인터셉터(프리컨트롤러)
// 컨트롤러 인터셉터(프리 컨트롤러)
// 경로 인터셉터(프리 컨트롤러)
// 글로벌 파이프
// 컨트롤러 파이프
// 경로 파이프
// 경로 매개변수 파이프
// 컨트롤러(메소드 핸들러)
// 서비스(있는 경우)
// 경로 인터셉터(사후 요청)
// 컨트롤러 인터셉터(사후 요청)
// 글로벌 인터셉터(사후 요청)
// 예외 필터(라우팅, 컨트롤러, 전역) // 위 과정중 문제가 생기면 바로 예외필터로 넘어오게 된다.
// 서버 응답
