import { User } from './user.entity';
export declare enum DocumentType {
    ID = "ID",
    PASSPORT = "PASSPORT",
    DRIVERS_LICENSE = "DRIVERS_LICENSE"
}
export declare enum KYCStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class KYCDocument {
    id: string;
    documentType: DocumentType;
    documentUrl: string;
    status: KYCStatus;
    verificationNotes: string;
    user: User;
}
