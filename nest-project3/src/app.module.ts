import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      // app모듈에서 config에 옵션을 글로벌로 두면 다른 모듈에서도 환경변수를 사용할수있게 된다.
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly mode: boolean = process.env.MODE === 'dev' ? true : false;

  configure() {
    mongoose.set('debug', this.mode);
  }
}
