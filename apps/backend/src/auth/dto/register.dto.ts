import { IsString, IsOptional, Matches, MaxLength, IsEnum } from 'class-validator';
import { RoleType } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/)
  phone: string;

  @IsString()
  @MaxLength(100)
  name_en: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name_mr?: string;

  @IsOptional()
  @IsEnum(RoleType)
  primaryRole?: RoleType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

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
