import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async getByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const sellerItems = await this.prisma.orderItem.findFirst({ where: { orderId, sellerId: userId } });
    if (order.buyerId !== userId && !sellerItems) throw new ForbiddenException('Access denied');

    return this.prisma.delivery.findFirst({ where: { orderId } });
  }

  async update(orderId: string, sellerId: string, dto: UpdateDeliveryDto) {
    const sellerItem = await this.prisma.orderItem.findFirst({ where: { orderId, sellerId } });
    if (!sellerItem) throw new ForbiddenException('You are not a seller for this order');

    const delivery = await this.prisma.delivery.findFirst({ where: { orderId } });

    if (!delivery) {
      return this.prisma.delivery.create({
        data: {
          orderId,
          ...dto,
          estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : undefined,
          deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
        },
      });
    }

    return this.prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        ...dto,
        estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : undefined,
        deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
      },
    });
  }
}
