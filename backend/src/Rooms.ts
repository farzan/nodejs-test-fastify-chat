import type { Room } from "@shared/types/Room.js";

const rooms: Room[] = [];

export function getRooms(): Room[] {
  return rooms;
}

export function getRoomById(id: number): Room {
  for (const room of getRooms()) {
    if (room.id === id) {
      return room;
    }
  }

  throw new Error('Room not found');
}

export function createRoom(title: string): Room {
  rooms.forEach(el => {
    if (el.title === title) {
      throw new Error(`Room with the same title exists: ${title}`);
    }
  })

  const room: Room = {
    id: rooms.length + 1,
    title,
  }

  rooms.push(room);

  return room;
}
