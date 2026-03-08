import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { SpokenLanguage } from './spoken-language.entity';

@Entity({ name: 'movie_spoken_languages' })
export class MovieSpokenLanguage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieId!: number;

  @Column()
  spokenLanguageIso!: string;

  @ManyToOne(() => Movie, (movie: Movie) => movie.movieSpokenLanguages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @ManyToOne(
    () => SpokenLanguage,
    (language: SpokenLanguage) => language.movieSpokenLanguages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'spokenLanguageIso' })
  spokenLanguage!: SpokenLanguage;

  @CreateDateColumn()
  createdAt!: Date;
}
