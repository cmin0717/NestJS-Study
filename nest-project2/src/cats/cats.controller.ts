import { CatRequestDto } from './dto/cats.request.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/exceptions.filter';
// import { PositiveIntpipe } from 'src/common/pipe/positiveInt.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCurrentCat() {
    return 'current cat';
  }

  @Post()
  // 반환값이 프로미스값이기에 async/await 사용
  async signUp(@Body() data: CatRequestDto) {
    return await this.catsService.signUp(data);
  }

  @Post()
  logIn() {
    return 'login';
  }

  @Post()
  logOut() {
    return 'logout';
  }

  @Post()
  uploadCatImg() {
    return 'upload cat img';
  }
}
