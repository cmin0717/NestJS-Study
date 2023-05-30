import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 템플릿 엔진 설정
  // useStaticAssets를 사용하여 해당 경로에 있는 정적요소들(CSS / JS)을 사용 (__dirname : 현재 파일의 경로)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // setBaseViewsDir를 사용하여 해당 경로에 있는 HTML파일를 사용
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // hbs로 탬플릿 엔진 설정
  app.setViewEngine('hbs');

  // class-validator 사용하기 위한 글로벌 파이브 설치
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}
bootstrap();

// MVC 패턴(Model-View-Controller)이란? (키워드는 분리이다!)
// 디자인 패턴 중 하나이며 Model, View, Controller로 나누어 설계한다.
// Model : 데이터가 무엇인지 정의 (DB라고 보면 될듯 하다.)
// View : 데이터를 보여주는 방식 (HTML / CSS / JS파일) (디자인 영역)
// Controller : 사용자의 입력에 대한 응답으로 모델 및/뷰를 업데이트라는 로직 (우리가 알고있는 NestJS의 컨트롤러로 생각하면 될듯)
// 쉽게 말해 MVC패턴은 각 관심사를 분리 하는데 목적이 있다.
// 더 나은 업무의 분리와 향상된 관리를 할수있게 해준다.
// MVC패턴을 기반으로 MVVM, MVP, MVW패턴들이 있다.

// MVC 패턴의 HTML 뷰를 렌더링하기 위한 템플릿 엔진을 설치해야한다.
// 템플릿 엔진이란 HTML을 렌더링 해주는 엔진이다.
// npm i --save hbs
// hbs를 사용하기 위해서는 익스프레스 인스턴스로 생성해주어야한다.
