import type { ChatRegistry } from "@/services/chat.registry.ts";
import { RoomService } from "../src/services/room.service.ts";
import type { EventEmitter } from "stream";

declare module 'fastify' {
  interface FastifyInstance {
    roomService: RoomService;
    chatRegistry: ChatRegistry;
    eventBus: EventEmitter;
  }
}
