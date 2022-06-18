import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameStatus, Turn } from './enums';
import { GameDocument } from './game.schema';
import { Game as GameType, PlayerGameResult } from './dto/game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel('Game') private readonly game: Model<GameDocument>,
  ) {}

  public async getAllGames(): Promise<GameType[]> {
    const games = await this.game.find({});

    return games.map((game) => this.mapGameToGameType(game)) as GameType[];
  }

  public async getGame(id: string): Promise<GameType> {
    const game = await this.game.findById(id);

    return this.mapGameToGameType(game);
  }

  public async createGame(admin: string): Promise<GameType> {
    const game = await this.game.create({
      players: [admin],
      status: GameStatus.NotStarted,
    });

    return this.mapGameToGameType(game);
  }

  public async joinGame(id: string, player: string): Promise<GameType> {
    const game = await this.game.findById(id);

    if (game.players.includes(player)) {
      throw new Error('User with that name already exists');
    }

    const players = [...game.players, player];
    const waitingPlayers = players;

    await this.game.updateOne(
      { _id: game._id },
      { $set: { players, waitingPlayers } },
    );

    return {
      ...this.mapGameToGameType(game),
      waitingPlayers,
    } as GameType;
  }

  public async startgame(id: string): Promise<GameType> {
    await this.game.updateOne(
      { _id: id },
      { $set: { status: GameStatus.InProgress } },
    );

    const game = await this.game.findById(id);

    return this.mapGameToGameType(game);
  }

  public async turn(gameId: string, player: string, turn: Turn) {
    const game = await this.game.findById(gameId);

    if (game.status !== GameStatus.InProgress) {
      throw new Error();
    }

    const turns = [...game.turns, { player, turn }];
    const waitingPlayers = game.waitingPlayers.filter(
      (waitingPlayer) => waitingPlayer !== player,
    );

    await this.game.updateOne(
      { _id: game._id },
      { $set: { turns, waitingPlayers } },
    );

    return {
      ...this.mapGameToGameType(game),
      turns,
    } as GameType;
  }

  public async summarizeResult(gameId: string) {
    const game = await this.game.findById(gameId);

    const winnerMatrix = {
      [Turn.Paper]: Turn.Rock,
      [Turn.Rock]: Turn.Scissors,
      [Turn.Scissors]: Turn.Paper,
    };

    const turns = Object.values(Turn);
    const turnPlayers = {};

    turns.forEach((turn) => {
      turnPlayers[turn] = game.turns
        .filter((playerTurn) => playerTurn.turn === turn)
        .map((playerTurn) => playerTurn.player);
    });

    const playerGameResults = game.turns
      .map((turn) => {
        return {
          winningPlayer: turn.player,
          turn: turn.turn,
          defeatedPlayers: turnPlayers[winnerMatrix[turn.turn]],
        } as PlayerGameResult;
      })
      .filter((turn) => turn.defeatedPlayers.length);

    await this.game.updateOne(
      { _id: game._id },
      { $set: { playerGameResults, status: GameStatus.Finished } },
    );

    return {
      ...this.mapGameToGameType(game),
      playerGameResults,
    };
  }

  private mapGameToGameType(game: any): GameType {
    return {
      id: game._id,
      players: game.players || [],
      status: game.status,
      turns: game.turns,
      waitingPlayers: game.waitingPlayers,
      playerGameResults: game.playerGameResults,
    } as GameType;
  }
}
