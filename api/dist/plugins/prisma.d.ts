import { PrismaClient } from '../../src/generated/prisma';
declare const _default: (fastify: import("fastify").FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>) => Promise<void>;
export default _default;
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
//# sourceMappingURL=prisma.d.ts.map