import { Injectable, Inject } from '@nestjs/common';
import { GameRepository } from '../../domain/ports/game.repository';
import { NotificationService } from '../../domain/ports/notification.service';
import { Game, GameType, GameStatus } from '../../domain/entities/game.entity';
import { BlackjackGame } from '../../domain/entities/blackjack.entity';
import { BingoGame } from '../../domain/entities/bingo.entity';
import { ScratchcardGame } from '../../domain/entities/scratchcard.entity';

@Injectable()
export class CreateGameUseCase {
  constructor(
    @Inject('GameRepository')
    private gameRepository: GameRepository,
    @Inject('NotificationService')
    private notificationService: NotificationService,
  ) {}

  async execute(gameType: GameType, userId: string): Promise<Game> {
    const game = new Game();
    game.gameType = gameType;
    game.status = GameStatus.WAITING;
    
    const savedGame = await this.gameRepository.createGame(game);

    switch (gameType) {
      case GameType.BLACKJACK:
        await this.createBlackjackGame(savedGame);
        break;
      case GameType.BINGO:
        await this.createBingoGame(savedGame);
        break;
      case GameType.SCRATCHCARD:
        await this.createScratchcardGame(savedGame);
        break;
    }

    this.notificationService.notifyNewGame(savedGame);
    return savedGame;
  }

  private async createBlackjackGame(game: Game): Promise<void> {
    const blackjackGame = new BlackjackGame();
    blackjackGame.game = game;
    blackjackGame.dealerCards = [];
    blackjackGame.playerCards = {};
    blackjackGame.deck = this.createDeck();
    await this.gameRepository.createBlackjackGame(blackjackGame);
  }

  private async createBingoGame(game: Game): Promise<void> {
    const bingoGame = new BingoGame();
    bingoGame.game = game;
    bingoGame.calledNumbers = [];
    bingoGame.cards = {};
    await this.gameRepository.createBingoGame(bingoGame);
  }

  private async createScratchcardGame(game: Game): Promise<void> {
    const scratchcardGame = new ScratchcardGame();
    scratchcardGame.game = game;
    scratchcardGame.symbols = this.generateScratchcardSymbols();
    scratchcardGame.prize = this.calculatePrize(scratchcardGame.symbols);
    await this.gameRepository.createScratchcardGame(scratchcardGame);
  }

  private createDeck(): string[] {
    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        deck.push(`${value}${suit}`);
      }
    }
    
    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private generateScratchcardSymbols(): Record<string, string> {
    const symbols = ['💎', '🍀', '7️⃣', '🌟', '🎰'];
    const positions: Record<string, string> = {};
    
    for (let i = 0; i < 9; i++) {
      positions[i.toString()] = symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    return positions;
  }

  private calculatePrize(symbols: Record<string, string>): number {
    const symbolCounts = Object.values(symbols).reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(symbolCounts));
    
    switch (maxCount) {
      case 3: return 100;
      case 4: return 500;
      case 5: return 1000;
      default: return 0;
    }
  }
}