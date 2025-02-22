import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('scratchcard_games')
export class ScratchcardGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Game)
  @JoinColumn()
  game: Game;

  @Column('jsonb')
  symbols: Record<string, string>;

  @Column('decimal', { default: 0 })
  prize: number;

  @Column('boolean', { default: false })
  revealed: boolean;
}