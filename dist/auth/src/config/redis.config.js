"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
exports.redisConfig = {
    host: (_a = process.env.REDIS_HOST) !== null && _a !== void 0 ? _a : 'localhost',
    port: parseInt((_b = process.env.REDIS_PORT) !== null && _b !== void 0 ? _b : '6379'),
    password: (_c = process.env.REDIS_PASSWORD) !== null && _c !== void 0 ? _c : '',
    db: parseInt((_d = process.env.REDIS_DB) !== null && _d !== void 0 ? _d : '0')
};
//# sourceMappingURL=redis.config.js.map