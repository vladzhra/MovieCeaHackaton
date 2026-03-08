import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/entities/user.entity';
import { Movie } from './movies/entities/movie.entity';
import { Genre } from './movies/entities/genre.entity';
import { ProductionCompany } from './movies/entities/production-company.entity';
import { ProductionCountry } from './movies/entities/production-country.entity';
import { SpokenLanguage } from './movies/entities/spoken-language.entity';
import { MovieGenre } from './movies/entities/movie-genre.entity';
import { MovieProductionCompany } from './movies/entities/movie-production-company.entity';
import { MovieProductionCountry } from './movies/entities/movie-production-country.entity';
import { MovieSpokenLanguage } from './movies/entities/movie-spoken-language.entity';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [
          User,
          Movie,
          Genre,
          ProductionCompany,
          ProductionCountry,
          SpokenLanguage,
          MovieGenre,
          MovieProductionCompany,
          MovieProductionCountry,
          MovieSpokenLanguage,
          Comment,
        ],
        synchronize: true, // Should be false in production, but okay for this exercise
      }),
    }),
    MoviesModule,
    AuthModule,
    UsersModule,
    CommentsModule,
  ],
})
export class AppModule {}
