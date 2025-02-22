import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GameRepository } from '../../domain/ports/game.repository';
import { Game, GameType, GameStatus } from '../../domain/entities/game.entity';
import { BlackjackGame } from '../../domain/entities/blackjack.entity';
import { BingoGame } from '../../domain/entities/bingo.entity';
import { ScratchcardGame } from '../../domain/entities/scratchcard.entity';
import { GameParticipant } from '../../domain/entities/game-participant.entity';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PostgresGameRepository implements GameRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(BlackjackGame)
    private blackjackRepository: Repository<BlackjackGame>,
    @InjectRepository(BingoGame)
    private bingoRepository: Repository<BingoGame>,
    @InjectRepository(ScratchcardGame)
    private scratchcardRepository: Repository<ScratchcardGame>,
    @InjectRepository(GameParticipant)
    private participantRepository: Repository<GameParticipant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createGame(game: Game): Promise<Game> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedGame = await queryRunner.manager.save(Game, game);
      await queryRunner.commitTransaction();
      return savedGame;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findGameById(id: string): Promise<Game> {
    return this.gameRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.user'],
    });
  }

  async updateGame(game: Game): Promise<Game> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedGame = await queryRunner.manager.save(Game, game);
      await queryRunner.commitTransaction();
      return updatedGame;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findActiveGamesByType(type: string): Promise<Game[]> {
    return this.gameRepository.find({
      where: {
        gameType: type as GameType,
        status: GameStatus.WAITING,
      },
      relations: ['participants', 'participants.user'],
    });
  }

  // Enhanced transaction management for critical operations
  async updateUserBalance(userId: string, amount: number): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new Error('User not found');
      }

      user.balance = amount;
      const updatedUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Additional game-specific operations with transaction management
  async addParticipantWithTransaction(participant: GameParticipant): Promise<GameParticipant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: participant.user.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.balance < participant.betAmount) {
        throw new Error('Insufficient balance');
      }

      user.balance -= participant.betAmount;
      await queryRunner.manager.save(User, user);
      
      const savedParticipant = await queryRunner.manager.save(GameParticipant, participant);
      await queryRunner.commitTransaction();
      return savedParticipant;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Rest of the repository methods...
}