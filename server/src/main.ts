import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`nestjs express server is listening on http://localhost:3000`)
  await app.listen(3000);
}
bootstrap();
