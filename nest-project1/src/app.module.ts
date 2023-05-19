import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

// 해당 모듈에 의존성을 부여한다?
@Module({
  imports: [CatsModule], // 	이 모듈에 필요한 공급자를 내보내는 가져온 모듈 목록 // 모듈안에는 모듈만의 다른 컨트롤러와 프로바이더가 있다.
  controllers: [AppController], // 인스턴스화되어야 하는 이 모듈에 정의된 컨트롤러 세트 // 컨트롤러 안에서 provider 친구들을 사용
  providers: [AppService], // Nest 인젝터에 의해 인스턴스화되고 적어도 이 모듈에서 공유될 수 있는 제공자
})
export class AppModule implements NestModule {
  // 미들웨어는 특정 데코레이터가 없다
  // 적용할 모듈에 implements NestModule 인터페이스를 상속시킨다.
  // NestModule에 있는 configure메서드를 사용하여 미들웨어를 적용시킨다.
  // configure의 매개변수로는 consumer: MiddlewareConsumer가 들어간다.
  // consumer에는 apply, forRoutes, exclude의 메서드 존재
  // apply를 통해 어떤 미들웨어를 적용시킬지 설정
  // forRoutes를 통해 어떤 경로, 어떤 메서드에 적용시킬지 설정
  // exclude를 통해 제외할 경로와 메서드 설정(옵셔널하다.)
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
// forRoutes를 사용하는 여러 방법
// '*' 해당 모듈에 모든 경로
// 'AppController' AppController을 가는 경로들만
// { path: 'ab*cd', method: RequestMethod.ALL } 특정 경로와 메서드를 적용시킬수도 있다.

// Nest CLI
// module, controller, service등등을 직접 코딩하여 틀을 잡을수 있지만 cli를 이용하여 만들수도 있다.
// cats라는 모듈을 만들라면 nest g module <만들 모듈명> 명령어를 사용하여 생성가능
// controller와 service또한 nest g controller혹은 service <어떤 모듈에 생성할지> 명령어를 통해 생성가능
// 틀만 생성된다.
// cats라는 모듈을 만들어서 저번에 express에서 작성한 api를 nest로 작성하려고 하는데
// nest g module cats -> nest g controller -> cats nest g service cats 순으로 명령어를 작성하여 기본적인 틀을 생성할 수 있다.
// nest g middleware <미들웨어 이름> 명령어를 통해 middleware틀을 만들수 있다.
