import { WebSocket } from 'ws';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { ChatClient } from '../types/ChatClient.js';
import type { TextMessage, RoomInfo } from '@shared/types/Messages.js';
import { createRoom, getRoomById, getRooms } from '@/Rooms.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export default function(fastify: FastifyInstance) {
  fastify.get('/rooms', function getRoomList() {
    return getRooms();
  });

  interface PostRoomRoute {
    Body: {
      title: string,
    }
  }

  fastify.withTypeProvider<ZodTypeProvider>().post<PostRoomRoute>(
    '/room',
    {
      schema: {
        body: z.object({
          title: z.string(),
        })
      }
    },
    async function postRoom(request: FastifyRequest,reply: FastifyReply) {
      const { title } = request.body as { title: string };
      const room = createRoom(title);

      return room;
    }
  );

  const rooms = new Map<number, Set<ChatClient>>();
  interface GetRoomRoute {
    Params: {roomId: number};
  }
  // @TODO use zod
  const schema = {
    params: {
      type: 'object',
      properties: {
        roomId: {type: 'integer'}
      },
      required: ['roomId'],
    }
  };
  fastify.get<GetRoomRoute>(
    '/room/:roomId',
    {
      websocket: true,
      schema,
    },
    async function (websocket: WebSocket, request: FastifyRequest<GetRoomRoute>) {
      console.log(request.query);

      websocket.addEventListener('error', (err) => {
        console.log('Error: ', err);
      })

      websocket.addEventListener('close', e => {
        console.log('closed');
      })

      // #TODO Read name from session
      const { roomId } = request.params;
      const { name } = request.query as { name: string };

      const room = getRoomById(roomId);
      const client: ChatClient = {
        username: name,
        room,
        connection: websocket,
      }

      const roomInfo: RoomInfo = {
        'type': 'room_info',
        'payload': {
          'room': room,
        }
      }
      client.connection.send(JSON.stringify(roomInfo));

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId)?.add(client);

      function wsCleanUp() {
        console.log(`Connection closed/errored: roomId: ${roomId}, user: ${client.username}`);
        rooms.get(roomId)?.delete(client);
      }
      websocket.on('close', wsCleanUp);
      websocket.on('message', (message: Buffer) => {
          const messageObj: TextMessage = JSON.parse(message.toString());

          console.log('Client count:', rooms.get(roomId)?.size);

          for (const client of rooms.get(roomId)!) {
              client.connection.send(JSON.stringify(messageObj));
              console.log('Message sent');
          }
      });
    }
  );
}