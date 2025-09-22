"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const bcryptjs_1 = require("bcryptjs");
const user_1 = require("../schemas/user");
const env_1 = require("../utils/env");
const toResponse = (user) => user_1.userResponseSchema.parse({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
});
async function userRoutes(fastify) {
    fastify.post('/users', async (request, reply) => {
        const data = user_1.userCreateSchema.parse(request.body);
        const existing = await fastify.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            return reply.status(409).send({ message: 'Email já cadastrado.' });
        }
        const passwordHash = await (0, bcryptjs_1.hash)(data.password, env_1.env.saltRounds);
        const user = await fastify.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
        });
        return reply.status(201).send({ user: toResponse(user) });
    });
    fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const users = await fastify.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return reply.send({ users: users.map(toResponse) });
    });
    fastify.get('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const params = user_1.userIdParamSchema.parse(request.params);
        if (request.user.sub !== params.id) {
            return reply.status(403).send({ message: 'Acesso negado.' });
        }
        const user = await fastify.prisma.user.findUnique({
            where: { id: params.id },
        });
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado.' });
        }
        return reply.send({ user: toResponse(user) });
    });
    fastify.put('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const params = user_1.userIdParamSchema.parse(request.params);
        const data = user_1.userUpdateSchema.parse(request.body);
        if (request.user.sub !== params.id) {
            return reply.status(403).send({ message: 'Acesso negado.' });
        }
        const userExists = await fastify.prisma.user.findUnique({
            where: { id: params.id },
        });
        if (!userExists) {
            return reply.status(404).send({ message: 'Usuário não encontrado.' });
        }
        if (data.email && data.email !== userExists.email) {
            const emailInUse = await fastify.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (emailInUse) {
                return reply.status(409).send({ message: 'Email já cadastrado.' });
            }
        }
        const updated = await fastify.prisma.user.update({
            where: { id: params.id },
            data: {
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                passwordHash: data.password
                    ? await (0, bcryptjs_1.hash)(data.password, env_1.env.saltRounds)
                    : undefined,
            },
        });
        return reply.send({ user: toResponse(updated) });
    });
    fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const params = user_1.userIdParamSchema.parse(request.params);
        if (request.user.sub !== params.id) {
            return reply.status(403).send({ message: 'Acesso negado.' });
        }
        await fastify.prisma.user.delete({
            where: { id: params.id },
        });
        return reply.status(204).send();
    });
}
//# sourceMappingURL=users.js.map