import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  mapToDto(comment: Comment): CommentResponseDto {
    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      userId,
    });

    const saved = await this.commentsRepository.save(comment);
    const withRelations = await this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });

    if (!withRelations) {
      throw new NotFoundException('Comment not found');
    }

    return this.mapToDto(withRelations);
  }

  async findByMovie(movieId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentsRepository.find({
      where: { movieId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return comments.map((comment) => this.mapToDto(comment));
  }

  async delete(commentId: number, userId: number, isAdmin: boolean): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only the comment owner or an admin can delete
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    await this.commentsRepository.remove(comment);
  }
}
