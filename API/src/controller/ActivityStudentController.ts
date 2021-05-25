import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { ActivityStudent } from '../entity/ActivityStudent';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';
import { Messages as sms } from '../utils/message';
import { Entity } from '../utils/entity';

export class ActivityStudentController {


  /**
   * Select All
   *
   * Allows to consult all ActivityStudent
   *
   * @param req Request
   * @param res Response
   */
  static getAll = async (req: Request, res: Response) => {
    const studentCourseRepository = getRepository(ActivityStudent);
    let data;
    try {
      data = await studentCourseRepository.createQueryBuilder('ActivityStudent')
        .leftJoinAndSelect("ActivityStudent.student", "student")
        .leftJoinAndSelect("ActivityStudent.activity", "activity").getMany();

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
   * Allows to consult ActivityStudent by identification
   *
   * @param req Request
   * @param res Response
   */
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentCourseRepository = getRepository(ActivityStudent);
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
   * Allows to consult ActivityStudent by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getStudentsByActivity = async (req: Request, res: Response) => {

    const { id } = req.params;

    const studentCourseRepository = getRepository(ActivityStudent);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("ActivityStudent")
        .leftJoinAndSelect("ActivityStudent.student", "student")
        //.leftJoinAndSelect("ActivityStudent.activity", "users")
        .where("ActivityStudent.activity = :id", { id: id }).getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };

  /**
   *  Select Courses By Student
   *
   * Allows to consult ActivityStudent by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getActivitiesByStudent = async (req: Request, res: Response) => {

    const { id } = req.params;

    const studentCourseRepository = getRepository(ActivityStudent);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("ActivityStudent")
        //.leftJoinAndSelect("ActivityStudent.student", "student")
        .leftJoinAndSelect("ActivityStudent.activity", "users")
        .where("ActivityStudent.student = :id", { id: id }).getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select Courses By documents of Student
   *
   * Allows to consult ActivityStudent by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getActivitiesByStudentDocument = async (req: Request, res: Response) => {

    const { document } = req.params;

    const studentCourseRepository = getRepository(ActivityStudent);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("ActivityStudent")
        .leftJoinAndSelect("ActivityStudent.student", "student")
        .leftJoinAndSelect("ActivityStudent.activity", "users")
        .where("student.document = :document", { document: document })
        .getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select Courses By documents of Student
   *
   * Allows to consult ActivityStudent by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getActivitiesByStudentDocuments = async (req: Request, res: Response) => {

    const { documentType, document } = req.params;

    const studentCourseRepository = getRepository(ActivityStudent);

    try {
      const data = await studentCourseRepository
        .createQueryBuilder("ActivityStudent")
        .leftJoinAndSelect("ActivityStudent.student", "student")
        .leftJoinAndSelect("ActivityStudent.activity", "users")
        .where("student.documentType = :documentType", { documentType: documentType })
        .andWhere("student.document = :document", { document: document })
        .getMany();
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   * Insert new ActivityStudent
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static new = async (req: Request, res: Response) => {
    const { student, activity } = req.body;

    const item = new ActivityStudent();
    item.student = student;
    item.activity = activity;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(item, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const studentCourseRepository = getRepository(ActivityStudent);
    try {
      //validate student and activity
      const exist = await studentCourseRepository.find({ where: { "activity": activity, "student": student } })

      if (exist === null || exist.length === 0) {
        await studentCourseRepository.save(item);
      } else {
        throw new BadRequestException(sms.ALREADY_EXIST(Entity.ACTIVITY_STUDENT));
      }

    } catch (e) {
      console.error(e);
      if (e instanceof BadRequestException) {
        return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.ACTIVITY_STUDENT) });
      }
      return res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }

    res.status(201).json({ message: sms.CREATED(Entity.ACTIVITY_STUDENT) });
  };




  /**
   * Update ActivityStudent
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static edit = async (req: Request, res: Response) => {
    let item;
    const { id } = req.params;
    const { student, activity } = req.body;
    const studentCourseRepository = getRepository(ActivityStudent);

    // Try get studentCourse
    try {
      item = await studentCourseRepository.findOneOrFail(id);
      item.student = student;
      item.activity = activity;

    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.ACTIVITY_STUDENT) });
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
      return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.ACTIVITY_STUDENT) });
    }

    res.status(201).json({ message: sms.UPDATED(Entity.ACTIVITY_STUDENT) });
  };





  /**
    * Delete ActivityStudent
    *
    * @param req Request
    * @param res Response
    * @returns
    */
  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentCourseRepository = getRepository(ActivityStudent);

    try {
      await studentCourseRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.ACTIVITY_STUDENT) });
    }

    // Remove studentCourse
    studentCourseRepository.delete(id);
    res.status(201).json({ message: sms.DELETED(Entity.ACTIVITY_STUDENT) });
  };


}

export default ActivityStudentController;
