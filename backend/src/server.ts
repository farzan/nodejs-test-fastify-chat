import Fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import routes from './routes/routes.js';
import { InMemoryRoomRepository } from './repositories/room.repository.memory.js';
import { createRoomService } from './services/room.service.js';
import { ChatRegistry } from './services/chat.registry.js';
import EventEmitter from 'events';

const fastify = Fastify({
  logger: true,
});
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const __path = dirname(fileURLToPath(import.meta.url));
await fastify.register(fastifyStatic, {
  root: join(__path, '../../frondend/dist'),
});
await fastify.register(fastifyWebsocket);
await fastify.register(routes);

// Decorators:
const eventBus = new EventEmitter();
fastify.decorate('eventBus', eventBus);

const roomRepository = new InMemoryRoomRepository();
const roomService = createRoomService({
  roomRepository,
  eventBus,
});
fastify.decorate('roomService', roomService);

const chatRegistry = new ChatRegistry(roomService);
fastify.decorate('chatRegistry', chatRegistry);




// @TODO: how to enable default page?
// await fastify.get('/*', (_, reply) => {
//   reply.sendFile('index.html')
// })

try {
  fastify.listen({port: 3000});
} catch(err) {
    fastify.log.error(err);
    process.exit(1);
}