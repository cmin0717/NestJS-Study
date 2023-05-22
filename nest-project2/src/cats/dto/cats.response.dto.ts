import { PickType, ApiProperty } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class CatResponsetDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '12321341',
    description: 'id',
  })
  id: string;
}

// 아래와 같이 DTO를 하드코딩으로 구성해도 좋지만 사실 아래는 모두 스키마에 있는것들이다.
// 그렇기에 스키마에 ApiProperty를 적용시키고 스키마를 상속받아 사용하는것이 효율적이다.
// export class CatResponseDto {
//   @ApiProperty({
//     example: '12321341',
//     description: 'id',
//   })
//   id: string;

//   @ApiProperty({
//     example: 'abc@gmail.com',
//     description: '회원 가입시 입력한 이메일',
//   })
//   email: string;

//   // 이름
//   @ApiProperty({
//     example: 'chuchu',
//     description: '회원 가입시 입력한 이름',
//   })
//   name: string;
// }

// swagger를 통해 상태코드에 따라 어떤 데이터 타입이 갈지를 알려줄수 있다.
// 또한 responseDTO를 예시로 만들어 어떤 형태로 갈지도 알려줄수있다.
// 주의할점은 실제로 데이터 반환하는 형태와 같은 형태로 주어야 한다.
