import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomInput } from './room.input';
import { Room, RoomDocument } from './room.schema';
import { Room as RoomType } from './dto/room.dto';
import { Game } from 'src/games/dto/game.dto';

@Injectable()
export class RoomsService {

    @InjectModel('Room') private readonly room: Model<RoomDocument>;

    public async getAllRooms() {
        const rooms = await this.room.find({});

        return rooms.map(room => this.mapRoomToRoomType(room));
    }

    public async createRoom(input:CreateRoomInput):Promise<RoomType> {
        const room = await this.room.create({
            admin: input.admin,
            name: input.name
        });
      
        return this.mapRoomToRoomType(room);
    }

    public async createRoomGame(id:string, game:Game):Promise<RoomType> {

        const room = await this.room.findById(id);

        const games = [...room.games, game];

        await this.room.updateOne(
            { _id: room._id },
            { $set: { games } },
        );

        return {
            ...this.mapRoomToRoomType(room),
            games,
        };
    }

    public async joinRoom(id: string, player: string): Promise<RoomType> {
        const room = await this.room.findById(id);

        if (room.players.includes(player)) {
            throw new Error('User with that name already exists');
          }

        const players = [...room.players, player];
    
        await this.room.updateOne(
          { _id: room._id },
          { $set: { players } },
        );

        return {
            ...this.mapRoomToRoomType(room),
            players,
        };
      }

    private mapRoomToRoomType(room:any):RoomType {
        return {
            id: room._id,
            admin: room.admin,
            name: room.name,
            games: room.games || [],
            players: room.players || [],
        } as RoomType;
    }


    // constructor(
    //     @InjectModel('Game') private readonly game: Model<GameDocument>,
    //   ) {}

    // get all rooms


    // create room

    // get room games

    // join users to room

    // create game room 

    // 

}
