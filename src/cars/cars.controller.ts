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
