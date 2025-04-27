import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const PORT = 3002;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4000,
    },
  });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://8ace-2001-ee0-4f00-57d0-f4b5-6d0d-6d5-45c3.ngrok-free.app',
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log(`✅ API Gateway is running on port ${PORT}`);
}
bootstrap();
