import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { ProductStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(sellerId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        pricePerUnit: new Prisma.Decimal(dto.pricePerUnit),
        quantityAvailable: new Prisma.Decimal(dto.quantityAvailable),
        sellerId,
        images: dto.images ?? [],
      },
    });
  }

  async findAll(query: ListProductsDto) {
    const { page, limit, categoryId, district, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: status ?? ProductStatus.ACTIVE,
    };

    if (categoryId) where['categoryId'] = categoryId;
    if (district) where['district'] = district;
    if (search) {
      where['OR'] = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_mr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, seller: { select: { id: true, name_en: true, name_mr: true, district: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: { select: { id: true, name_en: true, name_mr: true, district: true, village: true, avatarUrl: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId) throw new ForbiddenException('You can only update your own products');

    const data: Record<string, unknown> = { ...dto };
    if (dto.pricePerUnit !== undefined) data['pricePerUnit'] = new Prisma.Decimal(dto.pricePerUnit);
    if (dto.quantityAvailable !== undefined) data['quantityAvailable'] = new Prisma.Decimal(dto.quantityAvailable);

    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId) throw new ForbiddenException('You can only delete your own products');

    return this.prisma.product.update({ where: { id }, data: { status: ProductStatus.INACTIVE } });
  }

  async getMyListings(sellerId: string, query: ListProductsDto) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where = { sellerId, ...(status ? { status } : {}) };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
