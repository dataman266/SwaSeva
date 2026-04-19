import { IsOptional, IsString, MaxLength, IsEnum, IsDateString } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  carrier?: string;

  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @IsOptional()
  @IsDateString()
  deliveredAt?: string;
}
