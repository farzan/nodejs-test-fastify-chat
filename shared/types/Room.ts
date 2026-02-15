import { z } from "zod";

export type Room = {
  id: number,
  title: string,
}

export const RoomSchema = z.object({
  id: z.number(),
  title: z.string(),
});