import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/exceptions/exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
// _1.default is not a function에러가 나온다면 아래와 같이 받아보면 된다.(tsconfig 컴파일옵션을 변경하거나)
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 글로벌 미들웨어 설치
  app.use(globalMiddleware);

  // 벨리데이터 파이프
  app.useGlobalPipes(new ValidationPipe());

  // 글로벌 예외처리 필터
  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger API 보안 설정 ( npm i express-basic-auth )외부 라이브러리 사용
  app.use(
    // 보안 설정할 엔드포인트
    ['/docs', '/docs-json'],
    // expressBasicAuth라이브러리를 사용하여 해당 엔드포인트에서는 로그인후 접근하게 만든다.
    expressBasicAuth({
      // 해당 엔드포인트로 접근시 로그인 하게할건지 정하는 옵션
      challenge: true,
      // swagger에 접속할때 필요한 아이디 입력(환경변수로 관리)
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  // swagger 적용하기
  const config = new DocumentBuilder()
    .setTitle('C.I.C') // swagger의 이름 (큰 의미없다 그냥 어떤 API를 만드는지 등등)
    .setDescription('cats') // swagger의 설명
    .setVersion('1.0') // swagger의 버전
    .build(); // 위와 같은 걸로 swagger 설정 빌드

  // 위에서 config와 SwaggerModule.createDocument를 사용하여 swagger document 생성
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // 생성한 document와 app, 그리고 swagger의 엔드포인트를 SwaggerModule.setup를 사용하여 열어준다.
  SwaggerModule.setup('docs', app, document);

  // cors 설정
  app.enableCors({
    // origin은 어떤 URL를 허용할껀지 *는 모두 허용이다. 나중에 배포할때는 허용할 부분만 넣어주어야한다.
    origin: '*',
    credentials: true, // 인증정보를 포함한 요청을 허락하는가에 대한 설정(JWT나 HTTPS같은건가?)(프론트,백 둘다 켜줘야 통신 가능하다.)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
