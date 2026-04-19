import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const reviewee = await this.prisma.user.findUnique({ where: { id: dto.revieweeId } });
    if (!reviewee) throw new NotFoundException('User to review not found');

    return this.prisma.review.create({
      data: {
        reviewerId,
        revieweeId: dto.revieweeId,
        orderId: dto.orderId,
        rating: dto.rating,
        comment_en: dto.comment_en,
        comment_mr: dto.comment_mr,
      },
    });
  }

  async findForUser(userId: string, query: PaginationDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { revieweeId: userId },
        skip,
        take: limit,
        include: {
          reviewer: { select: { id: true, name_en: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { revieweeId: userId } }),
    ]);

    const avgRating = data.length
      ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
      : 0;

    return { data, avgRating: Number(avgRating.toFixed(1)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
