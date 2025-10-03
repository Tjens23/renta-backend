import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarBookingService } from './car-booking.service';
import {
  CreateCarBookingDto,
  UpdateCarBookingDto,
} from './dto/car-booking.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('car-bookings')
@UseGuards(AuthGuard) // Require authentication for all booking endpoints
export class CarBookingController {
  constructor(private readonly carBookingService: CarBookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarBookingDto: CreateCarBookingDto, @Request() req) {
    return this.carBookingService.create(createCarBookingDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.carBookingService.findAll();
  }

  @Get('my-bookings')
  findMyBookings(@Request() req) {
    return this.carBookingService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carBookingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarBookingDto: UpdateCarBookingDto,
    @Request() req,
  ) {
    return this.carBookingService.update(id, updateCarBookingDto, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.carBookingService.remove(id, req.user.sub);
  }
}
