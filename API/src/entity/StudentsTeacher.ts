import { Student } from './Student';
import { Users } from './Users';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class StudentsTeacher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.id)
  student: Student;

  @ManyToOne(() => Users, teacher => teacher.id)
  teacher: Users;

}
