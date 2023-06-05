import { multerOptions } from './../common/utils/multer.options';
import { CurrentUser } from './../common/decorators/user.decorator';
// import { Request } from 'express';
import { CatResponsetDto } from './dto/cats.response.dto';
import { CatRequestDto } from './dto/cats.request.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  // Req,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/exceptions.filter';
// import { PositiveIntpipe } from 'src/common/pipe/positiveInt.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Cat } from './cats.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CatAwsService } from './cats.awss3';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@ApiTags('Cats API') // Swagger의 제목 토글 같은 느낌(API의 단위 태그)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
    private readonly catAwsService: CatAwsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Cat 가져오기',
    description: '모든 Cats를 가져온다.',
  }) // ApiOperation를 사용하여 해당 API의 간단한 정보(설명) 입력해줄수있다
  // 로그인 이후 사용할 서비스에는 UseGuards와 직접 만든 JwtAuthGuard를 사용하여 토큰 인증을 거친후에 사용할수있게한다.
  // 토큰을 인증하면서 토큰에 담긴 payload값을 가져올수있다.
  @UseGuards(JwtAuthGuard)
  // 커스텀 데코레이터를 사용하여 req.user를 먼저 처리하여 cat자료형으로 데이터를 받을수 있게 해주었다.
  // 그렇기에 cat타입에 있는 readOnlyData 버츄얼 필드를 사용할수있게된다?
  getCurrentCat(@CurrentUser() cat: Cat) {
    return cat.readOnlyData;
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

  // 로그아웃 API는 만들 필요가 없다. 프론트엔드에서 보유중인 JWT토큰을 그냥 날리면 그게 로그아웃이된다.
  // @Post('logout')
  // @ApiOperation({ summary: '로그아웃', description: '로그아웃 API' })
  // logOut() {
  //   return 'logout';
  // }

  @Post('upload')
  @ApiOperation({
    summary: '이미지 업로드',
    description: '유저 고양이 이미지 업로드 API',
  })
  // UseInterceptors 인터셉터와 FileInterceptor 데코레이터를 사용하여 file추출
  // 단일 파일 추출
  // @UseInterceptors(FileInterceptor(보낼때 이미지 필드명, 파일 갯수 옵션, 멀터 옵션)) -> @UploadedFile() file: Express.Multer.File를 사용하여 받아온 파일을 인자로 받는다.
  // 다중 파일 추출
  // @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats'))) // 로컬 파일 저장 할때
  @UseInterceptors(FilesInterceptor('image', 10)) // s3 파일 저장할때
  // 로그인한 유저만 가능한 API이므로
  @UseGuards(JwtAuthGuard)
  async uploadCatImg(
    @UploadedFiles() files: Express.Multer.File[],
    // @CurrentUser() cat: Cat, 로컬 파일 저장시 사용(jwt토큰에서 사용자 정보 가져오는건데 현재는 필요없다.)
  ) {
    // return this.catsService.uploadImg(cat, files); 로컬 저장시
    return await this.catAwsService.uploadFileToS3('cats', files);
  }

  @Get('all')
  @ApiOperation({
    summary: '모든 고양이 사진',
    description: 'DB에 모든 유저 고양이 사진 가져오기',
  })
  getAllCats() {
    return this.catsService.getAllCats();
  }
}
