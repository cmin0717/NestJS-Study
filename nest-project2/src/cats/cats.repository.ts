import { Comment } from './../comments/comments.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
import { Model, Types } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';

// Repository 패턴을 위한 레이어 분리
// Repository 패턴이란 여러 서비스로직에서 DB에 접근하기 위해 각 서비스에서 코드를 사용하는것이 비효율적이다.
// DB와 서비스 로직에 가운데에 중계자를 두어 여러 서비스 로직들이 하나의 Repository를 통해 DB에 접근하게 하는것
// 쉽게 말해 DB접근 쿼리를 함수화 해서 서비스 로직에서 가져다 쓰게 하는것
// 이후 DB변경 시에도 서비스로직은 그래도 두고 Repository만 바꾸면 쉽게 코드를 바꿀수있다. 이런 측면에서 Repository패턴을 사용한다.
@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    // Comment컬렉션을 사용하기 위해 불러온다.
    @InjectModel(Comment.name) private readonly CommentModel: Model<Comment>,
  ) {}

  // 서비스 로직에서 사용할 함수를 여기서 만든다.
  async existsByEmail(email: string): Promise<boolean> {
    // try catch를 사용하여 db연결오류를 잡을수 있다.
    try {
      const result = await this.catModel.exists({ email });
      // result에는 해당 email이 있다면 id값을 리턴함으로 불린값으로 리턴하기 위해 3항연산자를 사용한다.
      return result ? true : false;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  // 인자값으로는 Cat타입이 아닌 CatRequestDto으로 받는다.
  async catsCreate(cat: CatRequestDto): Promise<Cat> {
    try {
      return await this.catModel.create(cat);
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  // 해당 이메일이 있는지 체크
  async catsFindEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  // 해당 id의 정보 가져오기 (몽고DB에서 아이디를 _id로 저장하기에 _id로 접근해야한다.)
  async catsFindWithId(_id: string | Types.ObjectId): Promise<Cat | null> {
    // select는 가져온 정보에서 어떤 값을 가져올건지( - 가 있으면 해당 부분만 뺴고 가져온다.)
    const cat = await this.catModel.findById({ _id }).select('-password');
    // 아래 쿼리는 해당 id의 정보에서 email과 name만 가져오겠다 ( 띄어쓰기를 통해 구분한다. )
    // const cat = await this.catModel.findById({ id }).select('email name');
    return cat;
  }

  // cats 이미지 URL 변경
  async catsUpdateImg(_id: string, files_url: string[]) {
    const cat = await this.catModel.findById({ _id });
    cat.imgUrl = files_url;
    // save 메서드로 위에서 변경한 정보를 저장한다.
    const newcat = await cat.save();
    return newcat.readOnlyData;
  }

  // all cats 가져오기 (comment도 같이 가져와야한다.)
  async allCats() {
    const allcat = await this.catModel
      .find()
      // populate를 사용하여 어디 컬렉션에서 가져올건지 해당 컬렉션은 어떤 스키마모델을 가지고 있는지 입력
      // path에는 스키마에서 만든 버추얼필드명을 입력한다., model은 어떤 스키마를 사용하는지
      // 해당 버추얼 필드 조건에 맞는 애들을 같이 가져오는것
      .populate({ path: 'commentList', model: this.CommentModel });
    return allcat;
  }
}
