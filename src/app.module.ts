import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AdminModule } from './admin/admin.module';
import { CarsModule } from './cars/cars.module';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Role } from './entities/Role';
import { Permission } from './entities/Permission';
import { Car } from './entities/Car';
import { CarOwner } from './entities/CarOwner';
import { CarBooking } from './entities/CarBooking';
import { CarAvailable } from './entities/CarAvaliable';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    AdminModule,
    CarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configurations],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Hyg57aff',
      database: 'renta',
      entities: [
        User,
        Role,
        Permission,
        Car,
        CarOwner,
        CarBooking,
        CarAvailable,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
