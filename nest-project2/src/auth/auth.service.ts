import { HttpException, Injectable } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepositoty: CatsRepository,
    // jwt토큰 발행을 위해 JwtService를 가져온다.
    // JwtService를 가져올수잇는 이유는 auth module에서 JwtModule를 import했기 때문에
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    // email이 존재하는지 체크
    const cat = await this.catsRepositoty.catsFindEmail(email);

    if (!cat) {
      throw new HttpException('이메일이 존재하지 않습니다.', 400);
    }

    // password가 일치한지 확인
    // bcrypt를 사용하여 암호화해서 db에 저장했으므로 입력 받은 값과 암호화된 값을 bcrypt.compare를 사용하여 비교한다.
    // bcrypt.compare는 불린값을 리턴한다.
    const isPasswordValidate: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidate) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', 400);
    }

    // 유효성 검사가 끝나면 jwt발급
    // payload 생성 // 객체에 넣고 싶은 정보를 넣어 전달한다.
    // 디코드된 payload에는 payload에 넣어준 객체값과 만료 기간등을 객체로 가지고 있다.
    const payload = { email: email, id: cat.id };
    // jwtService에서 제공하는 sign메서드에 payload를 넣어 토큰을 생성한다.
    return { token: this.jwtService.sign(payload) };
  }
}
