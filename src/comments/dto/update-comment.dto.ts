import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  state?: boolean;
}
