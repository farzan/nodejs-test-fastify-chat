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

export const RoomInfoSchema = z.object({
  type: z.literal('room_info'),
  payload: z.object({
    room: RoomSchema,
  }),
})

export const MessageSchema = z.discriminatedUnion('type', [
  TextMessageSchema,
  RoomInfoSchema,
]);