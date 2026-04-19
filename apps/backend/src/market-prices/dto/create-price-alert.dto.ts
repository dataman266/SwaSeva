import { IsString, IsNumber, IsPositive, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePriceAlertDto {
  @IsString()
  @MaxLength(200)
  commodity_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  targetPrice: number;

  @IsEnum(['ABOVE', 'BELOW'])
  direction: 'ABOVE' | 'BELOW';
}
