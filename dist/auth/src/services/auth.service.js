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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../domain/entities/user.entity");
const kyc_service_1 = require("./kyc.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, kycService, redisClient) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.kycService = kycService;
        this.redisClient = redisClient;
    }
    async register(registerDto) {
        if (!registerDto.email || !registerDto.password) {
            throw new Error('Email y contraseña son requeridos');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email }
        });
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        const hashedPassword = await (0, crypto_1.hash)('sha256', registerDto.password);
        const user = new user_entity_1.User();
        user.email = registerDto.email;
        user.password = hashedPassword;
        user.name = registerDto.name;
        return await this.userRepository.save(user);
    }
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        const isPasswordValid = await (0, crypto_1.hash)('sha256', loginDto.password) === user.password;
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        await this.redisClient.set(`session:${user.id}`, accessToken);
        return {
            token: accessToken,
            user
        };
    }
    async validateTwoFactor(userId, code) {
        return false;
    }
    async refreshToken(token) {
        const decoded = this.jwtService.verify(token);
        const user = await this.userRepository.findOne({
            where: { id: decoded.sub }
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        await this.redisClient.set(`session:${user.id}`, accessToken);
        return {
            token: accessToken,
            user
        };
    }
    async logout(userId) {
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, InjectRepository(user_entity_1.User)),
    __param(3, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object, jwt_1.JwtService,
        kyc_service_1.KYCService, typeof (_b = typeof Redis !== "undefined" && Redis) === "function" ? _b : Object])
], AuthService);
exports.AuthService = AuthService;
function InjectRepository(entity) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=auth.service.js.map