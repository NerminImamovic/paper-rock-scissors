import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { Game } from '../../games/dto/game.dto';

@ObjectType()
export class Room {
  @Field(() => ID)
  @IsString()
  readonly id: string;

  @Field()
  @IsString()
  readonly name: string;

  @Field()
  @IsString()
  readonly admin: string;

  @IsArray()
  @Field(() => [Game])
  readonly games?: Game[];

  @Field(() => [String])
  @IsArray()
  readonly players: string[];
}
