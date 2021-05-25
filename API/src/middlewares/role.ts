import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { Users } from '../entity/Users';
import { Messages as sms } from '../utils/message';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals.jwtPayload;
    const userRepository = getRepository(Users);
    let user: Users;

    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (e) {
      return res.status(401).json({ message: sms.SMS_NOT_AUTHORIZED });
    }

    //Check
    const { role } = user;
    if (roles.includes(role)) {
      next();
    } else {
      res.status(401).json({ message: sms.SMS_NOT_AUTHORIZED });
    }
  };
};
