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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../domain/entities/user.entity");
let AuthMiddleware = class AuthMiddleware {
    constructor(jwtService, redisClient, logger) {
        this.jwtService = jwtService;
        this.redisClient = redisClient;
        this.logger = logger;
    }
    async use(req, res, next) {
        try {
            const token = this.extractTokenFromHeader(req);
            if (!token) {
                throw new common_1.UnauthorizedException('Token no proporcionado');
            }
            const payload = await this.jwtService.verify(token);
            if (!payload) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            const sessionKey = `session:${payload.userId}`;
            const sessionExists = await this.redisClient.get(sessionKey);
            if (!sessionExists) {
                throw new common_1.UnauthorizedException('Sesión expirada');
            }
            const userPermissions = await this.validatePermissions(payload.userId, req.url, req.method);
            if (!userPermissions.isAllowed) {
                throw new common_1.ForbiddenException(userPermissions.message);
            }
            await this.logActivity(payload.userId, req);
            req.user = payload;
            next();
        }
        catch (error) {
            this.logger.error(`Auth Middleware Error: ${error.message}`, error.stack);
            throw error;
        }
    }
    extractTokenFromHeader(req) {
        var _a, _b;
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return type === 'Bearer' ? token : null;
    }
    async validatePermissions(userId, path, method) {
        const user = await this.userService.findById(userId);
        if (user.status !== 'ACTIVE') {
            return {
                isAllowed: false,
                message: 'Usuario no activo'
            };
        }
        if (this.requiresKYC(path) && user.kycStatus !== user_entity_1.KYCStatus.APPROVED) {
            return {
                isAllowed: false,
                message: 'Se requiere verificación KYC'
            };
        }
        const hasPermission = await this.checkRolePermissions(user.role, path, method);
        if (!hasPermission) {
            return {
                isAllowed: false,
                message: 'Permisos insuficientes'
            };
        }
        return { isAllowed: true, message: 'OK' };
    }
    async logActivity(userId, req) {
        const activity = {
            userId,
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            path: req.path,
            method: req.method,
            query: req.query,
            body: this.sanitizeRequestBody(req.body)
        };
        await this.activityRepository.save(activity);
    }
    sanitizeRequestBody(body) {
        const sensitiveFields = ['password', 'token', 'creditCard'];
        const sanitized = Object.assign({}, body);
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        });
        return sanitized;
    }
    requiresKYC(path) {
        const kycRequiredPaths = [
            '/api/transaction/withdraw',
            '/api/transaction/deposit',
            '/api/game/bet'
        ];
        return kycRequiredPaths.some(p => path.startsWith(p));
    }
    async checkRolePermissions(role, path, method) {
        const permissions = {
            [user_entity_1.UserRole.PLAYER]: {
                allowed: [
                    { path: '/api/game', methods: ['GET', 'POST'] },
                    { path: '/api/transaction', methods: ['GET', 'POST'] },
                    { path: '/api/profile', methods: ['GET', 'PUT'] }
                ]
            },
            [user_entity_1.UserRole.VIP]: {
                allowed: [
                    { path: '/api/game', methods: ['GET', 'POST'] },
                    { path: '/api/transaction', methods: ['GET', 'POST'] },
                    { path: '/api/profile', methods: ['GET', 'PUT'] },
                    { path: '/api/vip', methods: ['GET'] }
                ]
            },
            [user_entity_1.UserRole.ADMIN]: {
                allowed: ['*']
            }
        };
        if (role === user_entity_1.UserRole.ADMIN)
            return true;
        if (role === user_entity_1.UserRole.SUPPORT)
            return false;
        return permissions[role].allowed.some((permission) => path.startsWith(permission.path) &&
            permission.methods.includes(method));
    }
};
AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, common_1.Logger])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map