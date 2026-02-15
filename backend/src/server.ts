import Fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import routes from './routes/routes.js';

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