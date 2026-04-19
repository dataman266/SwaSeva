import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('market-prices')
export class MarketPricesController {
  constructor(private readonly marketPricesService: MarketPricesService) {}

  @Get()
  findAll(@Query('district') district?: string, @Query('categoryId') categoryId?: string) {
    return this.marketPricesService.findAll(district, categoryId);
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
