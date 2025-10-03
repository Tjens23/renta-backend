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
} from '@nestjs/common';
import { CarAvailabilityService } from './car-availability.service';
import {
  CreateCarAvailabilityDto,
  UpdateCarAvailabilityDto,
} from './dto/car-availability.dto';

@Controller('car-availability')
export class CarAvailabilityController {
  constructor(
    private readonly carAvailabilityService: CarAvailabilityService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarAvailabilityDto: CreateCarAvailabilityDto) {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarAvailabilityDto: UpdateCarAvailabilityDto,
  ) {
    return this.carAvailabilityService.update(id, updateCarAvailabilityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carAvailabilityService.remove(id);
  }
}
