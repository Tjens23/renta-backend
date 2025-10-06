import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '../entities/Review';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  async getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Get()
  async getAllReviews() {
    return this.reviewService.findAll();
  }

  @Get('user/:userId/distribution')
  async getUserDistribution(@Param('userId') userId: number) {
    return this.reviewService.getRatingDistribution(userId);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createReview(@Body() data: Partial<Review>) {
    return this.reviewService.create(data);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Review>,
  ) {
    return this.reviewService.update(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.delete(id);
  }

  @Get('avg/:userId')
  async getAverageRating(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewService.calculateAverageRating(userId);
  }
}
