import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarOwner } from '../entities/CarOwner';
import { CreateCarOwnerDto, UpdateCarOwnerDto } from './dto/car-owner.dto';

@Injectable()
export class CarOwnersService {
  constructor(
    @InjectRepository(CarOwner)
    private carOwnersRepository: Repository<CarOwner>,
  ) {}

  async create(createCarOwnerDto: CreateCarOwnerDto): Promise<CarOwner> {
    const carOwner = this.carOwnersRepository.create(createCarOwnerDto);
    return this.carOwnersRepository.save(carOwner);
  }

  async findAll(): Promise<CarOwner[]> {
    return this.carOwnersRepository.find({
      relations: ['cars'],
    });
  }

  async findOne(id: number): Promise<CarOwner> {
    const carOwner = await this.carOwnersRepository.findOne({
      where: { id },
      relations: ['cars'],
    });

    if (!carOwner) {
      throw new NotFoundException(`Car owner with ID ${id} not found`);
    }

    return carOwner;
  }

  async update(
    id: number,
    updateCarOwnerDto: UpdateCarOwnerDto,
  ): Promise<CarOwner> {
    const carOwner = await this.findOne(id);
    Object.assign(carOwner, updateCarOwnerDto);
    return this.carOwnersRepository.save(carOwner);
  }

  async remove(id: number): Promise<void> {
    const carOwner = await this.findOne(id);
    await this.carOwnersRepository.remove(carOwner);
  }

  async updateRating(id: number, newRating: number): Promise<CarOwner> {
    const carOwner = await this.findOne(id);

    // Calculate new average rating
    const totalRating = carOwner.rating * carOwner.numberOfReviews;
    carOwner.numberOfReviews += 1;
    carOwner.rating = (totalRating + newRating) / carOwner.numberOfReviews;

    return this.carOwnersRepository.save(carOwner);
  }

  async getTopRated(limit: number = 10): Promise<CarOwner[]> {
    return this.carOwnersRepository.find({
      relations: ['cars'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }
}
