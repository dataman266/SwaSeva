import { IsString, IsNumber, IsPositive, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarketPriceDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @MaxLength(200)
  commodity_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  commodity_mr?: string;

  @IsString()
  @MaxLength(100)
  market: string;

  @IsString()
  @MaxLength(100)
  district: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  modalPrice: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;
}
