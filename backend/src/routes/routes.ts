import type { FastifyReply, FastifyInstance } from 'fastify';
import RoomRoutes from '@/routes/rooms.route.js';
import type { WebSocket } from 'ws';

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
      // @TODO
    }
  );
}