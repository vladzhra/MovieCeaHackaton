import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MovieProductionCompany } from './movie-production-company.entity';

@Entity({ name: 'production_companies' })
export class ProductionCompany {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  logoPath!: string | null;

  @Column({ type: 'text', nullable: true })
  originCountry!: string | null;

  @OneToMany(
    () => MovieProductionCompany,
    (movieCompany: MovieProductionCompany) => movieCompany.productionCompany,
  )
  movieProductionCompanies!: MovieProductionCompany[];
}
