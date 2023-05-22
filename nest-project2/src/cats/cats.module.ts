import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './cats.schema';

@Module({
  // 현재 모듈에서 사용할 스키마를 MongooseModule.forFeature를 사용하여 주입해주어야한다.
  // []안에 객체 형태로 어떤 스키마를 등록할지 정한다.
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
