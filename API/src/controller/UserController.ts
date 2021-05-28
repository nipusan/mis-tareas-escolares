import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Users } from '../entity/Users';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';

export class UserController {
  static getAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    let users;

    try {
      users = await userRepository.find({ select: ['id', 'username', 'role', 'names', 'surnames', 'documentType', 'document'] });
    } catch (e) {
      res.status(404).json({ message: 'Somenthing goes wrong!' });
    }

    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(Users);
    try {
      const user = await userRepository.findOneOrFail(id);
      res.send(user);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static new = async (req: Request, res: Response) => {
    const { username, password, role, names, surnames, documentType, document } = req.body;
    const user = new Users();

    user.username = username;
    user.password = password;
    user.role = role;
    user.names = names;
    user.surnames = surnames;
    user.documentType = documentType;
    user.document = document;

    // Validate
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // TODO: HASH PASSWORD

    const userRepository = getRepository(Users);
    try {
      user.hashPassword();
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).json({ message: 'Username already exist' });
    }
    // All ok
    res.send('User created');
  };

  static edit = async (req: Request, res: Response) => {
    let user;
    const { id } = req.params;
    const { username, role, names, surnames, documentType, document } = req.body;

    const userRepository = getRepository(Users);
    // Try get user
    try {
      user = await userRepository.createQueryBuilder("Users")
      .addSelect("Users.password")
      .where("Users.id = :id", { id: id }).getOne();
      user.username = username;
      user.role = role;
      user.names = names;
      user.surnames = surnames;
      user.documentType = documentType;
      user.document = document;
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }

    //  ValidateAdminChanges
    const token = <string>req.headers['auth'];
    const data = jwt.decode(token);

    try {
      const userP = await userRepository.findOneOrFail(data['userId']);
      if (user.role === 'admin' && userP.role !== 'admin') {
        return res.status(401).json({ message: 'Not Authorized' });
      }
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
    // end ValidateAdminChanges

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save user
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    res.status(201).json({ message: 'User update' });
  };

  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(Users);
    let user: Users;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }

    //  ValidateAdminChanges
    const token = <string>req.headers['auth'];
    const data = jwt.decode(token);

    try {
      const userP = await userRepository.findOneOrFail(data['userId']);
      if (user.role === 'admin' && userP.role !== 'admin') {
        return res.status(401).json({ message: 'Not Authorized' });
      }
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
    // end ValidateAdminChanges

    // Remove user
    userRepository.delete(id);
    res.status(201).json({ message: ' User deleted' });
  };
}

export default UserController;
