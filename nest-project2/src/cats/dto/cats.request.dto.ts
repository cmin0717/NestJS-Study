import { PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class CatRequestDto extends PickType(Cat, [
  'email',
  'password',
  'name',
] as const) {}
// PickType를 사용하여 해당 클래스에서 필요한 항목만 가져올수 있다.
// PickType(가져올 클래스, [...요소들])
// OmitType은 지정한 항목만 제외하고 나머지 요소들을 가져온다.
// as const를 사용하면 가져올 값들을 readonly로 사용할수있게된다.
// 특정 값들의 값이 변하는걸 방지하기 위해 안전하게 readonly로 사용하려면 as const를 해주면된다.(꼭 해야하는건 아니다.)

// 인터페이스 말고 클래스를 사용하는 이유는 클래스 벨리데이터를 사용하는것도 있고 확정성 측면에서 클래스가 더 좋기때문에?
// export class CatRequestDto {
//   // ApiProperty 데코레이터를 사용하여 swagger에서 body작성시 디폴트값을 설정해줄수있다.
//   // swagger에서 스키마 정보를 주는것이라고 생각하면 편할듯
//   // 스키마 정보를 줬기에 해당 스키마를 body로 받는 API는 편하게 body를 작성할수있다.
//   @ApiProperty({
//     example: 'abc@gmail.com', // 디폴트값으로 입력될 예시
//     description: '회원 가입시 입력한 이메일', // 상세보기시 나오는 설명
//     required: true, // 필수인자인지 아닌지
//   })
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   // 비밀번호
//   @ApiProperty({
//     example: 'cmin0717',
//     description: '회원 가입시 입력한 비밀번호',
//     required: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   // 이름
//   @ApiProperty({
//     example: 'chuchu',
//     description: '회원 가입시 입력한 이름',
//     required: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   name: string;
// }

// DTO란?
// 계층간 데이토 교환을 위한 객체
// DB에서 데이터를 얻어 서비스나 컨트롤러등으로 보낼때 사용되는 객체
// req, res용 DTO는 View를 위한 클래스이다.

// 그러니깐 쉽게 말해서 받을 데이터나 보낼 데이터를 더 확실하게 어떤 형태로 보내고 받을거인지
// 알게 해주고 해당 데이터 형식이 다르면 처리하기 위해 사용한다.
