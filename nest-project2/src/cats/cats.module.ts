import { CatsRepository } from './cats.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './cats.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express/multer';

@Module({
  // 현재 모듈에서 사용할 스키마를 MongooseModule.forFeature를 사용하여 주입해주어야한다.
  // []안에 객체 형태로 어떤 스키마를 등록할지 정한다.
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    // authservice를 사용하기 위해 불러온다. 현재 순환 참조 상태이기에 forwardRef를 사용해주어야한다.
    forwardRef(() => AuthModule),

    // multer사용을 위한 모듈 임포트
    MulterModule.register({ dest: '.upload' }), // dest: 파일을 저장할 디폴트 위치(아무설정이 없을 경우에만 해당 위치에 저장)
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository], // 서비스 로직에서 CatsRepository를 사용하기위해 provider에 추가해준다.
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
