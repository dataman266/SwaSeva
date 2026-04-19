import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get('order/:orderId')
  getByOrder(@Param('orderId') orderId: string, @CurrentUser('id') userId: string) {
    return this.deliveriesService.getByOrder(orderId, userId);
  }

  @Patch('order/:orderId')
  update(@Param('orderId') orderId: string, @CurrentUser('id') sellerId: string, @Body() dto: UpdateDeliveryDto) {
    return this.deliveriesService.update(orderId, sellerId, dto);
  }
}
