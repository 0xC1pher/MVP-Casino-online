import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async notify(userId: string, title: string, message: string): Promise<void> {
    // Implementación del servicio de notificaciones
    console.log(`Notificación para ${userId}: ${title} - ${message}`);
  }
} 