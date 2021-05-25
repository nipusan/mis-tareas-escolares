import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { StudentCourseController } from '../controller/StudentCourseController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.getAll);

// Get Students By Course
router.get('/students-by-course/:id', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.getStudentsByCourse);

// Get Courses By Student
router.get('/courses-by-student/:id', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.getCoursesByStudent);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], StudentCourseController.delete);

export default router;
