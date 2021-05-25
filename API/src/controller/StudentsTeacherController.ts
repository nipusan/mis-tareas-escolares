import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { StudentsTeacher } from '../entity/StudentsTeacher';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';
import { Messages as sms } from '../utils/message';
import { Entity } from '../utils/entity';

export class StudentsTeacherController {


  /**
   * Select All
   *
   * Allows to consult all studentsTeachers
   *
   * @param req Request
   * @param res Response
   */
  static getAll = async (req: Request, res: Response) => {
    const studentsTeacherRepository = getRepository(StudentsTeacher);
    let data;
    try {
      data = await studentsTeacherRepository.createQueryBuilder('StudentsTeacher')
        .leftJoinAndSelect("StudentsTeacher.student", "student")
        .leftJoinAndSelect("StudentsTeacher.teacher", "users").getMany();

      console.log(data);

      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).json({ message: sms.SMS_NOT_FOUND });
      }

    } catch (e) {
      res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }
  };


  /**
   * Select by id
   *
   * Allows to consult studentsTeachers by identification
   *
   * @param req Request
   * @param res Response
   */
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentsTeacherRepository = getRepository(StudentsTeacher);
    try {
      const data = await studentsTeacherRepository.findOneOrFail(id);
      res.send(data);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select my studentsTeachers
   *
   * Allows to consult studentsTeachers by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getMyStudents = async (req: Request, res: Response) => {

    //  ValidateUserToken
    const token = <string>req.headers['auth'];
    const dataToken = jwt.decode(token);
    const userId = dataToken['userId'];
    // end ValidateUserToken

    const studentsTeacherRepository = getRepository(StudentsTeacher);

    console.log(userId)
    try {
      const data = await studentsTeacherRepository
        .createQueryBuilder("StudentsTeacher")
        .leftJoinAndSelect("StudentsTeacher.student", "student")
        .leftJoinAndSelect("StudentsTeacher.teacher", "users")
        .where("StudentsTeacher.teacher = :id", { id: userId }).getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   * Insert new StudentsTeacher
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static new = async (req: Request, res: Response) => {
    const { student, teacher } = req.body;

    const item = new StudentsTeacher();
    item.student = student;
    item.teacher = teacher;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(item, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const studentsTeacherRepository = getRepository(StudentsTeacher);
    try {
      //validate student and teacher
      const exist = await studentsTeacherRepository.find({ where: { "teacher": teacher, "student": student } })

      if (exist === null || exist.length === 0) {
        await studentsTeacherRepository.save(item);
      } else {
        throw new BadRequestException(sms.ALREADY_EXIST(Entity.STUDENTS_TEACHER));
      }

    } catch (e) {
      console.error(e);
      if (e instanceof BadRequestException) {
        return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.STUDENTS_TEACHER) });
      }
      return res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }

    res.status(201).json({ message: sms.CREATED(Entity.STUDENTS_TEACHER) });
  };




  /**
   * Update StudentsTeacher
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static edit = async (req: Request, res: Response) => {
    let item;
    const { id } = req.params;
    const { student, teacher } = req.body;
    const studentsTeacherRepository = getRepository(StudentsTeacher);

    // Try get studentsTeacher
    try {
      item = await studentsTeacherRepository.findOneOrFail(id);
      item.student = student;
      item.teacher = teacher;

    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.STUDENTS_TEACHER) });
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(item, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save studentsTeacher
    try {
      await studentsTeacherRepository.save(item);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.STUDENTS_TEACHER) });
    }

    res.status(201).json({ message: sms.UPDATED(Entity.STUDENTS_TEACHER) });
  };





  /**
    * Delete StudentsTeacher
    *
    * @param req Request
    * @param res Response
    * @returns
    */
  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentsTeacherRepository = getRepository(StudentsTeacher);

    try {
      await studentsTeacherRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.STUDENTS_TEACHER) });
    }

    // Remove studentsTeacher
    studentsTeacherRepository.delete(id);
    res.status(201).json({ message: sms.DELETED(Entity.STUDENTS_TEACHER) });
  };


}

export default StudentsTeacherController;
