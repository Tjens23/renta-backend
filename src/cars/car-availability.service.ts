import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarAvailable } from '../entities/CarAvaliable';
import { Car } from '../entities/Car';
import {
  CreateCarAvailabilityDto,
  UpdateCarAvailabilityDto,
} from './dto/car-availability.dto';

@Injectable()
export class CarAvailabilityService {
  constructor(
    @InjectRepository(CarAvailable)
    private carAvailableRepository: Repository<CarAvailable>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async create(
    createCarAvailabilityDto: CreateCarAvailabilityDto,
  ): Promise<CarAvailable> {
    // Verify car exists
    const car = await this.carRepository.findOne({
      where: { id: createCarAvailabilityDto.carId },
    });

    if (!car) {
      throw new NotFoundException(
        `Car with ID ${createCarAvailabilityDto.carId} not found`,
      );
    }

    // Validate dates
    const startDate = new Date(createCarAvailabilityDto.startDate);
    const endDate = new Date(createCarAvailabilityDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const availability = this.carAvailableRepository.create({
      ...createCarAvailabilityDto,
      startDate,
      endDate,
    });

    return this.carAvailableRepository.save(availability);
  }

  async findAll(): Promise<CarAvailable[]> {
    return this.carAvailableRepository.find({
      relations: ['car'],
    });
  }

  async findByCarId(carId: number): Promise<CarAvailable[]> {
    return this.carAvailableRepository.find({
      where: { carId },
      relations: ['car'],
    });
  }

  async findOne(id: number): Promise<CarAvailable> {
    const availability = await this.carAvailableRepository.findOne({
      where: { id },
      relations: ['car'],
    });

    if (!availability) {
      throw new NotFoundException(`Car availability with ID ${id} not found`);
    }

    return availability;
  }

  async update(
    id: number,
    updateCarAvailabilityDto: UpdateCarAvailabilityDto,
  ): Promise<CarAvailable> {
    const availability = await this.findOne(id);

    // Validate dates if provided
    if (
      updateCarAvailabilityDto.startDate ||
      updateCarAvailabilityDto.endDate
    ) {
      const startDate = updateCarAvailabilityDto.startDate
        ? new Date(updateCarAvailabilityDto.startDate)
        : availability.startDate;
      const endDate = updateCarAvailabilityDto.endDate
        ? new Date(updateCarAvailabilityDto.endDate)
        : availability.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    Object.assign(availability, updateCarAvailabilityDto);
    return this.carAvailableRepository.save(availability);
  }

  async remove(id: number): Promise<void> {
    const availability = await this.findOne(id);
    await this.carAvailableRepository.remove(availability);
  }
}
