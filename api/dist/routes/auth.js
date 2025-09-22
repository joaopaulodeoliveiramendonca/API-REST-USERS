"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const bcryptjs_1 = require("bcryptjs");
const auth_1 = require("../schemas/auth");
async function authRoutes(fastify) {
    fastify.post('/login', async (request, reply) => {
        const credentials = auth_1.loginSchema.parse(request.body);
        const user = await fastify.prisma.user.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            return reply.status(401).send({ message: 'Credenciais inválidas.' });
        }
        const passwordMatches = await (0, bcryptjs_1.compare)(credentials.password, user.passwordHash);
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
//# sourceMappingURL=auth.js.map