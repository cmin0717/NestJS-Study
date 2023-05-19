import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/exceptions.filter';
import { PositiveIntpipe } from 'src/common/pipe/positiveInt.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter) // UseFilters데코레이터를 이용하여 예외처리 필터를 사용한다. / controller에 전체적으로 적용시킬수 있다.
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  // @UseFilters(HttpExceptionFilter) // 개별로 적용시킬수도 있다.
  getAllCat() {
    throw new HttpException('에러 메세지', 401);
    return 'all cat';
  }

  @Get(':id')
  // pipe는 일반적으로 두가지 경우에 자주 사용한다. // 직접 파이브를 만들어서 사용할수도있다. PipeTransform를 이용하여
  // 변환 : 입력 데이터를 원하는 형식으로 변환(예: 문자열에서 정수로)
  // validation : 입력 데이터를 평가하고 유효한 경우 변경되지 않은 상태로 전달합니다. 그렇지 않으면 예외를 throw합니다.
  getPartCat(@Param('id', ParseIntPipe) param: number) {
    // 동적 라우터를 @Param() param이런식으로 받으면 아래와 같이 나온다.
    // console.log(param); // { id: '1234' }형태로 받아온다.

    // @Param('id') param 이런식으로 정확히 어떤 값을 받을건지 알려주다면
    console.log(param); // 1234 형태로 받아온다. 정확히 값만 받을수 있다.
    console.log(typeof param); // ParseIntPipe를 하지 않으면 디폴트로는 string 형태로 받아온다.

    // ParseIntPipe를 사용하여 들어오는 값을 인트로 받기에 param의 타입을 number로 줄수있다.
    // 또한 param의 타입을 주었기에 엉뚱한 타입이 오면 유효성검사도 할수있게된다.
    return 'part cat';
  }

  @Post()
  AddCat() {
    return 'add cat';
  }

  @Put(':id')
  // pipe다중 연결하기(이용하기)
  // 들어오는 값은 'id' -> ParseIntPipe -> ParseIntPipe -> Param에 들어오게 된다.
  // 중간에 문제가 있다면 예외처리 구간으로 리턴된다.
  UpdateCat(@Param('id', ParseIntPipe, PositiveIntpipe) Param: number) {
    console.log(Param);
    return 'update cat';
  }

  @Patch(':id')
  UpdatePartCat() {
    return 'update part cat';
  }

  @Delete(':id')
  DeleteCat() {
    return 'delete cat';
  }

  @Get('exceptions')
  TestExceptions() {
    // node에서는 new Error로 에러를 처리하지만 nest에서는 HTTPException를 이용하여 처리한다.
    throw new HttpException('에러 메세지', 401); // 에러 메세지와 에러 코드를 인자로 받는다.
    // throw new HttpException({suceess: True, msg: '성공'}, 401); 이런식으로 오버라이딩하여 입맛에 맞게 사용가능
  }
}
