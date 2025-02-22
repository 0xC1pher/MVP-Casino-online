import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GameModule } from './game.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(GameModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.GAME_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.GAME_SERVICE_PORT) || 3001,
    },
  });
  await app.listen();
}
bootstrap();