import { forwardRef, Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { GameSchema } from './game.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Game } from './dto/game.dto';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]), RoomsModule],
  providers: [GamesService, GamesResolver, Game],
  exports: [Game]
})
export class GamesModule {}
