import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  initiate(@CurrentUser('id') buyerId: string, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(buyerId, dto);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @CurrentUser('id') buyerId: string) {
    return this.paymentsService.confirm(id, buyerId);
  }

  @Get('order/:orderId')
  getForOrder(@Param('orderId') orderId: string, @CurrentUser('id') userId: string) {
    return this.paymentsService.getForOrder(orderId, userId);
  }
}
