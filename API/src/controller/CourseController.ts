import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Course } from '../entity/Course';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { Messages as sms } from '../utils/message';
import { Entity } from '../utils/entity';
import RandomString from '../utils/ramdom-string';

export class CourseController {



  /**
   * Select All
   *
   * Allows to consult all courses
   *
   * @param req Request
   * @param res Response
   */
  static getAll = async (req: Request, res: Response) => {
    const courseRepository = getRepository(Course);
    let course;
    try {
      course = await courseRepository.find({ relations: ['user'] });
    } catch (e) {
      res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }

    if (course.length > 0) {
      res.send(course);
    } else {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }

  };


  /**
   * Select by id
   *
   * Allows to consult courses by identification
   *
   * @param req Request
   * @param res Response
   */
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const courseRepository = getRepository(Course);
    try {
      const course = await courseRepository.findOneOrFail(id);
      res.send(course);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select my courses
   *
   * Allows to consult courses by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getMyCourses = async (req: Request, res: Response) => {

    //  ValidateUserToken
    const token = <string>req.headers['auth'];
    const data = jwt.decode(token);
    const userId = data['userId'];
    // end ValidateUserToken

    const courseRepository = getRepository(Course);

    try {
      const course = await courseRepository
        .createQueryBuilder("course")
        .where("course.userId = :id", { id: userId }).getMany();
      res.send(course);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   * Insert new Course
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static new = async (req: Request, res: Response) => {

    const courseRepository = getRepository(Course);

    const { name, startDate, endDate, state } = req.body;

    const course = new Course();

    const random = new RandomString();
    let code = random.randomString(8, '#aA');
    console.log('generando ramdom string');
    console.log(code);

    const validateCourse = courseRepository.createQueryBuilder('course')
      .where("course.code = :code", { code: code }).getMany();

    if (validateCourse !== null) {
      console.log(validateCourse);
      code = random.randomString(8, '#aA');
      console.log('generando ramdom string');
      console.log(code);
    }

    course.code = code;
    course.name = name;
    course.startDate = startDate;
    course.endDate = endDate;
    if (state === 'true' || state === '1') {
      course.state = true;
    } else {
      course.state = false;
    }

    //  ValidateUserToken
    const token = <string>req.headers['auth'];
    const data = jwt.decode(token);
    const userId = data['userId'];
    // end ValidateUserToken

    course.user = userId;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(course, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }


    try {
      await courseRepository.save(course);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.COURSE) });
    }

    res.status(201).json({ message: sms.CREATED(Entity.COURSE) });
  };




  /**
   * Update Course
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static edit = async (req: Request, res: Response) => {
    let course;
    const { id } = req.params;
    const { name, startDate, endDate, state } = req.body;
    const courseRepository = getRepository(Course);

    // Try get course
    try {
      course = await courseRepository.findOneOrFail(id);
      course.name = name;
      course.startDate = startDate;
      course.endDate = endDate;
      if (state === 'true' || state === '1') {
        course.state = true;
      } else {
        course.state = false;
      }

      console.log('darosa desde backend:');
      console.log(course);


      //  ValidateUserToken
      const token = <string>req.headers['auth'];
      const data = jwt.decode(token);
      const userId = data['userId'];
      // end ValidateUserToken

      course.user = userId;

    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.COURSE) });
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(course, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save course
    try {
      await courseRepository.save(course);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_IN_USE(Entity.COURSE) });
    }

    res.status(201).json({ message: sms.UPDATED(Entity.COURSE) });
  };



  /**
    * Delete Course
    *
    * @param req Request
    * @param res Response
    * @returns
    */
  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const courseRepository = getRepository(Course);
    let course: Course;

    try {
      await courseRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.COURSE) });
    }

    // Remove course
    courseRepository.delete(id);
    res.status(201).json({ message: sms.DELETED(Entity.COURSE) });
  };
}

export default CourseController;
