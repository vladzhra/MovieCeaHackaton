import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ListMoviesQueryDto } from './dto/list-movies-query.dto';
import { importMoviesFromFile } from './import.util';
import { Movie } from './entities/movie.entity';
import { Genre } from './entities/genre.entity';
import { ProductionCompany } from './entities/production-company.entity';
import { ProductionCountry } from './entities/production-country.entity';
import { SpokenLanguage } from './entities/spoken-language.entity';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginatedMoviesResponseDto } from './dto/paginated-movies-response.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieMapper } from './mappers/movie.mapper';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
    @InjectRepository(ProductionCompany)
    private companiesRepository: Repository<ProductionCompany>,
    @InjectRepository(ProductionCountry)
    private countriesRepository: Repository<ProductionCountry>,
    @InjectRepository(SpokenLanguage)
    private languagesRepository: Repository<SpokenLanguage>,
  ) {}

  async listMovies(
    query: ListMoviesQueryDto,
  ): Promise<PaginatedMoviesResponseDto> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { title: ILike(`%${search}%`) },
          { originalTitle: ILike(`%${search}%`) },
        ]
      : {};

    const [items, total] = await this.moviesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { voteAverage: 'DESC', title: 'ASC' },
      relations: {
        movieGenres: { genre: true },
        movieProductionCompanies: { productionCompany: true },
        movieProductionCountries: { productionCountry: true },
        movieSpokenLanguages: { spokenLanguage: true },
      },
    });

    return {
      total,
      page,
      limit,
      items: items.map((movie) => MovieMapper.toDto(movie)),
    };
  }

  async importMovies(force = false) {
    const filePath = process.env.MOVIES_DUMP_PATH ?? '/app/movies_dump.json';
    try {
      return await importMoviesFromFile(
        this.moviesRepository,
        this.genresRepository,
        this.companiesRepository,
        this.countriesRepository,
        this.languagesRepository,
        filePath,
        force,
      );
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT' || err.code === 'EISDIR') {
        console.warn(`Movies dump file not found or is a directory at ${filePath}, skipping import`);
        return {
          total: 0,
          imported: 0,
          skipped: true,
        };
      }
      throw error;
    }
  }

  async update(id: number, data: UpdateMovieDto): Promise<MovieResponseDto> {
    const exists = await this.moviesRepository.exists({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.moviesRepository.update(id, data);
    const updated = await this.moviesRepository.findOne({
      where: { id },
      relations: {
        movieGenres: { genre: true },
        movieProductionCompanies: { productionCompany: true },
        movieProductionCountries: { productionCountry: true },
        movieSpokenLanguages: { spokenLanguage: true },
      },
    });
    if (!updated) throw new Error(`Movie with ID ${id} not found after update`);
    return MovieMapper.toDto(updated);
  }
}
