export class User {
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
  securityQuestions: any[]; // Changed SecurityQuestion to any since type is not defined
  name: string; // Changed any to string since name should be a string
}

export enum KYCStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  PLAYER = 'PLAYER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT'
} 