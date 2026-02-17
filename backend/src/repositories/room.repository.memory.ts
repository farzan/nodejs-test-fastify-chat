import type { Room } from "@shared/types/Room.js";
import { RoomAlreadyExistsError, type RoomRepository } from "@/repositories/room.repository.js";

export class InMemoryRoomRepository implements RoomRepository {
  private readonly rooms: Room[] = [];

  async getRooms(): Promise<Room[]> {
    return this.rooms;
  }

  async getRoomById(id: number): Promise<Room | null> {
    for (const room of this.rooms) {
      if (room.id === id) {
        return room;
      }
    }

    return null;
  }

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    if (this.rooms.some(r => r.title === room.title)) {
      throw new RoomAlreadyExistsError(room.title);
    }

    const newRoom: Room = {
      ...room,
      id: this.rooms.length + 1,
    }

    this.rooms.push(newRoom);

    return newRoom;
  }
}