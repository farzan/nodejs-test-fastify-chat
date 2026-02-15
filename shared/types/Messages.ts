import type { Room } from "./Room.js";

export type ClientMessage = {
  type: "message",
  payload: {
    text: string,
  }
}

export type TextMessage = {
  type: "message",
  sender: string,
  roomId: number,
  payload: {
    text: string,
  }
}

export type RoomInfo = {
  type: "room_info",
  payload: {
    room: Room,
  }
}