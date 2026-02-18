import type { RoomRepository } from "@/repositories/room.repository.js";
import type { Room } from "@shared/types/Room.js";
import type EventEmitter from "events";
import * as events from "@/types/events.js";

export type RoomService = ReturnType<typeof createRoomService>;

export function createRoomService(
  deps: {
    roomRepository: RoomRepository,
    eventBus: EventEmitter,
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

      const newRoom = await deps.roomRepository.createRoom(room);
      deps.eventBus.emit(events.ROOM_CREATED, newRoom);

      return newRoom;
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
