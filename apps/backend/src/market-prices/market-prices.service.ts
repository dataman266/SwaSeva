import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketPriceDto } from './dto/create-price.dto';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketPricesService {
  constructor(private prisma: PrismaService) {}

  async findAll(district?: string, categoryId?: string) {
    const where: Record<string, unknown> = {};
    if (district) where['district'] = { contains: district, mode: 'insensitive' };
    if (categoryId) where['categoryId'] = categoryId;

    return this.prisma.marketPrice.findMany({
      where,
      include: { category: true },
      orderBy: [{ district: 'asc' }, { commodity_en: 'asc' }],
    });
  }

  async create(dto: CreateMarketPriceDto) {
    return this.prisma.marketPrice.create({
      data: {
        ...dto,
        minPrice: new Prisma.Decimal(dto.minPrice),
        maxPrice: new Prisma.Decimal(dto.maxPrice),
        modalPrice: new Prisma.Decimal(dto.modalPrice),
        unit: dto.unit ?? 'quintal',
        recordedAt: new Date(),
      },
    });
  }

  async createAlert(userId: string, dto: CreatePriceAlertDto) {
    return this.prisma.priceAlert.create({
      data: {
        userId,
        commodity_en: dto.commodity_en,
        district: dto.district,
        targetPrice: new Prisma.Decimal(dto.targetPrice),
        direction: dto.direction,
      },
    });
  }

  async getAlerts(userId: string) {
    return this.prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteAlert(userId: string, id: string) {
    return this.prisma.priceAlert.deleteMany({ where: { id, userId } });
  }
}
