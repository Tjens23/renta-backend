import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBase64Image } from '../../Utils/base64-image.validator';

export class CreateCarOwnerDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsBase64Image()
  @IsOptional()
  avatarBase64?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfReviews?: number;
}

export class UpdateCarOwnerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsBase64Image()
  @IsOptional()
  avatarBase64?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfReviews?: number;
}
