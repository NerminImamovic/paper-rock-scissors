import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateGameInput {
  @Field()
  readonly user: string;

  @Field()
  roomId?: string;
}

@InputType()
export class JoinGameInput {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly player: string;
}

@InputType()
export class GameInput {
  @Field(() => ID)
  readonly id: string;
}

@InputType()
export class PlayerTurnInput {
  @Field(() => ID)
  readonly gameId: string;

  @Field()
  readonly player: string;

  @Field()
  readonly turn: string;
}
