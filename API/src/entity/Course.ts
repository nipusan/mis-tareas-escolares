import { Entity, PrimaryGeneratedColumn, Unique, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Users } from './Users';

@Entity()
@Unique(['code'])
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, nullable: false })
  code: string;

  @Column({ length: 45, nullable: false })
  name: string;

  @Column({ nullable: false })
  startDate: Date;

  @Column()
  @IsOptional()
  endDate: Date;

  @ManyToOne(() => Users, user => user.id)
  @JoinColumn({ name: 'userId' })
  @ApiProperty()
  user: Users | null;

  @Column()
  @IsOptional()
  state: boolean;

}
