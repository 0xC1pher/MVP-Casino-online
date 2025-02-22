import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('blackjack_games')
export class BlackjackGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Game)
  @JoinColumn()
  game: Game;

  @Column('simple-array')
  dealerCards: string[];

  @Column('jsonb')
  playerCards: Record<string, string[]>;

  @ManyToOne(() => User, { nullable: true })
  currentPlayer: User;

  @Column('simple-array')
  deck: string[];
}