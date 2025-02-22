import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { GameStatus } from '../../domain/entities/game.entity';

@Injectable()
export class ScratchcardPlayUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async reveal(gameId: string, userId: string, position: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const scratchcardGame = await this.gameRepository.findScratchcardGameById(gameId);
      if (!scratchcardGame || scratchcardGame.revealed) {
        throw new Error('Invalid game state');
      }

      const game = await this.gameRepository.findGameById(gameId);
      const participant = (await this.gameRepository.findParticipantsByGameId(gameId))
        .find(p => p.user.id === userId);

      if (!participant) {
        throw new Error('Player not found in game');
      }

      scratchcardGame.revealed = true;
      
      if (scratchcardGame.prize > 0) {
        participant.winnings = scratchcardGame.prize;
        await queryRunner.manager.save(participant);

        const user = await this.gameRepository.findUserById(userId);
        await this.gameRepository.updateUserBalance(
          user.id,
          user.balance + scratchcardGame.prize
        );
      }

      game.status = GameStatus.FINISHED;
      await queryRunner.manager.save(game);
      await this.gameRepository.updateScratchcardGame(scratchcardGame);
      await queryRunner.commitTransaction();

      this.notificationService.notifyGameUpdated(game);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}