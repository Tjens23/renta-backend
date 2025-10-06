import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBooking } from '../entities/CarBooking';
import { Car } from '../entities/Car';
import { User } from '../entities/User';
import { CarAvailable } from '../entities/CarAvaliable';
import {
  CreateCarBookingDto,
  UpdateCarBookingDto,
} from './dto/car-booking.dto';

@Injectable()
export class CarBookingService {
  constructor(
    @InjectRepository(CarBooking)
    private carBookingRepository: Repository<CarBooking>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CarAvailable)
    private carAvailableRepository: Repository<CarAvailable>,
  ) {}

  async create(
    createCarBookingDto: CreateCarBookingDto,
    userId: number,
  ): Promise<CarBooking> {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const car = await this.carRepository.findOne({
      where: { id: createCarBookingDto.carId },
    });

    if (!car) {
      throw new NotFoundException(
        `Car with ID ${createCarBookingDto.carId} not found`,
      );
    }

    const startDate = new Date(createCarBookingDto.startDate);
    const endDate = new Date(createCarBookingDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    const isCarAvailable = await this.checkCarAvailability(
      createCarBookingDto.carId,
      startDate,
      endDate,
    );

    if (!isCarAvailable) {
      throw new BadRequestException(
        'Car is not available for the requested period',
      );
    }

    const booking = this.carBookingRepository.create({
      ...createCarBookingDto,
      whoBookedId: userId,
      startDate,
      endDate,
    });

    return this.carBookingRepository.save(booking);
  }

  async findAll(): Promise<CarBooking[]> {
    return this.carBookingRepository.find({
      relations: ['car'],
    });
  }

  async findByUser(userId: number): Promise<CarBooking[]> {
    return this.carBookingRepository.find({
      where: { whoBookedId: userId },
      relations: ['car'],
    });
  }

  async findOne(id: number): Promise<CarBooking> {
    const booking = await this.carBookingRepository.findOne({
      where: { id },
      relations: ['car'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(
    id: number,
    updateCarBookingDto: UpdateCarBookingDto,
    userId: number,
  ): Promise<CarBooking> {
    const booking = await this.findOne(id);

    // Check if user owns this booking
    if (booking.whoBookedId !== userId) {
      throw new BadRequestException('You can only update your own bookings');
    }

    // Validate dates if provided
    if (updateCarBookingDto.startDate || updateCarBookingDto.endDate) {
      const startDate = updateCarBookingDto.startDate
        ? new Date(updateCarBookingDto.startDate)
        : booking.startDate;
      const endDate = updateCarBookingDto.endDate
        ? new Date(updateCarBookingDto.endDate)
        : booking.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }

      if (startDate < new Date()) {
        throw new BadRequestException('Start date cannot be in the past');
      }

      // Check for conflicts with other bookings
      const conflictingBooking = await this.carBookingRepository
        .createQueryBuilder('booking')
        .where('booking.carId = :carId', { carId: booking.carId })
        .andWhere('booking.id != :bookingId', { bookingId: id })
        .andWhere(
          '(booking.startDate <= :endDate AND booking.endDate >= :startDate)',
          { startDate, endDate },
        )
        .getOne();

      if (conflictingBooking) {
        throw new BadRequestException(
          'Car is already booked for the requested period',
        );
      }
    }

    Object.assign(booking, updateCarBookingDto);
    return this.carBookingRepository.save(booking);
  }

  async remove(id: number, userId: number): Promise<void> {
    const booking = await this.findOne(id);

    // Check if user owns this booking
    if (booking.whoBookedId !== userId) {
      throw new BadRequestException('You can only delete your own bookings');
    }

    await this.carBookingRepository.remove(booking);
  }

  /**
   * Check if car is available for booking using frontend logic:
   * filteredCars = filteredCars.filter(car => car.bookings.find(b => (filter.fromDate! < b.to && b.from < filter.toDate!)) === undefined)
   *
   * Translation: Car is available if NO booking exists where:
   * (requestedStartDate < booking.endDate && booking.startDate < requestedEndDate)
   */
  private async checkCarAvailability(
    carId: number,
    requestedStartDate: Date,
    requestedEndDate: Date,
  ): Promise<boolean> {
    // Check against existing bookings (CarBooking table)
    const conflictingBooking = await this.carBookingRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .andWhere(
        '(:fromDate < booking.endDate AND booking.startDate < :toDate)',
        {
          fromDate: requestedStartDate,
          toDate: requestedEndDate,
        },
      )
      .getOne();

    if (conflictingBooking) {
      return false; // Car is already booked
    }

    return true;

    /*
    // Check against car availability periods (CarAvailable table)
    // Car must have an availability period that covers the requested dates
    const availabilityPeriod = await this.carAvailableRepository
      .createQueryBuilder('available')
      .where('available.carId = :carId', { carId })
      .andWhere('available.startDate <= :fromDate', {
        fromDate: requestedStartDate,
      })
      .andWhere('available.endDate >= :toDate', { toDate: requestedEndDate })
      .getOne();

    return !!availabilityPeriod; // Car is available if we found a matching availability period*/
  }
}
