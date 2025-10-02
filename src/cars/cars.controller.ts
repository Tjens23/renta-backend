import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto, CarFilterDto } from './dto/cars.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  /**
   * Get all cars with optional filtering and sorting
   * Supports multiple values for carTypes, makes, and fuelTypes using comma-separated strings
   *
   * Query parameters:
   * - carTypes: Comma-separated list of car types (e.g., "SUV,Van,Truck")
   * - makes: Comma-separated list of car makes (e.g., "Toyota,BMW,Audi")
   * - fuelTypes: Comma-separated list of fuel types (e.g., "Electric,Hybrid")
   * - sort: Sorting option - "Cheapest", "Closest", or "Rating"
   * - userLat/userLng: User's coordinates for "Closest" sorting
   *
   * Legacy single-value parameters are still supported for backward compatibility:
   * - carType, make, fuelType
   */
  @Get()
  findAll(@Query() filters: CarFilterDto) {
    return this.carsService.findAll(filters);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.carsService.searchCars(searchTerm);
  }

  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.carsService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carsService.update(id, updateCarDto);
  }

  @Patch(':id/availability')
  updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.carsService.updateAvailability(id, isAvailable);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}
