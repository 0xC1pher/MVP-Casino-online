import { Injectable, Inject } from '@nestjs/common';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { Game, GameStatus, GameType } from '../../domain/entities/game.entity';

@Injectable()
export class StartGameUseCase {
  constructor(
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async execute(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Game cannot be started');
    }

    const participants = await this.gameRepository.findParticipantsByGameId(gameId);
    if (participants.length === 0) {
      throw new Error('Cannot start game without participants');
    }

    game.status = GameStatus.IN_PROGRESS;
    const updatedGame = await this.gameRepository.updateGame(game);

    switch (game.gameType) {
      case GameType.BLACKJACK:
        await this.startBlackjackGame(gameId);
        break;
      case GameType.BINGO:
        await this.startBingoGame(gameId);
        break;
      case GameType.SCRATCHCARD:
        await this.startScratchcardGame(gameId);
        break;
    }

    this.notificationService.notifyGameStarted(updatedGame);
    return updatedGame;
  }

  private async startBlackjackGame(gameId: string): Promise<void> {
    const blackjackGame = await this.gameRepository.findBlackjackGameById(gameId);
    if (!blackjackGame) {
      throw new Error('Blackjack game not found');
    }

    const participants = await this.gameRepository.findParticipantsByGameId(gameId);
    
    // Deal initial cards
    for (const participant of participants) {
      blackjackGame.playerCards[participant.user.id] = [
        blackjackGame.deck.pop()!,
        blackjackGame.deck.pop()!,
      ];
    }

    blackjackGame.dealerCards = [blackjackGame.deck.pop()!];
    blackjackGame.currentPlayer = participants[0].user;

    await this.gameRepository.updateBlackjackGame(blackjackGame);
  }

  private async startBingoGame(gameId: string): Promise<void> {
    const bingoGame = await this.gameRepository.findBingoGameById(gameId);
    if (!bingoGame) {
      throw new Error('Bingo game not found');
    }

    const participants = await this.gameRepository.findParticipantsByGameId(gameId);
    
    // Generate bingo cards for each participant
    for (const participant of participants) {
      bingoGame.cards[participant.user.id] = this.generateBingoCard();
    }

    await this.gameRepository.updateBingoGame(bingoGame);
  }

  private async startScratchcardGame(gameId: string): Promise<void> {
    const scratchcardGame = await this.gameRepository.findScratchcardGameById(gameId);
    if (!scratchcardGame) {
      throw new Error('Scratchcard game not found');
    }
    // Scratchcard games start immediately when created, no additional setup needed
  }

  private generateBingoCard(): number[][] {
    const card: number[][] = [];
    const usedNumbers = new Set<number>();

    for (let i = 0; i < 5; i++) {
      const row: number[] = [];
      for (let j = 0; j < 5; j++) {
        let num: number;
        do {
          num = Math.floor(Math.random() * 75) + 1;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        row.push(num);
      }
      card.push(row);
    }

    return card;
  }
}