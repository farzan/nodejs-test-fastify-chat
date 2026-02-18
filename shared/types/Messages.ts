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

export type RoomInfoMessage = {
  type: "room_info",
  payload: {
    room: Room,
  }
}

export type ErrorMessage = {
  type: 'error',
  payload: {
    error: string,
  }
}

export type NewRoomMessage = {
  type: 'new_room',
  payload: {
    room: Room,
  }
}