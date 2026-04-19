import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('id') buyerId: string) {
    return this.cartService.getCart(buyerId);
  }

  @Post('items')
  addItem(@CurrentUser('id') buyerId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(buyerId, dto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@CurrentUser('id') buyerId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(buyerId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCart(@CurrentUser('id') buyerId: string) {
    return this.cartService.clearCart(buyerId);
  }
}
