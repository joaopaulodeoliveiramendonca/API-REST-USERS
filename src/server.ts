import { buildApp } from './app';
import { env } from './utils/env';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Servidor rodando na porta ${env.port}`);
  } catch (error) {
    app.log.error(error, 'Erro ao iniciar servidor');
    process.exit(1);
  }
}

start();
