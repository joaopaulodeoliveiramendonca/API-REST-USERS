"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url('DATABASE_URL deve ser uma URL válida.'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET é obrigatório.'),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().int().positive().default(10),
    PORT: zod_1.z.coerce.number().int().positive().default(3333),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Erro ao validar variáveis de ambiente:', parsed.error.flatten().fieldErrors);
    throw new Error('Variáveis de ambiente inválidas.');
}
exports.env = {
    databaseUrl: parsed.data.DATABASE_URL,
    jwtSecret: parsed.data.JWT_SECRET,
    saltRounds: parsed.data.BCRYPT_SALT_ROUNDS,
    port: parsed.data.PORT,
};
//# sourceMappingURL=env.js.map