import type { RoomRepository } from "@/repositories/room.repository.js";
import type { Room } from "@shared/types/Room.js";

export type RoomService = ReturnType<typeof createRoomService>;

export function createRoomService(
  deps: {
    roomRepository: RoomRepository,
  }
) {
  return {
    async getRooms(): Promise<Room[]> {
      return deps.roomRepository.getRooms();
    },

    async getRoomById(id: number): Promise<Room> {
      const room = await deps.roomRepository.getRoomById(id);

      if (!room) {
        throw new RoomNotFoundError(id);
      }

      return room;
    },

    async createRoom(title: string): Promise<Room> {
      const room = { title };

      return deps.roomRepository.createRoom(room);
    }
  }
}

export class RoomNotFoundError extends Error {
  id: number;

  constructor(id: number) {
    super(`Room with Id ${id} not found`);
    this.id = id
  }
}
