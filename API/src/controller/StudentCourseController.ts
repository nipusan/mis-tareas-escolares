import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { StudentCourse } from '../entity/StudentCourse';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';
import { Messages as sms } from '../utils/message';
import { Entity } from '../utils/entity';

export class StudentCourseController {


  /**
   * Select All
   *
   * Allows to consult all StudentCourse
   *
   * @param req Request
   * @param res Response
   */
  static getAll = async (req: Request, res: Response) => {
    const studentCourseRepository = getRepository(StudentCourse);
    let data;
    try {
      data = await studentCourseRepository.createQueryBuilder('StudentCourse')
        .leftJoinAndSelect("StudentCourse.student", "student")
        .leftJoinAndSelect("StudentCourse.course", "course").getMany();

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
   * Allows to consult StudentCourse by identification
   *
   * @param req Request
   * @param res Response
   */
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentCourseRepository = getRepository(StudentCourse);
    try {
      const data = await studentCourseRepository.findOneOrFail(id);
      res.send(data);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select Students By Course
   *
   * Allows to consult StudentCourse by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getStudentsByCourse = async (req: Request, res: Response) => {

    const { id } = req.params;

    const studentCourseRepository = getRepository(StudentCourse);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("StudentCourse")
        .leftJoinAndSelect("StudentCourse.student", "student")
        //.leftJoinAndSelect("StudentCourse.course", "users")
        .where("StudentCourse.course = :id", { id: id }).getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };

  /**
   *  Select Courses By Student
   *
   * Allows to consult StudentCourse by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getCoursesByStudent = async (req: Request, res: Response) => {

    const { id } = req.params;

    const studentCourseRepository = getRepository(StudentCourse);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("StudentCourse")
        //.leftJoinAndSelect("StudentCourse.student", "student")
        .leftJoinAndSelect("StudentCourse.course", "users")
        .where("StudentCourse.student = :id", { id: id }).getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   * Insert new StudentCourse
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static new = async (req: Request, res: Response) => {
    const { student, course } = req.body;

    const item = new StudentCourse();
    item.student = student;
    item.course = course;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(item, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const studentCourseRepository = getRepository(StudentCourse);
    try {
      //validate student and course
      const exist = await studentCourseRepository.find({ where: { "course": course, "student": student } })

      if (exist === null || exist.length === 0) {
        await studentCourseRepository.save(item);
      } else {
        throw new BadRequestException(sms.ALREADY_EXIST(Entity.STUDENT_COURSE));
      }

    } catch (e) {
      console.error(e);
      if (e instanceof BadRequestException) {
        return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.STUDENT_COURSE) });
      }
      return res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }

    res.status(201).json({ message: sms.CREATED(Entity.STUDENT_COURSE) });
  };




  /**
   * Update StudentCourse
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static edit = async (req: Request, res: Response) => {
    let item;
    const { id } = req.params;
    const { student, course } = req.body;
    const studentCourseRepository = getRepository(StudentCourse);

    // Try get studentCourse
    try {
      item = await studentCourseRepository.findOneOrFail(id);
      item.student = student;
      item.course = course;

    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.STUDENT_COURSE) });
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(item, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save studentCourse
    try {
      await studentCourseRepository.save(item);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.STUDENT_COURSE) });
    }

    res.status(201).json({ message: sms.UPDATED(Entity.STUDENT_COURSE) });
  };





  /**
    * Delete StudentCourse
    *
    * @param req Request
    * @param res Response
    * @returns
    */
  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentCourseRepository = getRepository(StudentCourse);

    try {
      await studentCourseRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.STUDENT_COURSE) });
    }

    // Remove studentCourse
    studentCourseRepository.delete(id);
    res.status(201).json({ message: sms.DELETED(Entity.STUDENT_COURSE) });
  };


}

export default StudentCourseController;
