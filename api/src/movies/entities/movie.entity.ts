import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MovieGenre } from './movie-genre.entity';
import { MovieProductionCompany } from './movie-production-company.entity';
import { MovieProductionCountry } from './movie-production-country.entity';
import { MovieSpokenLanguage } from './movie-spoken-language.entity';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  originalTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  overview!: string | null;

  @Column({ type: 'text', nullable: true })
  tagline!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  releaseDate!: Date | null;

  @Column({ type: 'float', nullable: true })
  voteAverage!: number | null;

  @Column({ type: 'int', nullable: true })
  voteCount!: number | null;

  @Column({ type: 'int', nullable: true })
  runtime!: number | null;

  @Column({ type: 'float', nullable: true })
  popularity!: number | null;

  @Column({ type: 'text', nullable: true })
  status!: string | null;

  @Column({ type: 'bigint', nullable: true })
  budget!: number | null;

  @Column({ type: 'bigint', nullable: true })
  revenue!: number | null;

  @Column({ type: 'text', nullable: true })
  imdbId!: string | null;

  @Column({ type: 'text', nullable: true })
  homepage!: string | null;

  @Column({ type: 'text', nullable: true })
  originalLanguage!: string | null;

  @Column({ type: 'text', nullable: true })
  posterPath!: string | null;

  @Column({ type: 'text', nullable: true })
  backdropPath!: string | null;

  @Column({ type: 'int', nullable: true })
  collectionId!: number | null;

  @Column({ type: 'text', nullable: true })
  collectionName!: string | null;

  @Column({ type: 'boolean', nullable: true })
  video!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MovieGenre, (movieGenre: MovieGenre) => movieGenre.movie, {
    cascade: true,
  })
  movieGenres!: MovieGenre[];

  @OneToMany(
    () => MovieProductionCompany,
    (movieCompany: MovieProductionCompany) => movieCompany.movie,
    { cascade: true },
  )
  movieProductionCompanies!: MovieProductionCompany[];

  @OneToMany(
    () => MovieProductionCountry,
    (movieCountry: MovieProductionCountry) => movieCountry.movie,
    { cascade: true },
  )
  movieProductionCountries!: MovieProductionCountry[];

  @OneToMany(
    () => MovieSpokenLanguage,
    (movieLanguage: MovieSpokenLanguage) => movieLanguage.movie,
    { cascade: true },
  )
  movieSpokenLanguages!: MovieSpokenLanguage[];
}
