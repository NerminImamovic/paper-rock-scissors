import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field()
  readonly admin: string;

  @Field()
  readonly name: string;
}

@InputType()
export class JoinRoomInput {
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
