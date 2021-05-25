import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['email'])
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  @IsOptional()
  names: string;

  @Column({ length: 45 })
  @IsOptional()
  surnames: string;

  @Column()
  @IsOptional()
  documentType: number;

  @Column()
  @IsOptional()
  document: number;

  @Column({ length: 45 })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

}
