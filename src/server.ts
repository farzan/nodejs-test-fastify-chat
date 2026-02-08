import Fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws'

const fastify = Fastify({
  logger: true,
});

const __file = fileURLToPath(import.meta.url);
const __path = dirname(__file);

fastify.register(fastifyStatic, {
  root: join(__path, 'views'),
});
await fastify.register(fastifyWebsocket);

fastify.get('/', (request, reply) => {
  reply.sendFile('index.html');
});

fastify.get('/chatroom', (request, reply) => {
  reply.sendFile('chatroom.html');
});

const clients = new Set<WebSocket>();
fastify.get('/ws', { websocket: true }, (websocket, request) => {
  // console.log(websocket);

  clients.add(websocket);
  websocket.on('message', (message: Buffer) => {
      const payload = JSON.parse(message.toString());

      for (const client of clients) {
        client.send(JSON.stringify(payload));
      }
  });
  // websocket.addEventListener('message', (event) => {
  //   console.log('message received:', event.data);
  // });
});

try {
  fastify.listen({port: 3000});
} catch(err) {
    fastify.log.error(err);
    process.exit(1);
}