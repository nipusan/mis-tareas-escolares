import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Course } from './Course';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 45 })
  @IsNotEmpty()
  name: string;

  @Column({type:"varchar", length:500})
  @IsOptional()
  content: string;

  @Column()
  @IsNotEmpty()
  startDate: Date;

  @Column()
  @IsOptional()
  endDate: Date;

  @ManyToOne(() => Course, course => course.id)
  course: Course;

}
