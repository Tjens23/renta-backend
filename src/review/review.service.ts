import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/Review';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<Review | null> {
    return this.reviewRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  async create(data: Partial<Review>): Promise<Review> {
    if (!data.userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${data.userId} not found`);
    }

    const review = this.reviewRepository.create(data);
    const response = this.reviewRepository.save(review);

    const { avg, count } = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.userId = :userId', { userId: data.userId })
      .getRawOne();

    await this.userRepository.update(data.userId, {
      rating: Number(avg) || 0,
      numberOfReviews: Number(count) || 0,
    });

    return response;
  }

  async update(id: number, data: Partial<Review>): Promise<Review | null> {
    await this.reviewRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.reviewRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getRatingDistribution(userId: number) {
    const raw = await this.reviewRepository
      .createQueryBuilder('r')
      .select('r.rating', 'rating')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.userId = :userId', { userId })
      .groupBy('r.rating')
      .getRawMany();

    // Normalize to always return all 1–5 stars
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of raw) {
      distribution[row.rating] = Number(row.count);
    }

    return distribution;
  }

  async calculateAverageRating(userId: number): Promise<number> {
    const { avg } = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.userId = :userId', { userId })
      .getRawOne();

    return avg ?? 0;
  }
}
