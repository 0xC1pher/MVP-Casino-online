import { Injectable, Inject } from '@nestjs/common';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { GameParticipant } from '../../domain/entities/game-participant.entity';
import { GameStatus } from '../../domain/entities/game.entity';

@Injectable()
export class JoinGameUseCase {
  constructor(
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async execute(gameId: string, userId: string, betAmount: number): Promise<GameParticipant> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Game is not accepting new players');
    }

    const user = await this.gameRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < betAmount) {
      throw new Error('Insufficient balance');
    }

    // Deduct bet amount from user balance
    await this.gameRepository.updateUserBalance(userId, user.balance - betAmount);

    const participant = new GameParticipant();
    participant.game = game;
    participant.user = user;
    participant.betAmount = betAmount;

    const savedParticipant = await this.gameRepository.addParticipant(participant);
    
    this.notificationService.notifyPlayerJoined(game.id, user);
    
    return savedParticipant;
  }
}