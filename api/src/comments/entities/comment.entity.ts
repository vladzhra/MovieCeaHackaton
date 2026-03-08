import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int' })
  rating!: number;

  @Column()
  userId!: number;

  @Column()
  movieId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
