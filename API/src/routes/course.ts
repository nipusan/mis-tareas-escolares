import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { CourseController } from '../controller/CourseController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], CourseController.getAll);

// Get My Courses
router.get('/my-courses', [checkJwt, checkRole(['admin','docente'])], CourseController.getMyCourses);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], CourseController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], CourseController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], CourseController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], CourseController.delete);

export default router;
