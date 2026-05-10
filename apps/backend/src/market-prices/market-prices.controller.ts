import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { CreateMarketPriceDto } from './dto/create-price.dto';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '@prisma/client';

@Controller('market-prices')
export class MarketPricesController {
  constructor(private readonly marketPricesService: MarketPricesService) {}

  @Get()
  findAll(@Query('district') district?: string, @Query('categoryId') categoryId?: string) {
    return this.marketPricesService.findAll(district, categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  create(@Body() dto: CreateMarketPriceDto) {
    return this.marketPricesService.create(dto);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  getAlerts(@CurrentUser('id') userId: string) {
    return this.marketPricesService.getAlerts(userId);
  }

  @Post('alerts')
  @UseGuards(JwtAuthGuard)
  createAlert(@CurrentUser('id') userId: string, @Body() dto: CreatePriceAlertDto) {
    return this.marketPricesService.createAlert(userId, dto);
  }

  @Delete('alerts/:id')
  @UseGuards(JwtAuthGuard)
  deleteAlert(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.marketPricesService.deleteAlert(userId, id);
  }
}
