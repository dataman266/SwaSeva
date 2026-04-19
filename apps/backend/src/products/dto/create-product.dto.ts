import {
  IsString, IsOptional, IsNumber, IsPositive, MaxLength,
  IsUUID, IsEnum, IsArray, IsUrl, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name_mr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description_mr?: string;

  @IsUUID()
  categoryId: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerUnit: number;

  @IsEnum(UnitType)
  unit: UnitType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantityAvailable: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  variety?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  taluka?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  village?: string;
}
