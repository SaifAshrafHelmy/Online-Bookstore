import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await ConfigModule.envVariablesLoaded;
  app.enableCors({
    origin: process.env.FRONTEND_CLIENT,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const app_port: number = 5000;
  console.log(
    `nestjs express server is listening on http://localhost:${app_port}`,
  );
  await app.listen(app_port);
}
bootstrap();
