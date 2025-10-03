import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsBase64Image } from '../../Utils/base64-image.validator';

// Helper function to transform comma-separated string to array
const transformStringToArray = ({ value }: { value: string }) => {
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim());
  }
  return value;
};

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
  imageBase64?: string;

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
  imageBase64?: string;

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

  // Support for multiple car types
  @Transform(transformStringToArray)
  @IsArray()
  @IsEnum(['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'], {
    each: true,
  })
  @IsOptional()
  carTypes?: ('Micro Car' | 'Medium' | 'SUV' | 'Mini Bus' | 'Truck' | 'Van')[];

  // Support for multiple makes
  @Transform(transformStringToArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  makes?: string[];

  // Support for multiple fuel types
  @Transform(transformStringToArray)
  @IsArray()
  @IsEnum(['Electric', 'Petrol', 'Diesel', 'Hybrid'], { each: true })
  @IsOptional()
  fuelTypes?: ('Electric' | 'Petrol' | 'Diesel' | 'Hybrid')[];

  @IsEnum(['Automatic', 'Manual'])
  @IsOptional()
  transmission?: 'Automatic' | 'Manual';

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minSeats?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxSeats?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  // New sorting parameter
  @IsEnum(['Cheapest', 'Closest', 'Rating'])
  @IsOptional()
  sort?: 'Cheapest' | 'Closest' | 'Rating';

  // For location-based sorting (Closest), we need user's location
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userLat?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userLng?: number;

  // Keep legacy single parameters for backward compatibility
  @IsEnum(['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'])
  @IsOptional()
  carType?: 'Micro Car' | 'Medium' | 'SUV' | 'Mini Bus' | 'Truck' | 'Van';

  @IsEnum(['Electric', 'Petrol', 'Diesel', 'Hybrid'])
  @IsOptional()
  fuelType?: 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';

  @IsString()
  @IsOptional()
  make?: string;
}
