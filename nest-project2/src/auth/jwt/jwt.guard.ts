import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// AuthGuard('jwt')는 PassportStrategy(Strategy)를 상속받은 파일을 찾아서 로직을 수행하게 한다.
export class JwtAuthGuard extends AuthGuard('jwt') {}
