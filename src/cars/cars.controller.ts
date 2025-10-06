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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto, CarFilterDto } from './dto/cars.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() createCarDto: CreateCarDto) {
    const ownerId = req.user.sub;
    return this.carsService.create({ ...createCarDto, ownerId });
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
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.carsService.update(id, updateCarDto, userId);
  }

  @Patch(':id/availability')
  @UseGuards(AuthGuard)
  async updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body('isAvailable') isAvailable: boolean,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.carsService.updateAvailability(id, isAvailable, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.sub;
    return this.carsService.remove(id, userId);
  }
}
