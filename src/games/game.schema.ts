import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GameStatus, Turn } from 'src/enums';
import { PlayerGameResult } from './dto/game.dto';

// export type GameDocument =

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
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);
