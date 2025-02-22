import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../domain/entities/user.entity";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { AuthService } from "../services/auth.service";
import { KYCService } from "../services/kyc.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kycService: KYCService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Post('2fa/verify')
  @UseGuards(AuthGuard)
  async verifyTwoFactor(
    @Req() request: Request,
    @Body() twoFactorDto: { code: string }
  ): Promise<boolean> {
    return this.authService.validateTwoFactor((request['user'] as User).id, twoFactorDto.code);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: Request): Promise<void> {
    return this.authService.logout((request['user'] as User).id);
  }
}