import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { GameStatus } from '../../domain/entities/game.entity';

@Injectable()
export class BlackjackPlayUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async hit(gameId: string, userId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blackjackGame = await this.gameRepository.findBlackjackGameById(gameId);
      if (!blackjackGame || blackjackGame.currentPlayer.id !== userId) {
        throw new Error('Invalid game state or not player\'s turn');
      }

      const playerCards = blackjackGame.playerCards[userId];
      playerCards.push(blackjackGame.deck.pop()!);
      
      const playerScore = this.calculateScore(playerCards);
      if (playerScore > 21) {
        await this.handleBust(gameId, userId, queryRunner);
      }

      await this.gameRepository.updateBlackjackGame(blackjackGame);
      await queryRunner.commitTransaction();
      
      this.notificationService.notifyGameUpdated(blackjackGame.game);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async stand(gameId: string, userId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blackjackGame = await this.gameRepository.findBlackjackGameById(gameId);
      if (!blackjackGame || blackjackGame.currentPlayer.id !== userId) {
        throw new Error('Invalid game state or not player\'s turn');
      }

      // Dealer's turn
      while (this.calculateScore(blackjackGame.dealerCards) < 17) {
        blackjackGame.dealerCards.push(blackjackGame.deck.pop()!);
      }

      await this.determineWinner(gameId, queryRunner);
      await this.gameRepository.updateBlackjackGame(blackjackGame);
      await queryRunner.commitTransaction();

      this.notificationService.notifyGameUpdated(blackjackGame.game);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private calculateScore(cards: string[]): number {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
      const value = card.slice(0, -1);
      if (value === 'A') {
        aces++;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(value)) {
        score += 10;
      } else {
        score += parseInt(value);
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  }

  private async handleBust(gameId: string, userId: string, queryRunner: any): Promise<void> {
    const game = await this.gameRepository.findGameById(gameId);
    const participant = (await this.gameRepository.findParticipantsByGameId(gameId))
      .find(p => p.user.id === userId);

    if (participant) {
      participant.winnings = 0;
      await queryRunner.manager.save(participant);
    }

    game.status = GameStatus.FINISHED;
    await queryRunner.manager.save(game);
  }

  private async determineWinner(gameId: string, queryRunner: any): Promise<void> {
    const blackjackGame = await this.gameRepository.findBlackjackGameById(gameId);
    const game = await this.gameRepository.findGameById(gameId);
    const participants = await this.gameRepository.findParticipantsByGameId(gameId);
    
    const dealerScore = this.calculateScore(blackjackGame.dealerCards);
    const winners: string[] = [];

    for (const participant of participants) {
      const playerScore = this.calculateScore(blackjackGame.playerCards[participant.user.id]);
      
      if (playerScore <= 21 && (dealerScore > 21 || playerScore > dealerScore)) {
        winners.push(participant.user.id);
        participant.winnings = participant.betAmount * 2;
        await queryRunner.manager.save(participant);
        
        const user = await this.gameRepository.findUserById(participant.user.id);
        await this.gameRepository.updateUserBalance(
          user.id,
          user.balance + participant.winnings
        );
      }
    }

    game.status = GameStatus.FINISHED;
    await queryRunner.manager.save(game);
  }
}