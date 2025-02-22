import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../domain/ports/notification.service';
import { Game } from '../../domain/entities/game.entity';
import { User } from '../../domain/entities/user.entity';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketNotificationService implements NotificationService {
  @WebSocketServer()
  private server: Server;

  notifyNewGame(game: Game): void {
    this.server.emit('newGame', {
      id: game.id,
      type: game.gameType,
      status: game.status,
    });
  }

  notifyPlayerJoined(gameId: string, user: User): void {
    this.server.emit(`game:${gameId}:playerJoined`, {
      gameId,
      userId: user.id,
      username: user.username,
    });
  }

  notifyGameStarted(game: Game): void {
    this.server.emit(`game:${game.id}:started`, {
      gameId: game.id,
      status: game.status,
    });
  }

  notifyGameUpdated(game: Game): void {
    this.server.emit(`game:${game.id}:updated`, {
      gameId: game.id,
      status: game.status,
    });
  }

  notifyPlayerTurn(gameId: string, userId: string): void {
    this.server.emit(`game:${gameId}:playerTurn`, {
      gameId,
      userId,
    });
  }

  notifyGameEnded(game: Game, winners: User[]): void {
    this.server.emit(`game:${game.id}:ended`, {
      gameId: game.id,
      winners: winners.map(w => ({
        id: w.id,
        username: w.username,
      })),
    });
  }
}