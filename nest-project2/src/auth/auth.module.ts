import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CatsModule } from 'src/cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // 인증할때 사용
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    // 로그인 할때 사용(토큰을 생성할때)
    JwtModule.register({
      secret: process.env.SECRET_KEY, // 인코딩할 시크릿키
      signOptions: { expiresIn: '1y' }, // 만료 기간 설정
    }),

    // 모듈의 순환 참조(각각의 모듈이 서로를 참조하고(import) 있는경우)
    // 각 모듈이 서로를 참조하고 있다면 서로 초기화 되기 전에 서로를 의존하기에 에러가 발생한다.
    // 그래서 순환 참조를 해야할 경우에는 forwardRef(() => 모듈명)을 사용해야한다.
    // forwardRef는 아직 초기화 되지 않은 클래스를 참조할수있게 해주는것
    forwardRef(() => CatsModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

// 인증 서비스를 만들기 위한 모듈을 생성한다.
// 해당 인증을 검증하기위한 라이브러리 설치
// $ npm install --save @nestjs/passport passport passport-local
// $ npm install --save-dev @types/passport-local

// jwt토큰을 만들기 위한 라이브러리 설치
// $ npm install --save @nestjs/jwt passport-jwt
// $ npm install --save-dev @types/passport-jwt
