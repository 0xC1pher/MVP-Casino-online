import { NestMiddleware, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
export declare class AuthMiddleware implements NestMiddleware {
    private jwtService;
    private redisClient;
    private readonly logger;
    userService: any;
    activityRepository: any;
    constructor(jwtService: JwtService, redisClient: any, logger: Logger);
    use(req: Request, res: Response, next: Function): Promise<void>;
    private extractTokenFromHeader;
    private validatePermissions;
    private logActivity;
    private sanitizeRequestBody;
    private requiresKYC;
    private checkRolePermissions;
}
