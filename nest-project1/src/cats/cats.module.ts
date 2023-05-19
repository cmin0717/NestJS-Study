import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // CatsService를 exports해줌으로써 다른 controllers에서도 CatsService에 의존성부여하여 사용할수있게된다.
})
export class CatsModule {}
// 모듈은 기본적으로 공급자(providers)를 캡슐화합니다.
// 그렇기 떄문에 모듈에 속해있는것들을 사용하기 위해서는 exports해줘서 캡슐화에서 꺼내주어야한다.
// 아래의 export가 아닌 @Module안에있는 export를 의미하는것
