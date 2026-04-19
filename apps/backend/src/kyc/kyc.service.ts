import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { KycStatus } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitKycDto) {
    const existing = await this.prisma.kyc.findUnique({ where: { userId } });

    if (existing?.status === KycStatus.APPROVED) {
      throw new BadRequestException('KYC already approved');
    }

    if (existing) {
      return this.prisma.kyc.update({
        where: { userId },
        data: {
          ...dto,
          status: KycStatus.PENDING,
          rejectionReason: null,
          reviewedAt: null,
        },
      });
    }

    return this.prisma.kyc.create({
      data: { userId, ...dto, status: KycStatus.PENDING },
    });
  }

  async getStatus(userId: string) {
    const kyc = await this.prisma.kyc.findUnique({ where: { userId } });
    if (!kyc) return { status: 'NOT_SUBMITTED', kyc: null };
    return { status: kyc.status, kyc };
  }

  async review(userId: string, status: KycStatus, rejectionReason?: string) {
    const kyc = await this.prisma.kyc.findUnique({ where: { userId } });
    if (!kyc) throw new NotFoundException('KYC submission not found');

    return this.prisma.kyc.update({
      where: { userId },
      data: { status, rejectionReason: rejectionReason ?? null, reviewedAt: new Date() },
    });
  }
}
