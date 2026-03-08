import { Movie } from '../entities/movie.entity';
import {
  MovieResponseDto,
  GenreDto,
  ProductionCompanyDto,
  ProductionCountryDto,
  SpokenLanguageDto,
} from '../dto/movie-response.dto';

export class MovieMapper {
  static toDto(movie: Movie): MovieResponseDto {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.originalTitle,
      overview: movie.overview,
      tagline: movie.tagline,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      voteCount: movie.voteCount,
      runtime: movie.runtime,
      popularity: movie.popularity,
      status: movie.status,
      budget: movie.budget !== null ? Number(movie.budget) : null,
      revenue: movie.revenue !== null ? Number(movie.revenue) : null,
      imdbId: movie.imdbId,
      homepage: movie.homepage,
      originalLanguage: movie.originalLanguage,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath,
      video: movie.video,
      collectionId: movie.collectionId,
      collectionName: movie.collectionName,
      genres:
        movie.movieGenres?.map((mg): GenreDto => ({
          id: mg.genre.id,
          name: mg.genre.name,
        })) || [],
      productionCompanies:
        movie.movieProductionCompanies?.map(
          (mpc): ProductionCompanyDto => ({
            id: mpc.productionCompany.id,
            name: mpc.productionCompany.name,
            logoPath: mpc.productionCompany.logoPath,
            originCountry: mpc.productionCompany.originCountry,
          }),
        ) || [],
      productionCountries:
        movie.movieProductionCountries?.map(
          (mpc): ProductionCountryDto => ({
            iso_3166_1: mpc.productionCountry.iso,
            name: mpc.productionCountry.name,
          }),
        ) || [],
      spokenLanguages:
        movie.movieSpokenLanguages?.map(
          (msl): SpokenLanguageDto => ({
            iso_639_1: msl.spokenLanguage.iso,
            name: msl.spokenLanguage.name,
          }),
        ) || [],
    };
  }
}
