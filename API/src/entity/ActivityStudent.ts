import { Student } from './Student';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Activity } from './Activity';
import { IsOptional } from 'class-validator';

@Entity()
export class ActivityStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Activity, activity => activity.id)
  activity: Activity;

  @ManyToOne(() => Student, student => student.id)
  student: Student;

  @Column({type:"varchar", length:500})
  @IsOptional()
  observation: string;

  @Column()
  @IsOptional()
  state: boolean;

}
