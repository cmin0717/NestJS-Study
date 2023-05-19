import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

// 나만의 pipe만들기
@Injectable()
// pipe를 만들기위해 nest의 PipeTransform를 상속시켜서 만들면된다.
export class PositiveIntpipe implements PipeTransform {
  // PipeTransform의 transform를 이용하여 들어온 매개변수를 용도에 맞게 처리 후 리턴해준다.
  transform(value: number) {
    console.log(value);
    if (value < 0) {
      throw new HttpException('value < 0', 400);
    }
    return value;
  }
}
