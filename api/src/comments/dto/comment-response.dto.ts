import { Expose, Type } from 'class-transformer';

class UserInfo {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  isAdmin!: boolean;
}

export class CommentResponseDto {
  @Expose()
  id!: number;

  @Expose()
  content!: string;

  @Expose()
  rating!: number;

  @Expose()
  movieId!: number;

  @Expose()
  userId!: number;

  @Expose()
  @Type(() => UserInfo)
  user!: UserInfo;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
