import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('bingo_games')
export class BingoGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Game)
  @JoinColumn()
  game: Game;

  @Column('int', { array: true, default: [] })
  calledNumbers: number[];

  @Column('int', { nullable: true })
  currentNumber: number;

  @Column('jsonb')
  cards: Record<string, number[][]>;

  @ManyToOne(() => User, { nullable: true })
  winner: User;
}