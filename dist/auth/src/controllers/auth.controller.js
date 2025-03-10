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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("../domain/entities/user.entity");
const auth_dto_1 = require("../dto/auth.dto");
const auth_service_1 = require("../services/auth.service");
const kyc_service_1 = require("../services/kyc.service");
let AuthController = class AuthController {
    constructor(authService, kycService) {
        this.authService = authService;
        this.kycService = kycService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyTwoFactor(user, twoFactorDto) {
        return this.authService.validateTwoFactor(user.id, twoFactorDto.code);
    }
    async logout(user) {
        return this.authService.logout(user.id);
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.UseGuards)(passport_1.AuthGuard),
    __param(0, (0, user_entity_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactor", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(passport_1.AuthGuard),
    __param(0, (0, user_entity_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof UserDecorator !== "undefined" && UserDecorator) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        kyc_service_1.KYCService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map