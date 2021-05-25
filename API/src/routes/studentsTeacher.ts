import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { StudentsTeacherController } from '../controller/StudentsTeacherController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.getAll);

// Get My StudentsTeachers
router.get('/my-students', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.getMyStudents);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], StudentsTeacherController.delete);

export default router;
