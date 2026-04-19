import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(buyerId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { buyerId },
      include: {
        product: {
          include: { seller: { select: { id: true, name_en: true, name_mr: true } } },
        },
      },
    });

    const total = items.reduce((sum, item) => {
      return sum + Number(item.product.pricePerUnit) * Number(item.quantity);
    }, 0);

    return { items, total: new Prisma.Decimal(total).toFixed(2) };
  }

  async addItem(buyerId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundException('Product not available');
    }

    if (new Prisma.Decimal(dto.quantity).gt(product.quantityAvailable)) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { buyerId_productId: { buyerId, productId: dto.productId } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: new Prisma.Decimal(dto.quantity) },
      });
    }

    return this.prisma.cartItem.create({
      data: { buyerId, productId: dto.productId, quantity: new Prisma.Decimal(dto.quantity) },
    });
  }

  async removeItem(buyerId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, buyerId } });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(buyerId: string) {
    await this.prisma.cartItem.deleteMany({ where: { buyerId } });
    return { message: 'Cart cleared' };
  }
}
