import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const Options: SchemaOptions = {
  // 해당 스키마의 컬렉션 이름을 정해줄수있다.
  // 만일 정하지 않았다면 스키마를 선언한 class의 이름에서 첫문자를 소문자로 바꾸고 마지막에 s를 붙여서 자동으로 정해준다.
  // 예를들어) class 명 Cat라면 컬렉션 이름을 따로 정의하지 않으면 cats로 정의된다.
  //   collection: 'comments',
  timestamps: true,
};

// 현재 스키마는 컬렉션명이 옵션에 없기에 comments로 컬렉션 이름이 지어진다.
@Schema(Options)
export class Comment extends Document {
  // 댓글 작성자
  @ApiProperty({ required: true, description: '댓글 작성자 id' })
  // ref는 해당 값이 어떤 컬렉션이랑 연관이 있는지
  @Prop({ required: true, type: Types.ObjectId, ref: 'cats' })
  @IsNotEmpty()
  author: Types.ObjectId;

  // 댓글 내용
  @ApiProperty({ required: true, description: '작성한 댓글 내용' })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  contents: string;

  // 좋아요 수
  @ApiProperty({ required: true, description: '좋아요 수' })
  // Prop에 default옵션을 사용하여 처음값은 0으로 정해준다.
  @Prop({ default: 0, required: true })
  // 유효성 검사 IsPositive를 통해 음수가 아닌 정수만 들어올수있게한다.
  @IsPositive()
  @IsNotEmpty()
  likeCount: number;

  // 작성된 고양이 정보
  @ApiProperty({ required: true, description: '작성될 고양이의 정보' })
  @Prop({ required: true, type: Types.ObjectId, ref: 'cats' })
  @IsNotEmpty()
  info: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
