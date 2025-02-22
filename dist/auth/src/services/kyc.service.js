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
exports.KYCService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const kyc_entity_1 = require("../domain/entities/kyc.entity");
const user_entity_1 = require("../domain/entities/user.entity");
const notification_service_1 = require("./notification.service");
const typeorm_2 = require("@nestjs/typeorm");
let KYCService = class KYCService {
    constructor(kycRepository, userRepository, notificationService) {
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    async submitDocuments(userId, documents) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const kycDocuments = documents.map(doc => {
            const kycDoc = new kyc_entity_1.KYCDocument();
            kycDoc.documentType = doc.type;
            kycDoc.documentUrl = doc.fileUrl;
            kycDoc.status = kyc_entity_1.KYCStatus.PENDING;
            kycDoc.user = user;
            return kycDoc;
        });
        await this.kycRepository.save(kycDocuments);
        await this.notificationService.notify(userId, 'Documentos KYC enviados', 'Tus documentos han sido recibidos y están en proceso de revisión.');
    }
    async verifyDocuments(documentId, verificationResult) {
        var _a;
        const document = await this.kycRepository.findOne({
            where: { id: documentId },
            relations: ['user']
        });
        if (!document) {
            throw new common_1.NotFoundException('Documento no encontrado');
        }
        document.status = verificationResult.status;
        document.verificationNotes = verificationResult.comments || '';
        await this.kycRepository.save(document);
        if (verificationResult.status === kyc_entity_1.KYCStatus.APPROVED) {
            const user = document.user;
            user.kycStatus = 'VERIFIED';
            await this.userRepository.save(user);
        }
        await this.notificationService.notify((_a = document.user) === null || _a === void 0 ? void 0 : _a.id, `Verificación KYC ${verificationResult.status}`, `Tu documento ha sido ${verificationResult.status === kyc_entity_1.KYCStatus.APPROVED ? 'aprobado' : 'rechazado'}. ${verificationResult.comments || ''}`);
    }
};
KYCService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(kyc_entity_1.KYCDocument)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, notification_service_1.NotificationService])
], KYCService);
exports.KYCService = KYCService;
//# sourceMappingURL=kyc.service.js.map