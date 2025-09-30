import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CarOwner } from './CarOwner';

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

  @Column({ nullable: true })
  imageUrl: string;

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

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => CarOwner, (owner) => owner.cars, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: CarOwner;

  @Column()
  ownerId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
