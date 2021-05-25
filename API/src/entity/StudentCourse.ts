import { Student } from './Student';
import { Course } from './Course';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.id)
  student: Student;

  @ManyToOne(() => Course, course => course.id)
  course: Course;

}
