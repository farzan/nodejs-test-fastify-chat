import { WebSocket } from 'ws';
import type { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify';

export default function(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/', function (request: FastifyRequest, reply: FastifyReply) {
    reply.sendFile('index.html');
  });

  fastify.get('/chatroom', function (request: FastifyRequest, reply: FastifyReply) {
    reply.sendFile('chatroom.html');
  });

  const clients = new Set<WebSocket>();
  fastify.get('/ws', { websocket: true }, function (websocket: WebSocket, request: FastifyRequest) {
    clients.add(websocket);
    websocket.on('message', (message: Buffer) => {
        const payload = JSON.parse(message.toString());

        for (const client of clients) {
          client.send(JSON.stringify(payload));
        }
    });
  });
}