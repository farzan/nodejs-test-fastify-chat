import Fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';

import wsManager from './routes.js';

const fastify = Fastify({
  logger: true,
});

const __path = dirname(fileURLToPath(import.meta.url));

await fastify.register(fastifyStatic, { root: join(__path, 'views') });
await fastify.register(fastifyWebsocket);
await fastify.register(wsManager);

try {
  fastify.listen({port: 3000});
} catch(err) {
    fastify.log.error(err);
    process.exit(1);
}