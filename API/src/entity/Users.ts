import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Column({select: false})
  @MinLength(6)
  @IsNotEmpty()
  password: string;

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
  @IsNotEmpty()
  role: string;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
