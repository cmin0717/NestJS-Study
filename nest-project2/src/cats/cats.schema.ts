import { ApiProperty } from '@nestjs/swagger';
import { SchemaOptions, Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

// 클래스 벨리데이션
// npm i --save class-validator class-transformer를 하여 벨리데이터 라이브러리를 가져온다.
// 스키마를 작성시 prop과 타입으로 유효성검사를 하긴 하지만 클래스 벨리데이터를 사용하여 실행전에 한번더 검사를 진행하는것
// 예를 들어 이메일에는 문자열이 오긴왔지만 이메일 형식이 아닐수도 있는경우 등등
// 클래스 벨리데이션을 사용하기 위해서는 app에서 글로벌 파이브를 설정해주어야한다. 그래야 명령이 왔을때 한번 걸치고 가야하기 때문에?

// 스키마의 옵션을 정의
const options: SchemaOptions = {
  // DB에서 무엇이 만들어질때 해당 메타정보를 찍어준다.
  timestamps: true,
};

// 스키마 데코레이터를 사용하고 몽구스의 Document를 상속하여 스키마를 정의한다.
@Schema(options)
export class Cat extends Document {
  // 가입시 입력한 이메일
  @ApiProperty({
    example: 'abc@gmail.com',
    description: '회원 가입시 입력한 이메일',
  })
  // Prop데코레이터를 이용하여 db인자를 설계한다. prop매개변수에 인자의 옵션을 설정할수있다.
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string; // email은 스트링하나만으로 벨리데이션을 해줄수없다. 그렇기에 라이브러리를 사용하여 클래스 벨리데이션을 한다.

  // 가입시 입력한 이름
  @ApiProperty({
    example: 'chuchu',
    description: '회원 가입시 입력한 이름',
  })
  @Prop({
    required: true,
  })
  @IsString({ message: '올바른 형식이 아닙니다.' }) // 경고문도 가능하다.(해당 데코레이터가 지원하는 방식으로만 작성 가능)
  @IsNotEmpty()
  name: string;

  // 가입시 입력한 비밀번호
  @ApiProperty({
    example: '12321341',
    description: 'id',
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  // 이미지 URL
  @Prop()
  imgUrl: string;

  // 사실 아무 의미 없는것( 실제 디비에 들어가지 않는다. )
  // 나중에 사용하기 편하도록 세팅해 두는것 실제 역활은 아래서 만든 virtual('readOnlyData')가 하는것이다.
  readonly readOnlyData: { id: string; email: string; name: string };
}

// 정의된 클래스 스키마를 SchemaFactory.createForClass(Cat)를 사용하여 실제 스키마로 만든다.
export const CatSchema = SchemaFactory.createForClass(Cat);

// 몽구스의 버주얼 필드 생성
// CatSchema와 같이 실제 생성된 스키마에 virtual('생성 메서드 이름')를 통해 원하는 형태로 값을 가져올수있는 메서드를 만든다.
// virtual().get()을 사용하여 get안에서 this로 해당 스키마를 받고 스키마에서 원하는 값만 리턴하거나 값을 한번 처리하여 전달해줄수있게된다.
CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  // 화살표 함수에서는 this를 사용할 수 없기에 func형태로 선언한다.
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});
