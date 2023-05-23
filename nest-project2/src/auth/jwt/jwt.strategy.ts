import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// JWT 토큰을 인증할때(디코딩) 사용된다.
@Injectable()
// PassportStrategy(인증방식, 가드 이름)을 상속시킨다.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 jwt토큰 추출
      secretOrKey: process.env.SECRET_KEY, // 암호화 시크릿 키
      ignoreExpiration: false, // 만료 기간
    });
  }

  // JwtAuthGuard는 AuthGuard('jwt')를 상속받기에 PassportStrategy(Strategy)를 상속받은 파일을 찾아 실행한다.
  // 그럼으로 여기서 해당 토큰을 인증시킨다면 가드가 실행될때 검증할수있게 된다.
  //   async validate(payload) {}
}
