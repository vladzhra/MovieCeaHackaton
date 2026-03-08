import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MovieSpokenLanguage } from './movie-spoken-language.entity';

@Entity({ name: 'spoken_languages' })
export class SpokenLanguage {
  @PrimaryColumn()
  iso!: string;

  @Column()
  name!: string;

  @OneToMany(
    () => MovieSpokenLanguage,
    (movieLanguage: MovieSpokenLanguage) => movieLanguage.spokenLanguage,
  )
  movieSpokenLanguages!: MovieSpokenLanguage[];
}
