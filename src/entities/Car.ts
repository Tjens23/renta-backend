import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { CarBooking } from './CarBooking';
import { CarAvailable } from './CarAvaliable';

export type CarType =
  | 'Micro Car'
  | 'Medium'
  | 'SUV'
  | 'Mini Bus'
  | 'Truck'
  | 'Van';
export type FuelType = 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';
export type TransmissionType = 'Automatic' | 'Manual';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerKm: number;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  imageBase64: string;

  @Column({
    type: 'enum',
    enum: ['Micro Car', 'Medium', 'SUV', 'Mini Bus', 'Truck', 'Van'],
  })
  carType: CarType;

  @Column({
    type: 'enum',
    enum: ['Electric', 'Petrol', 'Diesel', 'Hybrid'],
  })
  fuelType: FuelType;

  @Column({
    type: 'enum',
    enum: ['Automatic', 'Manual'],
  })
  transmission: TransmissionType;

  @Column()
  seats: number;

  @ManyToOne(() => User, (user) => user.cars, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => CarBooking, booking => booking.car)
  bookings: CarBooking[];

  @OneToMany(() => CarAvailable, available => available.car)
  availabilities: CarAvailable[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
