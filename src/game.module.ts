import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './domain/entities/game.entity';
import { User } from './domain/entities/user.entity';
import { GameParticipant } from './domain/entities/game-participant.entity';
import { BlackjackGame } from './domain/entities/blackjack.entity';
import { BingoGame } from './domain/entities/bingo.entity';
import { ScratchcardGame } from './domain/entities/scratchcard.entity';
import { PostgresGameRepository } from './infrastructure/repositories/postgres-game.repository';
import { WebsocketNotificationService } from './infrastructure/services/websocket-notification.service';
import { GameGateway } from './infrastructure/websocket/game.gateway';
import { CreateGameUseCase } from './application/use-cases/create-game.use-case';
import { JoinGameUseCase } from './application/use-cases/join-game.use-case';
import { StartGameUseCase } from './application/use-cases/start-game.use-case';
import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";


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
  ],
  providers: [
    {
      provide: 'GameRepository',
      useClass: PostgresGameRepository,
    },
    {
      provide: 'NotificationService',
      useClass: WebsocketNotificationService,
    },
    GameGateway,
    CreateGameUseCase,
    JoinGameUseCase,
    StartGameUseCase,
  ],
  exports: [
    CreateGameUseCase,
    JoinGameUseCase,
    StartGameUseCase,
  ],
@Module({
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}

})
export class GameModule {}

export { GameModule }