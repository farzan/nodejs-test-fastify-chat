import type { Room } from "@shared/types/Room.js";

export interface RoomRepository {
  getRooms(): Promise<Room[]>;
  getRoomById(id: number): Promise<Room | null>;
  createRoom(room: Omit<Room, 'id'>):Promise<Room>;
}

export class RoomAlreadyExistsError extends Error {
  constructor(title: string) {
    super(`Room with the same title already exists: ${title}`);
    this.name = 'RoomAlreadyExistsError';
  }
}
