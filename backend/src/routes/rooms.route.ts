import { WebSocket } from 'ws';
import type { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import type { Error } from '@shared/types/Messages.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { toError } from '@/helpers.js';
import { RoomAlreadyExistsError } from '@/repositories/room.repository.js';

export default function(fastify: FastifyInstance) {
  fastify.get('/rooms', async function getRoomList() {
    return await fastify.roomService.getRooms();
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
    async function postRoom(request: FastifyRequest, reply: FastifyReply) {
      try {
        const { title } = request.body as { title: string };
        const room = await fastify.roomService.createRoom(title);

        return room;
      } catch (err) {
        if (err instanceof RoomAlreadyExistsError) {
          return reply.status(409).send({error: err.message});
        }
      }
    }
  );

  interface GetRoomRoute {
    Params: {roomId: number};
  }
  fastify.get<GetRoomRoute>(
    '/room/:roomId',
    {
      websocket: true,
      schema: {
        params: z.object({
          roomId: z.coerce.number(),
        })
      },
    },
    async function (websocket: WebSocket, request: FastifyRequest<GetRoomRoute>) {
      try {
        console.log(request.query);

        const { roomId } = request.params;
        const { name } = request.query as { name: string };

        fastify.chatRegistry.connectClient(roomId, name, websocket);
      } catch (err) {
        if (websocket.readyState === WebSocket.OPEN) {
          const errorMessage: Error = {
            type: 'error',
            payload: {
              error: toError(err).message,
            }
          }
          websocket.send(JSON.stringify(errorMessage));
          websocket.close();
        }
      }
    }
  );
}