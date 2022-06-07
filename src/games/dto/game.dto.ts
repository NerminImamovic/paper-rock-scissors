import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { GameStatus } from 'src/enums';

@ObjectType()
export class Turn {
  @Field()
  @IsString()
  player: string;

  @Field()
  @IsString()
  turn: string;
}

@ObjectType()
export class PlayerGameResult {
  @Field()
  @IsString()
  winningPlayer: string;

  @Field()
  @IsString()
  turn: string;

  @Field(() => [String])
  @IsArray()
  defeatedPlayers: string[];
}

@ObjectType()
export class Game {
  @Field(() => ID)
  @IsString()
  readonly id: string;

  @Field(() => [String])
  @IsArray()
  readonly players: string[];

  @Field(() => [String])
  @IsArray()
  readonly waitingPlayers: string[];

  @Field()
  @IsString()
  readonly status: GameStatus;

  @Field(() => [Turn!])
  @IsArray()
  readonly turns: Turn[];

  @Field(() => [PlayerGameResult])
  @IsArray()
  readonly playerGameResults: PlayerGameResult[];
}
