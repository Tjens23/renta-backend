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
import { CarOwnersService } from './car-owners.service';
import { CreateCarOwnerDto, UpdateCarOwnerDto } from './dto/car-owner.dto';

@Controller('car-owners')
export class CarOwnersController {
  constructor(private readonly carOwnersService: CarOwnersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarOwnerDto: CreateCarOwnerDto) {
    return this.carOwnersService.create(createCarOwnerDto);
  }

  @Get()
  findAll() {
    return this.carOwnersService.findAll();
  }

  @Get('top-rated')
  getTopRated(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.carOwnersService.getTopRated(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carOwnersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarOwnerDto: UpdateCarOwnerDto,
  ) {
    return this.carOwnersService.update(id, updateCarOwnerDto);
  }

  @Patch(':id/rating')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body('rating') rating: number,
  ) {
    return this.carOwnersService.updateRating(id, rating);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carOwnersService.remove(id);
  }
}
