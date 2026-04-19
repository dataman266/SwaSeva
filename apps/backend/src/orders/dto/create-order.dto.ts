import { IsUUID, IsNumber, IsPositive, IsOptional, IsString, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliveryDistrict?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliveryTaluka?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliveryVillage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
