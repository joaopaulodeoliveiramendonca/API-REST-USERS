import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório.'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  PORT: z.coerce.number().int().positive().default(3333),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Erro ao validar variáveis de ambiente:', parsed.error.flatten().fieldErrors);
  throw new Error('Variáveis de ambiente inválidas.');
}

export const env = {
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  saltRounds: parsed.data.BCRYPT_SALT_ROUNDS,
  port: parsed.data.PORT,
};
