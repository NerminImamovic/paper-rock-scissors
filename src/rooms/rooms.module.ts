import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.schema';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]), forwardRef(() => GamesModule)],
  providers: [RoomsService, RoomsResolver],
  exports: [RoomsService],
})
export class RoomsModule {}
