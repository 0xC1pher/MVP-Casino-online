import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.TRANSACTION_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.TRANSACTION_SERVICE_PORT) || 3004,
    },
  });
  await app.listen();
}
bootstrap();