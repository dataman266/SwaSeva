import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('seller')
  sellerDashboard(@CurrentUser('id') sellerId: string) {
    return this.analyticsService.getSellerDashboard(sellerId);
  }

  @Get('buyer')
  buyerDashboard(@CurrentUser('id') buyerId: string) {
    return this.analyticsService.getBuyerDashboard(buyerId);
  }
}
