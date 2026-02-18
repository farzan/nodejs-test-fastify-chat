import { WebSocket } from "ws";
import type { RoomService } from "./room.service.js";
import type { ChatClient } from "@/types/ChatClient.js";
import type { ErrorMessage, RoomInfoMessage as RoomInfoMessage, TextMessage } from "@shared/types/Messages.js";

export class ChatRegistry {
  private rooms = new Map<number, Set<ChatClient>>();

  constructor(
    private roomService: RoomService,
  ) {}

  public async connectClient(roomId: number, username: string, websocket: WebSocket) {
    try {
      const room = await this.roomService.getRoomById(roomId);
      const client: ChatClient = {
        username,
        room,
        connection: websocket,
      };

      this.addToRoom(client);

      websocket.on('close', () => this.removeFromRoom(client));
      websocket.on('error', () => this.removeFromRoom(client));
      websocket.on('message', (message: Buffer) => this.handleIncomingMessage(roomId, message));
    } catch(err) {
      if (websocket.readyState === WebSocket.OPEN) {
        const errorMessage: ErrorMessage = {
          type: "error",
          payload: {
            error: err.message,
          }
        }
        websocket.send(JSON.stringify({error: err}));
        websocket.close();
      }
    }
  }

  private addToRoom(client: ChatClient) {
    const roomInfoMessage: RoomInfoMessage = {
      'type': 'room_info',
      'payload': {
        room: client.room,
      }
    }

    client.connection.send(JSON.stringify(roomInfoMessage));

    if (!this.rooms.has(client.room.id)) {
      this.rooms.set(client.room.id, new Set());
    }
    this.rooms.get(client.room.id)?.add(client);
  }

  private removeFromRoom(client: ChatClient) {
    console.log(`Connection closed/errored: roomId: ${client.room.id}, user: ${client.username}`);
    this.rooms.get(client.room.id)?.delete(client);
  }

  private handleIncomingMessage(roomId: number, message: Buffer) {
    const messageObj: TextMessage = JSON.parse(message.toString());

    console.log('Client count:', this.rooms.get(roomId)?.size);
    for (const client of this.rooms.get(roomId)!) {
      client.connection.send(JSON.stringify(messageObj));
      console.log('Message sent');
    }
  }
}


