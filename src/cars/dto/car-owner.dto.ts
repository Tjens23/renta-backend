import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateCarOwnerDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfReviews?: number;
}

export class UpdateCarOwnerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfReviews?: number;
}
