import { CatResponsetDto } from './dto/cats.response.dto';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@ApiTags('Cats API') // 제목 토글 같은 느낌(API의 단위 태그)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Cat 가져오기',
    description: '모든 Cats를 가져온다.',
  }) // ApiOperation를 사용하여 해당 API의 간단한 정보(설명) 입력해줄수있다
  getCurrentCat() {
    return 'current cat';
  }

  @ApiResponse({
    status: 500,
    description: '서버 오류...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: CatResponsetDto,
  }) // ApiResponse를 사용하여 어떤 데이터 형태로 res를 줄지 표시할수있다.
  @Post()
  @ApiOperation({ summary: '회원 가입', description: '회원 가입 API' })
  // 반환값이 프로미스값이기에 async/await 사용
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  // authService에서 만든 로그인 로직을 가져와서 사용한다.
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '로그인 API' })
  async logIn(@Body() data: LoginRequestDto) {
    return await this.authService.jwtLogIn(data);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '로그아웃 API' })
  logOut() {
    return 'logout';
  }

  @Post('upload/:id')
  @ApiOperation({
    summary: '이미지 업로드',
    description: '유저 고양이 이미지 업로드 API',
  })
  uploadCatImg() {
    return 'upload cat img';
  }
}
