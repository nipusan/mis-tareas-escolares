import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { StudentController } from '../controller/StudentController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], StudentController.getAll);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], StudentController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], StudentController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], StudentController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], StudentController.delete);

export default router;
