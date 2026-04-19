import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConfig } from '../config/jwt.config';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { RoleType } from '@prisma/client';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const OTP_MAX_REQUESTS_PER_10MIN = 3;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recentCount = await this.prisma.otpSession.count({
      where: { phone: dto.phone, createdAt: { gte: tenMinutesAgo } },
    });

    if (recentCount >= OTP_MAX_REQUESTS_PER_10MIN) {
      throw new HttpException('Too many OTP requests. Please wait before requesting again.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.otpSession.create({
      data: { phone: dto.phone, otpHash, expiresAt },
    });

    // In production, integrate an SMS provider (e.g. Twilio, MSG91) here
    console.log(`[DEV] OTP for ${dto.phone}: ${otp}`);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const session = await this.prisma.otpSession.findFirst({
      where: {
        phone: dto.phone,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      throw new BadRequestException('No active OTP session found. Please request a new OTP.');
    }

    if (session.attempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestException('Maximum OTP attempts exceeded. Please request a new OTP.');
    }

    const isValid = await bcrypt.compare(dto.otp, session.otpHash);

    if (!isValid) {
      await this.prisma.otpSession.update({
        where: { id: session.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.otpSession.update({
      where: { id: session.id },
      data: { usedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
      include: { roles: true },
    });

    if (!user) {
      return { verified: true, isNewUser: true, phone: dto.phone };
    }

    const tokens = await this.generateTokens(user.id, user.phone, user.roles.map((r) => r.role));
    return { verified: true, isNewUser: false, ...tokens };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new BadRequestException('User with this phone number already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        name_en: dto.name_en,
        name_mr: dto.name_mr,
        state: dto.state || 'Maharashtra',
        district: dto.district,
        taluka: dto.taluka,
        village: dto.village,
        roles: {
          create: [{ role: dto.primaryRole || RoleType.FARMER }],
        },
      },
      include: { roles: true },
    });

    const tokens = await this.generateTokens(user.id, user.phone, user.roles.map((r) => r.role));
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { roles: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.phone, user.roles.map((r) => r.role));
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, phone: string, roles: RoleType[]) {
    const payload = { sub: userId, phone, roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.accessSecret,
        expiresIn: 900,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: 2592000,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: { id: string; phone: string; name_en: string | null; name_mr: string | null }) {
    return { id: user.id, phone: user.phone, name_en: user.name_en, name_mr: user.name_mr };
  }
}
