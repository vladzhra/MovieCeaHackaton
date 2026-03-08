import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Genre } from './entities/genre.entity';
import { ProductionCompany } from './entities/production-company.entity';
import { ProductionCountry } from './entities/production-country.entity';
import { SpokenLanguage } from './entities/spoken-language.entity';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieProductionCompany } from './entities/movie-production-company.entity';
import { MovieProductionCountry } from './entities/movie-production-country.entity';
import { MovieSpokenLanguage } from './entities/movie-spoken-language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      Genre,
      ProductionCompany,
      ProductionCountry,
      SpokenLanguage,
      MovieGenre,
      MovieProductionCompany,
      MovieProductionCountry,
      MovieSpokenLanguage,
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
