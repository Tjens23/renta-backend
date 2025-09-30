import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/Car';
import { CarOwner } from '../entities/CarOwner';
import { CreateCarDto, UpdateCarDto, CarFilterDto } from './dto/cars.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    @InjectRepository(CarOwner)
    private carOwnersRepository: Repository<CarOwner>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    // Verify owner exists
    const owner = await this.carOwnersRepository.findOne({
      where: { id: createCarDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(
        `Car owner with ID ${createCarDto.ownerId} not found`,
      );
    }

    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }

  async findAll(filters?: CarFilterDto): Promise<Car[]> {
    const query = this.carsRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.owner', 'owner');

    if (filters) {
      if (filters.location) {
        query.andWhere('car.location ILIKE :location', {
          location: `%${filters.location}%`,
        });
      }

      if (filters.carType) {
        query.andWhere('car.carType = :carType', { carType: filters.carType });
      }

      if (filters.fuelType) {
        query.andWhere('car.fuelType = :fuelType', {
          fuelType: filters.fuelType,
        });
      }

      if (filters.transmission) {
        query.andWhere('car.transmission = :transmission', {
          transmission: filters.transmission,
        });
      }

      if (filters.minSeats) {
        query.andWhere('car.seats >= :minSeats', {
          minSeats: filters.minSeats,
        });
      }

      if (filters.maxSeats) {
        query.andWhere('car.seats <= :maxSeats', {
          maxSeats: filters.maxSeats,
        });
      }

      if (filters.minPrice) {
        query.andWhere('car.pricePerKm >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }

      if (filters.maxPrice) {
        query.andWhere('car.pricePerKm <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.isAvailable !== undefined) {
        query.andWhere('car.isAvailable = :isAvailable', {
          isAvailable: filters.isAvailable,
        });
      }
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);

    if (updateCarDto.ownerId) {
      const owner = await this.carOwnersRepository.findOne({
        where: { id: updateCarDto.ownerId },
      });

      if (!owner) {
        throw new NotFoundException(
          `Car owner with ID ${updateCarDto.ownerId} not found`,
        );
      }
    }

    Object.assign(car, updateCarDto);
    return this.carsRepository.save(car);
  }

  async remove(id: number): Promise<void> {
    const car = await this.findOne(id);
    await this.carsRepository.remove(car);
  }

  async findByOwner(ownerId: number): Promise<Car[]> {
    return this.carsRepository.find({
      where: { ownerId },
      relations: ['owner'],
    });
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<Car> {
    const car = await this.findOne(id);
    car.isAvailable = isAvailable;
    return this.carsRepository.save(car);
  }

  async searchCars(searchTerm: string): Promise<Car[]> {
    return this.carsRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.owner', 'owner')
      .where('car.make ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('car.model ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('car.location ILIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}
