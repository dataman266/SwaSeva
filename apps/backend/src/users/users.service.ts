import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RoleType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true, kyc: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async addRole(userId: string, role: RoleType) {
    const existing = await this.prisma.userRole.findUnique({
      where: { userId_role: { userId, role } },
    });

    if (existing) return { message: 'Role already assigned' };

    await this.prisma.userRole.create({ data: { userId, role } });
    return { message: 'Role added successfully' };
  }

  async getStats(userId: string) {
    const [totalListings, activeListings, totalOrders] = await Promise.all([
      this.prisma.product.count({ where: { sellerId: userId } }),
      this.prisma.product.count({ where: { sellerId: userId, status: 'ACTIVE' } }),
      this.prisma.order.count({ where: { buyerId: userId } }),
    ]);

    return { totalListings, activeListings, totalOrders };
  }
}
