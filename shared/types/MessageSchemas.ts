import { z } from "zod";
import { RoomSchema } from "./Room.js";

export const TextMessageSchema = z.object({
  type: z.literal('message'),
  sender: z.string(),
  roomId: z.number(),
  payload: z.object({
    text: z.string(),
  }),
});

export const RoomInfoMessageSchema = z.object({
  type: z.literal('room_info'),
  payload: z.object({
    room: RoomSchema,
  }),
})

export const ErrorMessageSchema = z.object({
  type: z.literal('error'),
  payload: z.object({
    error: z.string(),
  }),
});

export const NewRoomMessageSchema = z.object({
  type: z.literal('new_room'),
  payload: z.object({
    room: RoomSchema,
  }),
});

export const MessageSchema = z.discriminatedUnion('type', [
  TextMessageSchema,
  RoomInfoMessageSchema,
  ErrorMessageSchema,
  NewRoomMessageSchema,
]);
