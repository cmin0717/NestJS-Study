import { CatsRepository } from './cats.repository';
import { CatRequestDto } from './dto/cats.request.dto';
import { Injectable, HttpException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
// import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CatsService {
  // 서비스 로직에서 디비에 쿼리를 하기위해 스키마를 사용해야한다.
  // 모듈에 등록된 스키마를 데코레이터를 사용하여 서비스로직에서 사용할수있게 주입해야한다.
  // 스키마를 사용하려면 해당 클래스에 디펜더싱 인젝션을 해주어야하는데 아래와 같이 진행된다.
  // constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  // Repository 적용(module의 provider에 CatsRepository를 추가해주고 사용해야한다.)
  constructor(private readonly catsRepository: CatsRepository) {}

  // 안에서 await를 필요함으로 async함수로 선언
  async signUp(data: CatRequestDto) {
    const { email, password, name } = data;

    // 해당 이메일이 디비에 존재하는지 안한는지 exists쿼리를 사용하여 확인한다.
    const checkEmail = await this.catsRepository.existsByEmail(email);
    if (checkEmail) {
      throw new HttpException(
        '해당 이메일은 이미 존재하는 이메일 입니다.',
        401,
      );
    }

    // 비밀번호는 암호화해서 저장해야하기에 bcrypt를 사용하여 해쉬후 저장한다.
    // bycrpt는 프로미스값을 리턴하기에 await를 걸어주어 값을 받고 진행되게 한다.
    const hashpassword = await bcrypt.hash(password, 10);
    const cat: Cat = await this.catsRepository.catsCreate({
      email: email,
      name: name,
      password: hashpassword,
    });

    // 버추얼 필드를 사용하여 내가 원하는 형태로 값을 넘겨준다.
    return cat.readOnlyData;
  }
}
