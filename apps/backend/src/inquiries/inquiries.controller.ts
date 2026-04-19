import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

class ReplyDto {
  @IsString()
  @MaxLength(1000)
  reply_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reply_mr?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@CurrentUser('id') buyerId: string, @Body() dto: CreateInquiryDto) {
    return this.inquiriesService.create(buyerId, dto);
  }

  @Get('received')
  received(@CurrentUser('id') userId: string, @Query() query: PaginationDto) {
    return this.inquiriesService.findForUser(userId, 'seller', query);
  }

  @Get('sent')
  sent(@CurrentUser('id') userId: string, @Query() query: PaginationDto) {
    return this.inquiriesService.findForUser(userId, 'buyer', query);
  }

  @Patch(':id/reply')
  reply(@Param('id') id: string, @CurrentUser('id') sellerId: string, @Body() dto: ReplyDto) {
    return this.inquiriesService.reply(id, sellerId, dto.reply_en, dto.reply_mr);
  }
}
