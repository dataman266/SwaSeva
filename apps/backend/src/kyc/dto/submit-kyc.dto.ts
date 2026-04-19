import { IsString, IsOptional, MaxLength, IsUrl, IsEnum } from 'class-validator';

export enum DocumentType {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  VOTER_ID = 'VOTER_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  LAND_RECORD = 'LAND_RECORD',
}

export class SubmitKycDto {
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  @MaxLength(50)
  documentNumber: string;

  @IsUrl()
  documentFrontUrl: string;

  @IsOptional()
  @IsUrl()
  documentBackUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  farmSizeHectares?: string;
}
