import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { ProductionCountry } from './production-country.entity';

@Entity({ name: 'movie_production_countries' })
export class MovieProductionCountry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieId!: number;

  @Column()
  productionCountryIso!: string;

  @ManyToOne(() => Movie, (movie: Movie) => movie.movieProductionCountries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @ManyToOne(
    () => ProductionCountry,
    (country: ProductionCountry) => country.movieProductionCountries,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'productionCountryIso' })
  productionCountry!: ProductionCountry;

  @CreateDateColumn()
  createdAt!: Date;
}
