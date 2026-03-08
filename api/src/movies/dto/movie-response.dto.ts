import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  name!: string;
}

export class ProductionCompanyDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  name!: string;
  @ApiProperty({ required: false })
  logoPath?: string | null;
  @ApiProperty({ required: false })
  originCountry?: string | null;
}

export class ProductionCountryDto {
  @ApiProperty()
  iso_3166_1!: string;
  @ApiProperty()
  name!: string;
}

export class SpokenLanguageDto {
  @ApiProperty()
  iso_639_1!: string;
  @ApiProperty()
  name!: string;
}

export class MovieResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  originalTitle?: string | null;

  @ApiProperty({ required: false })
  overview?: string | null;

  @ApiProperty({ required: false })
  tagline?: string | null;

  @ApiProperty({ required: false })
  releaseDate?: Date | null;

  @ApiProperty({ required: false })
  voteAverage?: number | null;

  @ApiProperty({ required: false })
  voteCount?: number | null;

  @ApiProperty({ required: false })
  runtime?: number | null;

  @ApiProperty({ required: false })
  popularity?: number | null;

  @ApiProperty({ required: false })
  status?: string | null;

  @ApiProperty({ required: false })
  budget?: number | null;

  @ApiProperty({ required: false })
  revenue?: number | null;

  @ApiProperty({ required: false })
  imdbId?: string | null;

  @ApiProperty({ required: false })
  homepage?: string | null;

  @ApiProperty({ required: false })
  originalLanguage?: string | null;

  @ApiProperty({ required: false })
  posterPath?: string | null;

  @ApiProperty({ required: false })
  backdropPath?: string | null;

  @ApiProperty({ required: false })
  collectionId?: number | null;

  @ApiProperty({ required: false })
  collectionName?: string | null;

  @ApiProperty({ required: false })
  video?: boolean | null;

  @ApiProperty({ type: GenreDto, isArray: true })
  genres!: GenreDto[];

  @ApiProperty({ type: ProductionCompanyDto, isArray: true })
  productionCompanies!: ProductionCompanyDto[];

  @ApiProperty({ type: ProductionCountryDto, isArray: true })
  productionCountries!: ProductionCountryDto[];

  @ApiProperty({ type: SpokenLanguageDto, isArray: true })
  spokenLanguages!: SpokenLanguageDto[];
}
