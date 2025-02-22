"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const config_1 = require("@nestjs/config");
let SessionService = class SessionService {
    constructor(redisClient, configService) {
        this.redisClient = redisClient;
        this.configService = configService;
    }
    async createSession(userId, metadata) {
        const sessionId = uuidv4();
        const sessionKey = `session:${userId}`;
        const sessionData = Object.assign({ id: sessionId, userId, createdAt: new Date() }, metadata);
        await this.redisClient.setex(sessionKey, this.configService.get('SESSION_TTL'), JSON.stringify(sessionData));
        return sessionId.toString();
    }
    async validateSession(userId, sessionId) {
        const sessionKey = `session:${userId}`;
        const sessionData = await this.redisClient.get(sessionKey);
        if (!sessionData)
            return false;
        const session = JSON.parse(sessionData);
        return session.id === sessionId;
    }
    async invalidateSession(userId) {
        const sessionKey = `session:${userId}`;
        await this.redisClient.del(sessionKey);
    }
    async refreshSession(userId) {
        const sessionKey = `session:${userId}`;
        await this.redisClient.expire(sessionKey, this.configService.get('SESSION_TTL'));
    }
};
SessionService = __decorate([
    Injectable(),
    __param(0, Inject('REDIS_CLIENT')),
    __metadata("design:paramtypes", [typeof (_a = typeof Redis !== "undefined" && Redis.Redis) === "function" ? _a : Object, config_1.ConfigService])
], SessionService);
exports.SessionService = SessionService;
function Injectable() {
    throw new Error("Function not implemented.");
}
function Inject(arg0) {
    throw new Error("Function not implemented.");
}
function uuidv4() {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=session.service.js.map