export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    kycStatus: KYCStatus;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled: boolean;
    securityQuestions: any[];
    name: string;
}
export declare enum KYCStatus {
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum UserRole {
    PLAYER = "PLAYER",
    VIP = "VIP",
    ADMIN = "ADMIN",
    SUPPORT = "SUPPORT"
}
