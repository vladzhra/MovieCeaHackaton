import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListMoviesQueryDto } from './dto/list-movies-query.dto';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginatedMoviesResponseDto } from './dto/paginated-movies-response.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'List movies with pagination and search' })
  @ApiResponse({ status: 200, type: PaginatedMoviesResponseDto })
  listMovies(
    @Query() query: ListMoviesQueryDto,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.moviesService.listMovies(query);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Import movies from JSON dump (Admin only)' })
  @ApiResponse({ status: 201, description: 'Import process completed' })
  importMovies(@Body('force') force?: boolean) {
    return this.moviesService.importMovies(Boolean(force));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update movie information (Admin only)' })
  @ApiResponse({ status: 200, type: MovieResponseDto })
  updateMovie(
    @Param('id') id: string,
    @Body() updateData: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    return this.moviesService.update(+id, updateData);
  }
}
