import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), // 환경변수를 사용하기 위해 ConfigModule.forRoot()를 환경변수를 사용할 모듈에 불러온다.
    MongooseModule.forRoot(process.env.DB_URL, {
      // 몽고 디비 연결시 (URL과 옵션을 줄수있따.)
      // 첫번째 인자는 디비 URL 두번쨰는 연결시 옵션을 옵셔널하게 줄수잇따.
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // 현재 버전에서는 기본으로 지원됨으써 옵션에는 없는 옵션이기에 명시하면 오류 발생
      // uesCreateIndex: true,
      // useFindAndModify: false,
    }), // 환경변수 사용시 process.env.환경변수명 형태로 사용해야한다.
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly mode: boolean = process.env.MODE === 'dev' ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // AppModuled의 미들웨어가 작동할때 몽구스의 쿼리를 찍어볼수있다.
    mongoose.set('debug', this.mode); // 개발 할때는 true 배포할때는 false로 둬야하니 환경변수로 관리한다.
  }
}
