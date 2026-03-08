import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { MoviesService } from './movies/movies.service';
import { CreateUserInternalDto } from './users/dto/create-user-internal.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const moviesService = app.get(MoviesService);

  // Admin user
  const adminEmail = 'admin@moviecea.com';
  const existingAdmin = await usersService.findOneByEmail(adminEmail);
  if (!existingAdmin) {
    const adminUser: CreateUserInternalDto = {
      email: adminEmail,
      password: 'adminpassword',
      isAdmin: true,
    };
    await usersService.create(adminUser);
    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }

  // Movie seed
  console.log('Seeding movies...');
  const result = await moviesService.importMovies(true);
  console.log('Movies Seed result:', result);

  await app.close();
}

bootstrap();
