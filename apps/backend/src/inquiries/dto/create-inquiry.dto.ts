import { IsUUID, IsString, MaxLength, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInquiryDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MaxLength(1000)
  message_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message_mr?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
