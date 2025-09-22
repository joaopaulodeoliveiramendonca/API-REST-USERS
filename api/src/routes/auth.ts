import { FastifyInstance } from 'fastify';
import { compare } from 'bcryptjs';
import { loginSchema } from '../schemas/auth';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    const credentials = loginSchema.parse(request.body);

    const user = await fastify.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const passwordMatches = await compare(
      credentials.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
    });

    return reply.send({ token });
  });
}
