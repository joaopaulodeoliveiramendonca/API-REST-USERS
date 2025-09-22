"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('prisma', prisma);
    fastify.addHook('onClose', async () => {
        await fastify.prisma.$disconnect();
    });
});
//# sourceMappingURL=prisma.js.map