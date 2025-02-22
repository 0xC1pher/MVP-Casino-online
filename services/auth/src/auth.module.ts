// auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "@users/users.module";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { KYCService } from './services/kyc.service';
import { KYCDocument } from './domain/entities/kyc.entity';
import { User } from './domain/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importar ConfigModule aquí
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"), // Usar ConfigService para obtener el secreto
        signOptions: { expiresIn: "1h" }
      }),
      inject: [ConfigService] // Inyectar ConfigService
    }),
    UsersModule,
    TypeOrmModule.forFeature([KYCDocument, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, KYCService],
  exports: [AuthService]
})
export class AuthModule {}
