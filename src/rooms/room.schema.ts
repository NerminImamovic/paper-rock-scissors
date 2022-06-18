import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Game } from 'src/games/dto/game.dto';

// export type GameDocument =

@Schema()
export class Room {
  @Prop()
  name: string;

  @Prop()
  admin: string;

  @Prop()
  games: Game[];

  @Prop()
  players: string[];
}

export type RoomDocument = Room & Document;

export const RoomSchema = SchemaFactory.createForClass(Room);
