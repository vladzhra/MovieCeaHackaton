import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MovieProductionCountry } from './movie-production-country.entity';

@Entity({ name: 'production_countries' })
export class ProductionCountry {
  @PrimaryColumn()
  iso!: string;

  @Column()
  name!: string;

  @OneToMany(
    () => MovieProductionCountry,
    (movieCountry: MovieProductionCountry) => movieCountry.productionCountry,
  )
  movieProductionCountries!: MovieProductionCountry[];
}
