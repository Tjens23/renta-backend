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

      // Handle multiple car types or single car type (for backward compatibility)
      if (filters.carTypes && filters.carTypes.length > 0) {
        query.andWhere('car.carType IN (:...carTypes)', {
          carTypes: filters.carTypes,
        });
      } else if (filters.carType) {
        query.andWhere('car.carType = :carType', { carType: filters.carType });
      }

      // Handle multiple fuel types or single fuel type (for backward compatibility)
      if (filters.fuelTypes && filters.fuelTypes.length > 0) {
        query.andWhere('car.fuelType IN (:...fuelTypes)', {
          fuelTypes: filters.fuelTypes,
        });
      } else if (filters.fuelType) {
        query.andWhere('car.fuelType = :fuelType', {
          fuelType: filters.fuelType,
        });
      }

      // Handle multiple makes or single make (for backward compatibility)
      if (filters.makes && filters.makes.length > 0) {
        query.andWhere('car.make IN (:...makes)', { makes: filters.makes });
      } else if (filters.make) {
        query.andWhere('car.make = :make', { make: filters.make });
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

      // Handle sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'Cheapest':
            query.orderBy('car.pricePerKm', 'ASC');
            break;
          case 'Rating':
            // Add rating field to Car entity if not exists, for now order by creation date
            query.orderBy('car.createdAt', 'DESC');
            break;
          case 'Closest':
            // For closest sorting, we need user's location
            if (filters.userLat && filters.userLng) {
              // Using Haversine formula for distance calculation
              query
                .setParameters({
                  userLat: filters.userLat,
                  userLng: filters.userLng,
                })
                .addSelect(
                  `
                (6371 * acos(
                  cos(radians(:userLat)) * cos(radians(car.latitude)) * 
                  cos(radians(car.longitude) - radians(:userLng)) + 
                  sin(radians(:userLat)) * sin(radians(car.latitude))
                )) AS distance
              `,
                )
                .orderBy('distance', 'ASC');
            } else {
              // Fallback to default ordering if no user location provided
              query.orderBy('car.createdAt', 'DESC');
            }
            break;
          default:
            query.orderBy('car.createdAt', 'DESC');
        }
      } else {
        // Default ordering
        query.orderBy('car.createdAt', 'DESC');
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
