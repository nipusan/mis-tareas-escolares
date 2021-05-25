import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Activity } from '../entity/Activity';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { Messages as sms } from '../utils/message';
import { Entity } from '../utils/entity';

export class ActivityController {



  /**
   * Select All
   *
   * Allows to consult all activitys
   *
   * @param req Request
   * @param res Response
   */
  static getAll = async (req: Request, res: Response) => {
    const activityRepository = getRepository(Activity);
    let activity;
    try {
      activity = await activityRepository.find({ relations: ['course'] });
    } catch (e) {
      res.status(404).json({ message: sms.SMS_DEFAULT_ERROR });
    }

    if (activity.length > 0) {
      res.send(activity);
    } else {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }

  };


  /**
   * Select by id
   *
   * Allows to consult activitys by identification
   *
   * @param req Request
   * @param res Response
   */
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const activityRepository = getRepository(Activity);
    try {
      const activity = await activityRepository.findOneOrFail(id);
      res.send(activity);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   *  Select my activitys
   *
   * Allows to consult activitys by user.
   * The user is extracted from the token
   *
   * @param req Request
   * @param res Response
   */
  static getActivitysByCourse = async (req: Request, res: Response) => {

    const { id } = req.params;

    const activityRepository = getRepository(Activity);

    try {
      const activity = await activityRepository
        .createQueryBuilder("activity")
        .where("activity.courseId = :id", { id: id }).getMany();
      res.send(activity);
    } catch (e) {
      res.status(404).json({ message: sms.SMS_NOT_FOUND });
    }
  };


  /**
   * Insert new Activity
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static new = async (req: Request, res: Response) => {
    const { name, content, startDate, endDate, course } = req.body;

    const activity = new Activity();
    activity.name = name;
    activity.content = content;
    activity.startDate = startDate;
    activity.endDate = endDate;
    activity.course = course;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(activity, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const activityRepository = getRepository(Activity);
    try {
      await activityRepository.save(activity);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_EXIST(Entity.ACTIVITY) });
    }

    res.status(201).json({ message: sms.CREATED(Entity.ACTIVITY) });
  };




  /**
   * Update Activity
   *
   * @param req Request
   * @param res Response
   * @returns
   */
  static edit = async (req: Request, res: Response) => {
    let activity;
    const { id } = req.params;
    const { name, content, startDate, endDate, course } = req.body;
    const activityRepository = getRepository(Activity);

    // Try get activity
    try {
      activity = await activityRepository.findOneOrFail(id);
      activity.name = name;
      activity.content = content;
      activity.startDate = startDate;
      activity.endDate = endDate;
      activity.course = course;

    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.ACTIVITY) });
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(activity, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save activity
    try {
      await activityRepository.save(activity);
    } catch (e) {
      return res.status(409).json({ message: sms.ALREADY_IN_USE(Entity.ACTIVITY) });
    }

    res.status(201).json({ message: sms.UPDATED(Entity.ACTIVITY) });
  };



  /**
    * Delete Activity
    *
    * @param req Request
    * @param res Response
    * @returns
    */
  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const activityRepository = getRepository(Activity);
    let activity: Activity;

    try {
      await activityRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: sms.NOT_FOUND(Entity.ACTIVITY) });
    }

    // Remove activity
    activityRepository.delete(id);
    res.status(201).json({ message: sms.DELETED(Entity.ACTIVITY) });
  };

}

export default ActivityController;
