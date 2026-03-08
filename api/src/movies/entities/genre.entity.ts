import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MovieGenre } from './movie-genre.entity';

@Entity({ name: 'genres' })
export class Genre {
  @PrimaryColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => MovieGenre, (movieGenre: MovieGenre) => movieGenre.genre)
  movieGenres!: MovieGenre[];
}
