import { WebSocket } from 'ws';

export type ChatClient = {
  name: string,
  connection: WebSocket,
}