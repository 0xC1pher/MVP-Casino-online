import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('game_participants')
export class GameParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, game => game.participants)
  game: Game;

  @ManyToOne(() => User, user => user.gameParticipants)
  user: User;

  @Column('decimal')
  betAmount: number;

  @Column('decimal', { default: 0 })
  winnings: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}