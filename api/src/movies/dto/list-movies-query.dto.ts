import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListMoviesQueryDto {
  @ApiProperty({ required: false, description: 'Search movies by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    required: false,
    default: 20,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 20))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
