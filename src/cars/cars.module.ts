import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Car } from '../entities/Car';
import { CarOwner } from '../entities/CarOwner';
import { CarBooking } from '../entities/CarBooking';
import { CarAvailable } from '../entities/CarAvaliable';
import { User } from '../entities/User';
import { CarsService } from './cars.service';
import { CarOwnersService } from './car-owners.service';
import { CarBookingService } from './car-booking.service';
import { CarAvailabilityService } from './car-availability.service';
import { CarsController } from './cars.controller';
import { CarOwnersController } from './car-owners.controller';
import { CarBookingController } from './car-booking.controller';
import { CarAvailabilityController } from './car-availability.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, CarOwner, CarBooking, CarAvailable, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    CarsController,
    CarOwnersController,
    CarBookingController,
    CarAvailabilityController,
  ],
  providers: [
    CarsService,
    CarOwnersService,
    CarBookingService,
    CarAvailabilityService,
  ],
  exports: [
    CarsService,
    CarOwnersService,
    CarBookingService,
    CarAvailabilityService,
  ],
})
export class CarsModule {}
