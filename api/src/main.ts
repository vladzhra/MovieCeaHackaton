import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Polyfill for BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true, // Allow frontend origin
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MovieCea API')
    .setDescription('The MovieCea API description')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
