import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSellerDashboard(sellerId: string) {
    const [totalProducts, activeProducts, totalOrders, pendingOrders] = await Promise.all([
      this.prisma.product.count({ where: { sellerId } }),
      this.prisma.product.count({ where: { sellerId, status: 'ACTIVE' } }),
      this.prisma.orderItem.count({ where: { sellerId } }),
      this.prisma.orderItem.count({ where: { sellerId, order: { status: 'PENDING' } } }),
    ]);

    const revenue = await this.prisma.orderItem.aggregate({
      where: { sellerId, order: { payment: { status: 'SUCCESS' } } },
      _sum: { totalPrice: true },
    });

    const recentOrders = await this.prisma.orderItem.findMany({
      where: { sellerId },
      take: 5,
      orderBy: { order: { createdAt: 'desc' } },
      include: {
        order: { select: { orderNumber: true, status: true, createdAt: true } },
        product: { select: { name_en: true } },
      },
    });

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: revenue._sum.totalPrice ?? 0,
      recentOrders,
    };
  }

  async getBuyerDashboard(buyerId: string) {
    const [totalOrders, pendingOrders] = await Promise.all([
      this.prisma.order.count({ where: { buyerId } }),
      this.prisma.order.count({ where: { buyerId, status: 'PENDING' } }),
    ]);

    const totalSpent = await this.prisma.payment.aggregate({
      where: { order: { buyerId }, status: 'SUCCESS' },
      _sum: { amount: true },
    });

    return {
      totalOrders,
      pendingOrders,
      totalSpent: totalSpent._sum.amount ?? 0,
    };
  }
}
