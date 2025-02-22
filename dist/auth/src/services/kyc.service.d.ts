import { Repository } from "typeorm";
import { KYCDocument, KYCStatus } from "../domain/entities/kyc.entity";
import { User } from "../domain/entities/user.entity";
import { NotificationService } from "./notification.service";
import { KYCDocumentDto } from "../domain/dto/kyc.dto";
export interface VerificationResult {
    isValid: boolean;
    status: KYCStatus;
    comments?: string;
}
export declare class KYCService {
    private kycRepository;
    private userRepository;
    private notificationService;
    constructor(kycRepository: Repository<KYCDocument>, userRepository: Repository<User>, notificationService: NotificationService);
    submitDocuments(userId: string, documents: KYCDocumentDto[]): Promise<void>;
    verifyDocuments(documentId: string, verificationResult: VerificationResult): Promise<void>;
}
