import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, dto: CreateInquiryDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.inquiry.create({
      data: {
        productId: dto.productId,
        buyerId,
        sellerId: product.sellerId,
        message_en: dto.message_en,
        message_mr: dto.message_mr,
        quantity: dto.quantity ? new Prisma.Decimal(dto.quantity) : null,
      },
    });
  }

  async findForUser(userId: string, role: 'buyer' | 'seller', query: PaginationDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const where = role === 'buyer' ? { buyerId: userId } : { sellerId: userId };

    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        include: { product: { select: { id: true, name_en: true, images: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async reply(id: string, sellerId: string, reply_en: string, reply_mr?: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    if (inquiry.sellerId !== sellerId) throw new ForbiddenException('Access denied');

    return this.prisma.inquiry.update({
      where: { id },
      data: { reply_en, reply_mr, repliedAt: new Date(), status: 'REPLIED' },
    });
  }
}
