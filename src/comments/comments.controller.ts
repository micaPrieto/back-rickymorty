import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';

import { Request } from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: Request & { user: User }  
  ) {
    return this.commentsService.createCommentWithUser(dto, req.user.id, req.user.fullName);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOneById(id);
  }

  @Get('episode/:episodeId')
    async getCommentsByEpisode(@Param('episodeId') episodeId: string) {
    return this.commentsService.findByEpisodeId(episodeId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
