import { IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarAvailabilityDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsNumber()
  carId: number;
}

export class UpdateCarAvailabilityDto {
  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;
}
