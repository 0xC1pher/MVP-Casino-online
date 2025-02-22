"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const transaction_module_1 = require("./transaction.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(transaction_module_1.TransactionModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: process.env.TRANSACTION_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.TRANSACTION_SERVICE_PORT) || 3004,
        },
    });
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map