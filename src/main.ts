import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin: ['http://localhost:3000', 'http://31.130.150.32', 'http://31.130.150.32:3000'],
    credentials: true,
    exposedHeaders: 'set-cookie'
  })
  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
  });
  await app.listen(4200);
}
bootstrap();
