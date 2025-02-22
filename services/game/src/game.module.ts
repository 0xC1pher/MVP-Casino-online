import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Game } from './domain/entities/game.entity';
import { User } from './domain/entities/user.entity';
import { GameParticipant } from './domain/entities/game-participant.entity';
import { BlackjackGame } from './domain/entities/blackjack.entity';
import { BingoGame } from './domain/entities/bingo.entity';
import { ScratchcardGame } from './domain/entities/scratchcard.entity';
import { PostgresGameRepository } from './infrastructure/repositories/postgres-game.repository';
import { CreateGameUseCase } from './application/use-cases/create-game.use-case';
import { JoinGameUseCase } from './application/use-cases/join-game.use-case';
import { StartGameUseCase } from './application/use-cases/start-game.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      User,
      GameParticipant,
      BlackjackGame,
      BingoGame,
      ScratchcardGame,
    ]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.NOTIFICATION_SERVICE_PORT) || 3003
        }
      },
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TRANSACTION_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.TRANSACTION_SERVICE_PORT) || 3004
        }
      }
    ])
  ],
  providers: [
    {
      provide: 'GameRepository',
      useClass: PostgresGameRepository,
    },
    CreateGameUseCase,
    JoinGameUseCase,
    StartGameUseCase,
  ],
  exports: [
    CreateGameUseCase,
    JoinGameUseCase,
    StartGameUseCase,
  ],
})
export class GameModule {}