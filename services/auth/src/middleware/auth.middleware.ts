import { Injectable, NestMiddleware, Inject, Logger, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { KYCStatus, UserRole } from "../domain/entities/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  userService: any;
    activityRepository: any;
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redisClient: any,
    private readonly logger: Logger
  ) {}

  async use(req: Request, res: Response, next: Function) {
    try {
      // 1. Extraer y validar token
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException('Token no proporcionado');
      }
      // 2. Verificar token JWT
      const payload = await this.jwtService.verify(token);
      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      // 3. Verificar sesión activa en Redis
      const sessionKey = `session:${payload.userId}`;
      const sessionExists = await this.redisClient.get(sessionKey);
      if (!sessionExists) {
        throw new UnauthorizedException('Sesión expirada');
      }
      // 4. Verificar permisos
      const userPermissions = await this.validatePermissions(payload.userId, req.url, req.method);
      if (!userPermissions.isAllowed) {
        throw new ForbiddenException(userPermissions.message);
      }

      // 5. Registrar actividad
      await this.logActivity(payload.userId, req);
      // 6. Adjuntar información del usuario a la request
      (req as any).user = payload;
      next();
    } catch (error) {
      this.logger.error(`Auth Middleware Error: ${error.message}`, error.stack);
      throw error;
    }
  }
  private extractTokenFromHeader(req: Request): string | null {
    const [type, token] = (req.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private async validatePermissions(
    userId: string, 
    path: string, 
    method: string
  ): Promise<{ isAllowed: boolean; message: string }> {
    const user = await this.userService.findById(userId);
    
    // Verificar si el usuario está activo
    if (user.status !== 'ACTIVE') {
      return { 
        isAllowed: false, 
        message: 'Usuario no activo' 
      };
    }

    // Verificar KYC para rutas que lo requieren
    if (this.requiresKYC(path) && user.kycStatus !== KYCStatus.APPROVED) {
      return { 
        isAllowed: false, 
        message: 'Se requiere verificación KYC' 
      };
    }

    // Verificar permisos específicos por rol
    const hasPermission = await this.checkRolePermissions(user.role, path, method);
    if (!hasPermission) {
      return { 
        isAllowed: false, 
        message: 'Permisos insuficientes' 
      };
    }

    return { isAllowed: true, message: 'OK' };
  }

  private async logActivity(userId: string, req: Request): Promise<void> {
    const activity = {
      userId,
      timestamp: new Date(),
      ip: (req as any).ip,
      userAgent: (req.headers as any)['user-agent'],
      path: (req as any).path,
      method: (req as any).method,
      query: (req as any).query,
      body: this.sanitizeRequestBody(req.body)
    };

    await this.activityRepository.save(activity);
  }

  private sanitizeRequestBody(body: any): any {
    const sensitiveFields = ['password', 'token', 'creditCard'];
    const sanitized = { ...body };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });
    
    return sanitized;
  }

  private requiresKYC(path: string): boolean {
    const kycRequiredPaths = [
      '/api/transaction/withdraw',
      '/api/transaction/deposit',
      '/api/game/bet'
    ];
    return kycRequiredPaths.some(p => path.startsWith(p));
  }

  private async checkRolePermissions(
    role: UserRole, 
    path: string, 
    method: string
  ): Promise<boolean> {
    const permissions = {
      [UserRole.PLAYER]: {
        allowed: [
          { path: '/api/game', methods: ['GET', 'POST'] },
          { path: '/api/transaction', methods: ['GET', 'POST'] },
          { path: '/api/profile', methods: ['GET', 'PUT'] }
        ]
      },
      [UserRole.VIP]: {
        allowed: [
          { path: '/api/game', methods: ['GET', 'POST'] },
          { path: '/api/transaction', methods: ['GET', 'POST'] },
          { path: '/api/profile', methods: ['GET', 'PUT'] },
          { path: '/api/vip', methods: ['GET'] }
        ]
      },
      [UserRole.ADMIN]: {
        allowed: ['*']
      }
    };

    if (role === UserRole.ADMIN) return true;

    if (role === UserRole.SUPPORT) return false;

    return permissions[role].allowed.some((permission: {path: string, methods: string[]}) => 
      path.startsWith(permission.path) && 
      permission.methods.includes(method)
    );
  }
} 