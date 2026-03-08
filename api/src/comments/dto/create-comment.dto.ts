import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  movieId!: number;
}
