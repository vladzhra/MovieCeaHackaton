import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment with rating' })
  @ApiResponse({ status: 201, type: CommentResponseDto })
  createComment(
    @Request() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(req.user.userId, createCommentDto);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get all comments for a movie' })
  @ApiResponse({ status: 200, type: [CommentResponseDto] })
  getCommentsByMovie(
    @Param('movieId') movieId: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentsService.findByMovie(+movieId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment (owner or admin only)' })
  @ApiResponse({ status: 200, description: 'Comment deleted' })
  deleteComment(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return this.commentsService.delete(+id, req.user.userId, req.user.isAdmin);
  }
}
