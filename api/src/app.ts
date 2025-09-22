import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import prismaPlugin from './plugins/prisma';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { env } from './utils/env';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(prismaPlugin);
  await app.register(jwt, { secret: env.jwtSecret });
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.decorate(
    'authenticate',
    async function authenticate(request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error) {
        request.log.warn({ error }, 'Token inválido.');
        return reply.status(401).send({ message: 'Token inválido.' });
      }
    },
  );

  await app.register(authRoutes);
  await app.register(userRoutes);

  return app;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
