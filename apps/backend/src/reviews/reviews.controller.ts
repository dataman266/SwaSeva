import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser('id') reviewerId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(reviewerId, dto);
  }

  @Get('user/:userId')
  findForUser(@Param('userId') userId: string, @Query() query: PaginationDto) {
    return this.reviewsService.findForUser(userId, query);
  }
}
