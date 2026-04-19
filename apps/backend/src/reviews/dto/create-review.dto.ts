import { IsUUID, IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  revieweeId: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment_mr?: string;
}
