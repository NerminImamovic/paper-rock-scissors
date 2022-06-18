import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { GamesService } from './games.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Game, GameDocument, GameSchema } from './game.schema';
import mongoose from 'mongoose';

let mongod;
let mongo;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongo = await MongoMemoryServer.create();
      const uri = await mongo.getUri();

      return {
        uri: uri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
      ],
      providers: [GamesService, Game],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should create a game', async () => {
    const game = await service.createGame('nermin');

    expect(game.status).toBe('not-started');
    expect(game.players).toStrictEqual(['nermin']);
  });
});
