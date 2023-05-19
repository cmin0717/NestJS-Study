import { Injectable } from '@nestjs/common';

@Injectable() // module에서 provider에 해당하려면 Injectable으로 의존성을 주입해야한다.
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
