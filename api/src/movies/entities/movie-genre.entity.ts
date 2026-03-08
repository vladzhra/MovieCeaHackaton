import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from './genre.entity';

@Entity({ name: 'movie_genres' })
export class MovieGenre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieId!: number;

  @Column()
  genreId!: number;

  @ManyToOne(() => Movie, (movie: Movie) => movie.movieGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @ManyToOne(() => Genre, (genre: Genre) => genre.movieGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genreId' })
  genre!: Genre;

  @CreateDateColumn()
  createdAt!: Date;
}
