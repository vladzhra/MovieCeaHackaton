import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @ApiProperty({ example: 'The Matrix', description: 'Movie title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'A dark technological world', description: 'Movie overview', required: false })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({ example: 'There is no spoon', description: 'Movie tagline', required: false })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ example: 'Released', description: 'Movie release status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 8.7, description: 'Vote average', required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(10)
  voteAverage?: number;

  @ApiProperty({ example: 139, description: 'Runtime in minutes', required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  runtime?: number;

  @ApiProperty({ example: 150000000, description: 'Movie budget', required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  budget?: number;

  @ApiProperty({ example: 467222728, description: 'Movie revenue', required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  revenue?: number;

  @ApiProperty({ example: '1999-03-30', description: 'Release date', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;
}
