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
  ForbiddenException,
} from '@nestjs/common';
import { CarAvailabilityService } from './car-availability.service';
import {
  CreateCarAvailabilityDto,
  UpdateCarAvailabilityDto,
} from './dto/car-availability.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('car-availability')
export class CarAvailabilityController {
  constructor(
    private readonly carAvailabilityService: CarAvailabilityService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCarAvailabilityDto: CreateCarAvailabilityDto,
    @Request() req,
  ) {
    // Verify the user owns the car
    const canManage = await this.carAvailabilityService.verifyCarOwnership(
      createCarAvailabilityDto.carId,
      req.user.sub,
    );

    if (!canManage) {
      throw new ForbiddenException(
        'You can only manage availability for your own cars',
      );
    }

    return this.carAvailabilityService.create(createCarAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.carAvailabilityService.findAll();
  }

  @Get('car/:carId')
  findByCarId(@Param('carId', ParseIntPipe) carId: number) {
    return this.carAvailabilityService.findByCarId(carId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carAvailabilityService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarAvailabilityDto: UpdateCarAvailabilityDto,
    @Request() req,
  ) {
    // Get the car from the availability record and verify ownership
    const car = await this.carAvailabilityService.getCarFromAvailability(id);
    const canManage = await this.carAvailabilityService.verifyCarOwnership(
      car.id,
      req.user.sub,
    );

    if (!canManage) {
      throw new ForbiddenException(
        'You can only manage availability for your own cars',
      );
    }

    return this.carAvailabilityService.update(id, updateCarAvailabilityDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Get the car from the availability record and verify ownership
    const car = await this.carAvailabilityService.getCarFromAvailability(id);
    const canManage = await this.carAvailabilityService.verifyCarOwnership(
      car.id,
      req.user.sub,
    );

    if (!canManage) {
      throw new ForbiddenException(
        'You can only manage availability for your own cars',
      );
    }

    return this.carAvailabilityService.remove(id);
  }
}
