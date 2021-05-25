import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { ActivityController } from '../controller/ActivityController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], ActivityController.getAll);

// Get My Activitys
router.get('/activitys-by-course/:id', [checkJwt, checkRole(['admin','docente'])], ActivityController.getActivitysByCourse);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], ActivityController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityController.delete);

export default router;
