import { ConfigService } from "@nestjs/config";
import { SessionMetadata } from "../interfaces/session.interface";

@Injectable()
export class SessionService {
  constructor(
    @Inject('REDIS_CLIENT') private redisClient: Redis.Redis,
    private configService: ConfigService
  ) {}

  async createSession(userId: string, metadata: SessionMetadata): Promise<string> {
    const sessionId = uuidv4();
    const sessionKey = `session:${userId}`;
    const sessionData = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      ...metadata
    };

    await this.redisClient.setex(
      sessionKey,
      this.configService.get('SESSION_TTL'),
      JSON.stringify(sessionData)
    );

    return sessionId.toString();
  }

  async validateSession(userId: string, sessionId: string): Promise<boolean> {
    const sessionKey = `session:${userId}`;
    const sessionData = await this.redisClient.get(sessionKey);

    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    return session.id === sessionId;
  }

  async invalidateSession(userId: string): Promise<void> {
    const sessionKey = `session:${userId}`;
    await this.redisClient.del(sessionKey);
  }

  async refreshSession(userId: string): Promise<void> {
    const sessionKey = `session:${userId}`;
    await this.redisClient.expire(
      sessionKey,
      this.configService.get('SESSION_TTL')
    );
  }
} 

function Injectable(): (target: typeof SessionService) => void | typeof SessionService {
    throw new Error("Function not implemented.");
}


function Inject(arg0: string): (target: typeof SessionService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error("Function not implemented.");
}


function uuidv4() {
    throw new Error("Function not implemented.");
}
