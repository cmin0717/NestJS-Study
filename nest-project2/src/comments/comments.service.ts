import { HttpException, Injectable } from '@nestjs/common';
import { CommentsRequestDto } from './dto/comments.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comments.schema';
import { Model } from 'mongoose';
import { CatsRepository } from 'src/cats/cats.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly catsRepository: CatsRepository,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentModel.find();
      return comments;
    } catch (error) {
      throw new HttpException('가져오는데 실패했습니다.', 400);
    }
  }

  async createComment(id: string, comment: CommentsRequestDto) {
    try {
      const { author, contents } = comment;
      const targetCat = await this.catsRepository.catsFindWithId(id);
      const authorCat = await this.catsRepository.catsFindWithId(author);

      const newComment = {
        author: authorCat._id,
        contents: contents,
        info: targetCat._id,
        likeCount: 0,
      };
      await this.commentModel.create(newComment);
      return newComment;
    } catch (error) {
      throw new HttpException('잘못된 요청 입니다.', 400);
    }
  }

  async plusLikeCount(id: string) {
    try {
      const targetComment = await this.commentModel.findById(id);
      targetComment.likeCount += 1;
      return await targetComment.save();
    } catch (error) {
      throw new HttpException('좋아요 올리기 오류', 400);
    }
  }
}
