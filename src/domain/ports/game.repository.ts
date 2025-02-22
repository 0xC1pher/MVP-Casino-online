import { Game } from '../entities/game.entity';
import { BlackjackGame } from '../entities/blackjack.entity';
import { BingoGame } from '../entities/bingo.entity';
import { ScratchcardGame } from '../entities/scratchcard.entity';
import { GameParticipant } from '../entities/game-participant.entity';
import { User } from '../entities/user.entity';

export interface GameRepository {
  // Game operations
  createGame(game: Game): Promise<Game>;
  findGameById(id: string): Promise<Game>;
  updateGame(game: Game): Promise<Game>;
  findActiveGamesByType(type: string): Promise<Game[]>;
  
  // Game type specific operations
  createBlackjackGame(blackjackGame: BlackjackGame): Promise<BlackjackGame>;
  findBlackjackGameById(id: string): Promise<BlackjackGame>;
  updateBlackjackGame(blackjackGame: BlackjackGame): Promise<BlackjackGame>;
  
  createBingoGame(bingoGame: BingoGame): Promise<BingoGame>;
  findBingoGameById(id: string): Promise<BingoGame>;
  updateBingoGame(bingoGame: BingoGame): Promise<BingoGame>;
  
  createScratchcardGame(scratchcardGame: ScratchcardGame): Promise<ScratchcardGame>;
  findScratchcardGameById(id: string): Promise<ScratchcardGame>;
  updateScratchcardGame(scratchcardGame: ScratchcardGame): Promise<ScratchcardGame>;
  
  // Participant operations
  addParticipant(participant: GameParticipant): Promise<GameParticipant>;
  findParticipantsByGameId(gameId: string): Promise<GameParticipant[]>;
  updateParticipant(participant: GameParticipant): Promise<GameParticipant>;
  
  // User operations
  findUserById(id: string): Promise<User>;
  updateUserBalance(userId: string, amount: number): Promise<User>;
}