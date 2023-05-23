import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { CatsRepository } from 'src/cats/cats.repository';

// JWT 토큰을 인증할때(디코딩) 사용된다.
@Injectable()
// PassportStrategy(인증방식, 가드 이름)을 상속시킨다.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 jwt토큰 추출
      secretOrKey: process.env.SECRET_KEY, // 암호화 시크릿 키
      ignoreExpiration: false, // 만료 기간
    });
  }

  // JwtAuthGuard는 AuthGuard('jwt')를 상속받기에 PassportStrategy(Strategy)를 상속받은 파일을 찾아 실행한다.
  // 그럼으로 여기서 해당 토큰을 인증시킨다면 가드가 실행될때 검증할수있게 된다.
  // PassportStrategy를 상속 시킨 클래스에서는 validate메서드를 꼭 만들어주어야하며 인자값인 payload가 알아서 들어온다?
  // 타입 가드에의해 AuthGuard('jwt')를 상속 받은 JwtAuthGuard가 실행되면서 PassportStrategy(Strategy)를 상속 받은 클래스를
  // 실행하게 되는데 그 과정속에서 super를 이용하여 jwt토큰의 payload값을 추출하고 validate메소드의 인자값으로 넣어주는건가?
  // 그리고 validate에서 유효성 검사후 req.uesr에 담아준다?
  // 자세히는 못찾겠다...ㅠㅠ
  async validate(payload: Payload) {
    const cat = await this.catsRepository.catsFindWithId(payload.id);

    if (cat) {
      // 여기서 리턴 값은 req.user에 담기게 된다.
      return cat;
    } else {
      throw new HttpException('접근 오류!', 400);
    }
  }
}
