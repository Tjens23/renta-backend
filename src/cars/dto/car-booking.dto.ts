import { IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarBookingDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsNumber()
  carId: number;
}

export class UpdateCarBookingDto {
  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @Type(() => Number)
  @IsNumber()
  carId?: number;
}
