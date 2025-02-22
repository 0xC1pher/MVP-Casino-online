import { Injectable, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../domain/entities/user.entity";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { KYCService } from "./kyc.service";
import { hash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, 
    private kycService: KYCService,
    @Inject('REDIS_CLIENT') private redisClient: Redis
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // Validar datos
    if (!registerDto.email || !registerDto.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Verificar duplicados
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new Error('El usuario ya existe');
    }
    // Encriptar contraseña
    const hashedPassword = await hash('sha256', registerDto.password);

    // Crear usuario
    const user = new User();
    user.email = registerDto.email;
    user.password = hashedPassword;
    user.name = registerDto.name;

    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<Response> {
    // Validación de credenciales
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await hash('sha256', loginDto.password) === user.password;
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generación de tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Registro de sesión
    await this.redisClient.set(`session:${user.id}`, accessToken);
    return {
      token: accessToken,
      user
    };
  }

  async validateTwoFactor(userId: string, code: string): Promise<boolean> {
    // Validación de código 2FA
    return false; // Temporary return to fix lint error
  }

  async refreshToken(token: string): Promise<Response> {
    // Renovación de tokens
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findOne({
      where: { id: decoded.sub }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    await this.redisClient.set(`session:${user.id}`, accessToken);
    return {
      token: accessToken, // Cambiado a 'token' para mantener consistencia con el método login
      user
    };
  }

  async logout(userId: string): Promise<void> {
    // Invalidación de sesión
  }
}

function InjectRepository(entity: any): (target: any, propertyKey: string | undefined, parameterIndex: number) => void {
    throw new Error("Function not implemented.");
}
