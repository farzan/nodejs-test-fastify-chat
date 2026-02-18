import type { FastifyReply, FastifyInstance } from 'fastify';
import RoomRoutes from '@/routes/rooms.route.js';
import type { WebSocket } from 'ws';
import * as events from "@/types/events.js";
import type { NewRoomMessage } from '@shared/types/Messages.js';
import type { Room } from '@shared/types/Room.js';

export default async function(fastify: FastifyInstance) {
  await fastify.register(RoomRoutes);

  fastify.get('/', await function (_, reply: FastifyReply) {
    reply.sendFile('index.html');
  });

  fastify.get(
    '/home/events',
    {
      websocket: true,
    },
    async function homeEventsWS(websocket: WebSocket) {
      const onNewRoomCallback = (room: Room) => {
        const newRoomMessage: NewRoomMessage = {
          type: 'new_room',
          payload: {
            room,
          }
        }

        websocket.send(JSON.stringify(newRoomMessage));
        console.log('New room message sent');

      };
      fastify.eventBus.on(events.ROOM_CREATED, onNewRoomCallback);

      const offCallback = () => {
        console.log('Removing new room callback');

        fastify.eventBus.off(events.ROOM_CREATED, onNewRoomCallback);
      }
      websocket.on('close', offCallback);
      websocket.on('error', offCallback);
    }
  );
}