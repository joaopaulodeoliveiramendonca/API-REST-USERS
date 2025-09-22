"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
const env_1 = require("./utils/env");
async function buildApp() {
    const app = (0, fastify_1.default)({ logger: true });
    await app.register(prisma_1.default);
    await app.register(jwt_1.default, { secret: env_1.env.jwtSecret });
    app.decorate('authenticate', async function authenticate(request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (error) {
            request.log.warn({ error }, 'Token inválido.');
            return reply.status(401).send({ message: 'Token inválido.' });
        }
    });
    await app.register(auth_1.authRoutes);
    await app.register(users_1.userRoutes);
    return app;
}
//# sourceMappingURL=app.js.map