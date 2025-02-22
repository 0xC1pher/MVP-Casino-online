import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { GameStatus } from '../../domain/entities/game.entity';

@Injectable()
export class BingoPlayUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async checkNumber(gameId: string, userId: string, number: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bingoGame = await this.gameRepository.findBingoGameById(gameId);
      if (!bingoGame || bingoGame.winner) {
        throw new Error('Invalid game state');
      }

      const userCard = bingoGame.cards[userId];
      if (!this.hasNumberInCard(userCard, number)) {
        throw new Error('Number not found in player\'s card');
      }

      if (!bingoGame.calledNumbers.includes(number)) {
        bingoGame.calledNumbers.push(number);
      }

      if (this.checkWin(userCard, bingoGame.calledNumbers)) {
        await this.handleWin(gameId, userId, queryRunner);
      }

      await this.gameRepository.updateBingoGame(bingoGame);
      await queryRunner.commitTransaction();

      this.notificationService.notifyGameUpdated(bingoGame.game);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private hasNumberInCard(card: number[][], number: number): boolean {
    return card.some(row => row.includes(number));
  }

  private checkWin(card: number[][], calledNumbers: number[]): boolean {
    // Check rows
    if (card.some(row => row.every(num => calledNumbers.includes(num)))) {
      return true;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (card.every(row => calledNumbers.includes(row[col]))) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]];
    const diagonal2 = [card[0][4], card[1][3], card[2][2], card[3][1], card[4][0]];

    if (diagonal1.every(num => calledNumbers.includes(num))) {
      return true;
    }

    if (diagonal2.every(num => calledNumbers.includes(num))) {
      return true;
    }

    return false;
  }

  private async handleWin(gameId: string, userId: string, queryRunner: any): Promise<void> {
    const game = await this.gameRepository.findGameById(gameId);
    const participant = (await this.gameRepository.findParticipantsByGameId(gameId))
      .find(p => p.user.id === userId);

    if (participant) {
      const totalBets = (await this.gameRepository.findParticipantsByGameId(gameId))
        .reduce((sum, p) => sum + p.betAmount, 0);

      participant.winnings = totalBets;
      await queryRunner.manager.save(participant);

      const user = await this.gameRepository.findUserById(userId);
      await this.gameRepository.updateUserBalance(
        user.id,
        user.balance + participant.winnings
      );
    }

    game.status = GameStatus.FINISHED;
    await queryRunner.manager.save(game);
  }
}