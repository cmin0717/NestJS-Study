import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 인터페이스 말고 클래스를 사용하는 이유는 클래스 벨리데이터를 사용하는것도 있고 확정성 측면에서 클래스가 더 좋기때문에?
export class CatRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

// DTO란?
// 계층간 데이토 교환을 위한 객체
// DB에서 데이터를 얻어 서비스나 컨트롤러등으로 보낼때 사용되는 객체
// req, res용 DTO는 View를 위한 클래스이다.

// 그러니깐 쉽게 말해서 받을 데이터나 보낼 데이터를 더 확실하게 어떤 형태로 보내고 받을거인지
// 알게 해주고 해당 데이터 형식이 다르면 처리하기 위해 사용한다.
