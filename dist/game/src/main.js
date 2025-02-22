"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const game_module_1 = require("./game.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(game_module_1.GameModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: process.env.GAME_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.GAME_SERVICE_PORT) || 3001,
        },
    });
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map