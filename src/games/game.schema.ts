import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GameStatus, Turn } from './enums';
import { PlayerGameResult } from './dto/game.dto';

@Schema()
export class Game {
  @Prop()
  players: string[];

  @Prop()
  waitingPlayers: string[];

  @Prop()
  turns: {
    player: string;
    turn: Turn;
  }[];

  @Prop()
  status: GameStatus;

  @Prop()
  playerGameResults: PlayerGameResult[];

  @Prop()
  roomId?: string;
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);
