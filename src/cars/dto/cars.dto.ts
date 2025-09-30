import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @Min(0)
  pricePerKm: number;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'])
  carType: 'Micro Car' | 'Medium' | 'SUV' | 'Mini Bus' | 'Truck' | 'Van';

  @IsEnum(['Electric', 'Petrol', 'Diesel', 'Hybrid'])
  fuelType: 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';

  @IsEnum(['Automatic', 'Manual'])
  transmission: 'Automatic' | 'Manual';

  @IsNumber()
  @Min(1)
  @Max(50)
  seats: number;

  @IsNumber()
  ownerId: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class UpdateCarDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  year?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerKm?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'])
  @IsOptional()
  carType?: 'Micro Car' | 'Medium' | 'SUV' | 'Mini Bus' | 'Truck' | 'Van';

  @IsEnum(['Electric', 'Petrol', 'Diesel', 'Hybrid'])
  @IsOptional()
  fuelType?: 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';

  @IsEnum(['Automatic', 'Manual'])
  @IsOptional()
  transmission?: 'Automatic' | 'Manual';

  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  seats?: number;

  @IsNumber()
  @IsOptional()
  ownerId?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class CarFilterDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'])
  @IsOptional()
  carType?: 'Micro Car' | 'Medium' | 'SUV' | 'Mini Bus' | 'Truck' | 'Van';

  @IsEnum(['Electric', 'Petrol', 'Diesel', 'Hybrid'])
  @IsOptional()
  fuelType?: 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';

  @IsEnum(['Automatic', 'Manual'])
  @IsOptional()
  transmission?: 'Automatic' | 'Manual';

  @IsNumber()
  @IsOptional()
  minSeats?: number;

  @IsNumber()
  @IsOptional()
  maxSeats?: number;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
