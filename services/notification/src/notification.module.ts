import { Module } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Module({
  providers: [
    {
      provide: 'NotificationService',
      useClass: WebSocketNotificationService,
    },
  ],
  exports: ['NotificationService'],
})
export class NotificationModule {
  @WebSocketServer()
  server: Server;
}