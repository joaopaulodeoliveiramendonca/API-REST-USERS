"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./utils/env");
async function start() {
    const app = await (0, app_1.buildApp)();
    try {
        await app.listen({ port: env_1.env.port, host: '0.0.0.0' });
        app.log.info(`Servidor rodando na porta ${env_1.env.port}`);
    }
    catch (error) {
        app.log.error(error, 'Erro ao iniciar servidor');
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map