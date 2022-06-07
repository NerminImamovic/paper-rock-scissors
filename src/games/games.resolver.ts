import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  Context,
  Subscription,
} from '@nestjs/graphql';
import {
  CreateGameInput,
  GameInput,
  JoinGameInput,
  PlayerTurnInput,
} from './game-input.input';
import { Game } from './dto/game.dto';
import { GamesService } from './games.service';
import { Turn } from 'src/enums';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver((of) => Game)
export class GamesResolver {
  @Inject()
  private gamesService: GamesService;

  @Query((returns) => [Game])
  public async games(): Promise<Game[]> {
    return this.gamesService.getAllGames();
  }

  @Query((returns) => Game)
  public async game(@Args('input') input: GameInput): Promise<Game> {
    return await this.gamesService.getGame(input.id);
  }

  // @Query((returns) => [User])
  // public async users(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // create game
  @Mutation((returns) => Game)
  public async createGame(
    @Args('input') input: CreateGameInput,
  ): Promise<Game> {
    return await this.gamesService.createGame(input.user);
  }

  @Mutation((returns) => Game)
  public async joinGame(@Args('input') input: JoinGameInput): Promise<Game> {
    return await this.gamesService.joinGame(input.id, input.player);
  }

  @Mutation((returns) => Game)
  public async startGame(
    @Args('input') input: GameInput,
    // @Context('pubsub') pubSub: PubSub,
  ): Promise<Game> {
    const game = await this.gamesService.startgame(input.id);

    pubSub.publish('subscribedGame', { subscribedGame: game });

    return game;
  }

  @Mutation((returns) => Game)
  public async turn(@Args('input') input: PlayerTurnInput): Promise<Game> {
    return await this.gamesService.turn(
      input.gameId,
      input.player,
      input.turn as Turn,
    );
  }

  @Mutation((returns) => Game)
  public async summarizeResult(@Args('input') input: GameInput) {
    return await this.gamesService.summarizeResult(input.id);
  }

  @Subscription((returns) => Game, {
    filter: (payload, variables) =>
      payload.subscribedGame.id == variables.gameId,
  })
  subscribedGame(@Args('gameId') gameId: string) {
    return pubSub.asyncIterator('subscribedGame');
  }

  // join game
  // play
  // turn
  // game status
}
