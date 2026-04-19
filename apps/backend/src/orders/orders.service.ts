import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrderStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `AGM-${dateStr}-${suffix}`;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = new Prisma.Decimal(0);

    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (product.status !== 'ACTIVE') {
        throw new BadRequestException(`Product ${product.name_en} is not available`);
      }
      const qty = new Prisma.Decimal(item.quantity);
      if (qty.gt(product.quantityAvailable)) {
        throw new BadRequestException(`Insufficient stock for ${product.name_en}`);
      }
      const lineTotal = product.pricePerUnit.mul(qty);
      totalAmount = totalAmount.add(lineTotal);
      return {
        productId: item.productId,
        sellerId: product.sellerId,
        quantity: qty,
        pricePerUnit: product.pricePerUnit,
        totalPrice: lineTotal,
      };
    });

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          buyerId,
          totalAmount,
          deliveryAddress: dto.deliveryAddress,
          deliveryDistrict: dto.deliveryDistrict,
          deliveryTaluka: dto.deliveryTaluka,
          deliveryVillage: dto.deliveryVillage,
          notes: dto.notes,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        await tx.product.update({
          where: { id: item.productId },
          data: { quantityAvailable: { decrement: item.quantity } },
        });
        if (new Prisma.Decimal(product.quantityAvailable).sub(item.quantity).lte(0)) {
          await tx.product.update({ where: { id: item.productId }, data: { status: 'SOLD_OUT' } });
        }
      }

      return newOrder;
    });

    return order;
  }

  async findAllForBuyer(buyerId: string, query: PaginationDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { buyerId },
        skip,
        take: limit,
        include: { items: { include: { product: { select: { id: true, name_en: true, images: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { buyerId } }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAllForSeller(sellerId: string, query: PaginationDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { items: { some: { sellerId } } },
        skip,
        take: limit,
        include: {
          items: { where: { sellerId }, include: { product: true } },
          buyer: { select: { id: true, name_en: true, name_mr: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { items: { some: { sellerId } } } }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, seller: { select: { id: true, name_en: true } } } },
        buyer: { select: { id: true, name_en: true, phone: true } },
        payment: true,
        delivery: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const sellerIds = order.items.map((i) => i.sellerId);
    if (order.buyerId !== userId && !sellerIds.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}
