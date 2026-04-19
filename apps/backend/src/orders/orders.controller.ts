import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrderStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser('id') buyerId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(buyerId, dto);
  }

  @Get('bought')
  findBought(@CurrentUser('id') buyerId: string, @Query() query: PaginationDto) {
    return this.ordersService.findAllForBuyer(buyerId, query);
  }

  @Get('sold')
  findSold(@CurrentUser('id') sellerId: string, @Query() query: PaginationDto) {
    return this.ordersService.findAllForSeller(sellerId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status, userId);
  }
}
