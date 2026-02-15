import type { Room } from '@shared/types/Room.js';
import { WebSocket } from 'ws';

export type ChatClient = {
  username: string,
  room: Room,
  connection: WebSocket,
}