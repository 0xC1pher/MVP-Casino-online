import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from "typeorm";
import { KYCDocument, DocumentType, KYCStatus } from "../domain/entities/kyc.entity";
import { User } from "../domain/entities/user.entity";
import { NotificationService } from "./notification.service";
import { KYCDocumentDto } from "../domain/dto/kyc.dto";
import { InjectRepository } from '@nestjs/typeorm';

export interface VerificationResult {
  isValid: boolean;
  status: KYCStatus;
  comments?: string;
}

@Injectable()
export class KYCService {
  constructor(
    @InjectRepository(KYCDocument)
    private kycRepository: Repository<KYCDocument>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService
  ) {}

  async submitDocuments(userId: string, documents: KYCDocumentDto[]): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const kycDocuments = documents.map(doc => {
      const kycDoc = new KYCDocument();
      kycDoc.documentType = doc.type as DocumentType;
      kycDoc.documentUrl = doc.fileUrl;
      kycDoc.status = KYCStatus.PENDING;
      kycDoc.user = user;
      return kycDoc;
    });

    await this.kycRepository.save(kycDocuments);
    await this.notificationService.notify(
      userId,
      'Documentos KYC enviados',
      'Tus documentos han sido recibidos y están en proceso de revisión.'
    );
  }

  async verifyDocuments(documentId: string, verificationResult: VerificationResult): Promise<void> {
    const document = await this.kycRepository.findOne({ 
      where: { id: documentId },
      relations: ['user']
    });
    
    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }
    document.status = verificationResult.status;
    document.verificationNotes = verificationResult.comments || '';
    await this.kycRepository.save(document);

    if (verificationResult.status === KYCStatus.APPROVED) {
      const user = document.user;
      user.kycStatus = 'VERIFIED';
      await this.userRepository.save(user);
    }
    await this.notificationService.notify(
      document.user?.id,
      `Verificación KYC ${verificationResult.status}`,
      `Tu documento ha sido ${verificationResult.status === KYCStatus.APPROVED ? 'aprobado' : 'rechazado'}. ${verificationResult.comments || ''}`
    );
  }
} 