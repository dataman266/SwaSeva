import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { KycStatus, RoleType } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

class ReviewKycDto {
  @IsEnum(KycStatus)
  status: KycStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  submit(@CurrentUser('id') userId: string, @Body() dto: SubmitKycDto) {
    return this.kycService.submit(userId, dto);
  }

  @Get()
  getStatus(@CurrentUser('id') userId: string) {
    return this.kycService.getStatus(userId);
  }

  @Patch(':userId/review')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  review(@Param('userId') userId: string, @Body() dto: ReviewKycDto) {
    return this.kycService.review(userId, dto.status, dto.rejectionReason);
  }
}
