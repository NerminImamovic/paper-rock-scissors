import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Room } from './dto/room.dto';
import { CreateRoomInput } from './room.input';
import { RoomsService } from './rooms.service';

@Resolver((of) => Room)
export class RoomsResolver {
  @Inject()
  private roomsService: RoomsService;

  @Query((returns) => [Room])
  public async rooms(): Promise<Room[]> {
    const rooms = await this.roomsService.getAllRooms();

    return rooms;
  }

  @Mutation((returns) => Room)
  public async createRoom(
    @Args('input') input: CreateRoomInput,
  ): Promise<Room> {
    return await this.roomsService.createRoom(input);
  }
}
