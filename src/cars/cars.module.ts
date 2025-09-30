import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../entities/Car';
import { CarOwner } from '../entities/CarOwner';
import { CarsService } from './cars.service';
import { CarOwnersService } from './car-owners.service';
import { CarsController } from './cars.controller';
import { CarOwnersController } from './car-owners.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarOwner])],
  controllers: [CarsController, CarOwnersController],
  providers: [CarsService, CarOwnersService],
  exports: [CarsService, CarOwnersService],
})
export class CarsModule {}
