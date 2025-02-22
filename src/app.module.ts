import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { GameModule } from "./game/game.module";
import { NotificationModule } from "./notification/notification.module";
import { TransactionModule } from "./transaction/transaction.module";
import { HealthModule } from "./health/health.module";
import { LoggerModule } from "./logger/logger.module";
import { DatabaseModule } from "./database/database.module";
import { FileUploadModule } from "./file-upload/file-upload.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`
    }),
    AuthModule,
    UsersModule,
    GameModule,
    NotificationModule,
    TransactionModule,
    HealthModule,
    LoggerModule, // Nuevo módulo de registro
    DatabaseModule, // Nuevo módulo de base de datos
    FileUploadModule, // Nuevo módulo para subir archivos
    ClientsModule.registerAsync([
      {
        name: "GAME_SERVICE",
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("GAME_SERVICE_HOST", "localhost"),
            port: config.get<number>("GAME_SERVICE_PORT", 3001)
          }
        }),
        inject: [ConfigService]
      },
      {
        name: "AUTH_SERVICE",
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("AUTH_SERVICE_HOST", "localhost"),
            port: config.get<number>("AUTH_SERVICE_PORT", 3002)
          }
        }),
        inject: [ConfigService]
      },
      {
        name: "NOTIFICATION_SERVICE",
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("NOTIFICATION_SERVICE_HOST", "localhost"),
            port: config.get<number>("NOTIFICATION_SERVICE_PORT", 3003)
          }
        }),
        inject: [ConfigService]
      },
      {
        name: "TRANSACTION_SERVICE",
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("TRANSACTION_SERVICE_HOST", "localhost"),
            port: config.get<number>("TRANSACTION_SERVICE_PORT", 3004)
          }
        }),
        inject: [ConfigService]
      },
      {
        name: "SEARCH_SERVICE",
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("SEARCH_SERVICE_HOST", "localhost"),
            port: config.get<number>("SEARCH_SERVICE_PORT", 3005)
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
