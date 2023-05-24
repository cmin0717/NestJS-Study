import { ApiOperation } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsRequestDto } from './dto/comments.request.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({
    summary: '모든 댓글 가져오기',
    description: '각 고양이에 달린 모든 댓글 가져오기',
  })
  async getAllComments() {
    return this.commentsService.getAllComments();
  }

  @Post(':id')
  @ApiOperation({
    summary: '댓글 달기',
    description: '해당 고양이에게 댓글 달기',
  })
  async createComment(
    @Param('id') id: string,
    @Body() data: CommentsRequestDto,
  ) {
    return this.commentsService.createComment(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: '좋아요 수 올리기' })
  async plusLikeCount(@Param('id') id: string) {
    return this.commentsService.plusLikeCount(id);
  }
}
