import type { FastifyReply, FastifyInstance } from 'fastify';
import RoomRoutes from '@/routes/rooms.js';

export default async function(fastify: FastifyInstance) {
  await fastify.register(RoomRoutes);

  fastify.get('/', await function (_, reply: FastifyReply) {
    reply.sendFile('index.html');
  });
}