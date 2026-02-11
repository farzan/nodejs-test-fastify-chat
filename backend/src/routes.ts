import { WebSocket } from 'ws';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { ChatClient } from './types/ChatClient.js';
import type { Message } from '@shared/types/Messages.js';

export default function(fastify: FastifyInstance) {
  fastify.get('/', function (_, reply: FastifyReply) {
    reply.sendFile('index.html');
  });

  fastify.get('/chatroom', function (_, reply: FastifyReply) {
    reply.sendFile('chatroom.html');
  });

  const clients = new Set<ChatClient>();
  fastify.get('/ws', { websocket: true }, function (websocket: WebSocket, request: FastifyRequest) {
    console.log(request.query);

    // #TODO Read name from session
    const query = request.query as { name: string };
    const name = query.name;
    const client: ChatClient = {
      name,
      connection: websocket,
    }

    clients.add(client);
    websocket.on('message', (message: Buffer) => {
        const messageObj: Message = JSON.parse(message.toString());

        for (const client of clients) {
          client.connection.send(JSON.stringify(messageObj));
        }
    });
  });
}