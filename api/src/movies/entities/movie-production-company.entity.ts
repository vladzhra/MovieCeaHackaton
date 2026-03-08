import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { ProductionCompany } from './production-company.entity';

@Entity({ name: 'movie_production_companies' })
export class MovieProductionCompany {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieId!: number;

  @Column()
  productionCompanyId!: number;

  @ManyToOne(() => Movie, (movie: Movie) => movie.movieProductionCompanies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @ManyToOne(
    () => ProductionCompany,
    (company: ProductionCompany) => company.movieProductionCompanies,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'productionCompanyId' })
  productionCompany!: ProductionCompany;

  @CreateDateColumn()
  createdAt!: Date;
}
