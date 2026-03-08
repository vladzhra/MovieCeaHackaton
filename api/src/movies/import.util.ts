import { Repository } from 'typeorm';
import { promises as fs } from 'node:fs';
import { Movie } from './entities/movie.entity';
import { Genre } from './entities/genre.entity';
import { ProductionCompany } from './entities/production-company.entity';
import { ProductionCountry } from './entities/production-country.entity';
import { SpokenLanguage } from './entities/spoken-language.entity';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieProductionCompany } from './entities/movie-production-company.entity';
import { MovieProductionCountry } from './entities/movie-production-country.entity';
import { MovieSpokenLanguage } from './entities/movie-spoken-language.entity';

type RawGenre = {
  id?: number;
  name?: string;
};

type RawProductionCompany = {
  id?: number;
  name?: string;
  logo_path?: string | null;
  origin_country?: string;
};

type RawProductionCountry = {
  iso_3166_1?: string;
  name?: string;
};

type RawSpokenLanguage = {
  iso_639_1?: string;
  name?: string;
};

type RawCollection = {
  id?: number;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

type RawMovie = {
  id?: number;
  title?: string;
  original_title?: string;
  overview?: string;
  tagline?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  popularity?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  imdb_id?: string;
  homepage?: string | null;
  original_language?: string;
  poster_path?: string;
  backdrop_path?: string;
  video?: boolean;
  belongs_to_collection?: RawCollection | null;
  genres?: RawGenre[];
  production_companies?: RawProductionCompany[];
  production_countries?: RawProductionCountry[];
  spoken_languages?: RawSpokenLanguage[];
};

export type ImportResult = {
  total: number;
  imported: number;
  skipped: boolean;
};

function toDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function importMoviesFromFile(
  movieRepo: Repository<Movie>,
  genreRepo: Repository<Genre>,
  companyRepo: Repository<ProductionCompany>,
  countryRepo: Repository<ProductionCountry>,
  languageRepo: Repository<SpokenLanguage>,
  filePath: string,
  force = false,
): Promise<ImportResult> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsedJson = JSON.parse(fileContent) as RawMovie[];

  if (!Array.isArray(parsedJson)) {
    throw new Error('movies_dump.json must contain a JSON array');
  }

  const existingCount = await movieRepo.count();
  if (existingCount > 0 && !force) {
    return {
      total: parsedJson.length,
      imported: 0,
      skipped: true,
    };
  }

  return movieRepo.manager.transaction(async (manager) => {
    const tMovieRepo = manager.getRepository(Movie);
    const tGenreRepo = manager.getRepository(Genre);
    const tCompanyRepo = manager.getRepository(ProductionCompany);
    const tCountryRepo = manager.getRepository(ProductionCountry);
    const tLanguageRepo = manager.getRepository(SpokenLanguage);
    const tMovieGenreRepo = manager.getRepository(MovieGenre);
    const tMovieCompanyRepo = manager.getRepository(MovieProductionCompany);
    const tMovieCountryRepo = manager.getRepository(MovieProductionCountry);
    const tMovieLanguageRepo = manager.getRepository(MovieSpokenLanguage);

    // Clear existing data if force is true
    if (force && existingCount > 0) {
      console.log('Truncating existing movies and related entities...');
      // TRUNCATE is much faster than DELETE for large tables
      await tMovieRepo.clear();
      await tGenreRepo.clear();
      await tCompanyRepo.clear();
      await tCountryRepo.clear();
      await tLanguageRepo.clear();
      console.log('Existing data truncated.');
    }

    const genresCache = new Map<number, Genre>();
    const companiesCache = new Map<number, ProductionCompany>();
    const countriesCache = new Map<string, ProductionCountry>();
    const languagesCache = new Map<string, SpokenLanguage>();

    // Collections for bulk save
    const genresToCreate: Partial<Genre>[] = [];
    const companiesToCreate: Partial<ProductionCompany>[] = [];
    const countriesToCreate: Partial<ProductionCountry>[] = [];
    const languagesToCreate: Partial<SpokenLanguage>[] = [];
    const moviesToCreate: Partial<Movie>[] = [];
    const movieGenresToCreate: Partial<MovieGenre>[] = [];
    const movieCompaniesToCreate: Partial<MovieProductionCompany>[] = [];
    const movieCountriesToCreate: Partial<MovieProductionCountry>[] = [];
    const movieLanguagesToCreate: Partial<MovieSpokenLanguage>[] = [];

    // Collect all entity IDs to check in database
    const genreIds = new Set<number>();
    const companyIds = new Set<number>();
    const countryIsos = new Set<string>();
    const languageIsos = new Set<string>();
    const createdGenreIds = new Set<number>();
    const createdCompanyIds = new Set<number>();
    const createdCountryIsos = new Set<string>();
    const createdLanguageIsos = new Set<string>();

    // First pass: collect all unique entities to check
    for (const movie of parsedJson) {
      for (const g of movie.genres || []) {
        if (g.id) genreIds.add(g.id);
      }
      for (const c of movie.production_companies || []) {
        if (c.id) companyIds.add(c.id);
      }
      for (const c of movie.production_countries || []) {
        if (c.iso_3166_1) countryIsos.add(c.iso_3166_1);
      }
      for (const l of movie.spoken_languages || []) {
        if (l.iso_639_1) languageIsos.add(l.iso_639_1);
      }
    }

    // Batch check and populate caches
    if (genreIds.size > 0) {
      const existing = await tGenreRepo.find({ where: { id: { $in: Array.from(genreIds) } as any } });
      existing.forEach((g) => genresCache.set(g.id, g));
    }
    if (companyIds.size > 0) {
      const existing = await tCompanyRepo.find({ where: { id: { $in: Array.from(companyIds) } as any } });
      existing.forEach((c) => companiesCache.set(c.id, c));
    }
    if (countryIsos.size > 0) {
      const existing = await tCountryRepo.find({ where: { iso: { $in: Array.from(countryIsos) } as any } });
      existing.forEach((c) => countriesCache.set(c.iso, c));
    }
    if (languageIsos.size > 0) {
      const existing = await tLanguageRepo.find({ where: { iso: { $in: Array.from(languageIsos) } as any } });
      existing.forEach((l) => languagesCache.set(l.iso, l));
    }

    let importedCount = 0;

    // Second pass: collect entities to create and movies
    for (const movie of parsedJson) {
      const movieId = Number(movie.id);
      const movieTitle = movie.title;

      if (!movieId || Number.isNaN(movieId) || !movieTitle) {
        continue;
      }

      const collection = movie.belongs_to_collection ?? null;

      // Collect movie data
      const movieData: Partial<Movie> = {
        id: movieId,
        title: movieTitle,
        originalTitle: movie.original_title ?? null,
        overview: movie.overview ?? null,
        tagline: movie.tagline ?? null,
        releaseDate: toDate(movie.release_date),
        voteAverage: movie.vote_average ?? null,
        voteCount: movie.vote_count ?? null,
        runtime: movie.runtime ?? null,
        popularity: movie.popularity ?? null,
        status: movie.status ?? null,
        budget: movie.budget ?? null,
        revenue: movie.revenue ?? null,
        imdbId: movie.imdb_id ?? null,
        homepage: movie.homepage ?? null,
        originalLanguage: movie.original_language ?? null,
        posterPath: movie.poster_path ?? null,
        backdropPath: movie.backdrop_path ?? null,
        video: movie.video ?? null,
        collectionId:
          collection && collection.id ? Number(collection.id) : null,
        collectionName: collection?.name ?? null,
      };
      moviesToCreate.push(movieData);

      // Collect genres
      for (const g of movie.genres || []) {
        if (g.id && g.name) {
          if (!genresCache.has(g.id) && !createdGenreIds.has(g.id)) {
            genresToCreate.push({ id: g.id, name: g.name });
            createdGenreIds.add(g.id);
          }
          movieGenresToCreate.push({ movieId, genreId: g.id });
        }
      }

      // Collect production companies
      for (const c of movie.production_companies || []) {
        if (c.id && c.name) {
          if (!companiesCache.has(c.id) && !createdCompanyIds.has(c.id)) {
            companiesToCreate.push({
              id: c.id,
              name: c.name,
              logoPath: c.logo_path || null,
              originCountry: c.origin_country || null,
            });
            createdCompanyIds.add(c.id);
          }
          movieCompaniesToCreate.push({ movieId, productionCompanyId: c.id });
        }
      }

      // Collect production countries
      for (const c of movie.production_countries || []) {
        if (c.iso_3166_1 && c.name) {
          if (!countriesCache.has(c.iso_3166_1) && !createdCountryIsos.has(c.iso_3166_1)) {
            countriesToCreate.push({ iso: c.iso_3166_1, name: c.name });
            createdCountryIsos.add(c.iso_3166_1);
          }
          movieCountriesToCreate.push({ movieId, productionCountryIso: c.iso_3166_1 });
        }
      }

      // Collect spoken languages
      for (const l of movie.spoken_languages || []) {
        if (l.iso_639_1 && l.name) {
          if (!languagesCache.has(l.iso_639_1) && !createdLanguageIsos.has(l.iso_639_1)) {
            languagesToCreate.push({ iso: l.iso_639_1, name: l.name });
            createdLanguageIsos.add(l.iso_639_1);
          }
          movieLanguagesToCreate.push({ movieId, spokenLanguageIso: l.iso_639_1 });
        }
      }
      importedCount += 1;
    }

    // Bulk save all entities
    if (moviesToCreate.length > 0) await tMovieRepo.save(moviesToCreate);
    if (genresToCreate.length > 0) await tGenreRepo.save(genresToCreate);
    if (companiesToCreate.length > 0) await tCompanyRepo.save(companiesToCreate);
    if (countriesToCreate.length > 0) await tCountryRepo.save(countriesToCreate);
    if (languagesToCreate.length > 0) await tLanguageRepo.save(languagesToCreate);
    if (movieGenresToCreate.length > 0) await tMovieGenreRepo.save(movieGenresToCreate);
    if (movieCompaniesToCreate.length > 0) await tMovieCompanyRepo.save(movieCompaniesToCreate);
    if (movieCountriesToCreate.length > 0) await tMovieCountryRepo.save(movieCountriesToCreate);
    if (movieLanguagesToCreate.length > 0) await tMovieLanguageRepo.save(movieLanguagesToCreate);

    return {
      total: parsedJson.length,
      imported: importedCount,
      skipped: false,
    };
  });
}
