import { checkRole } from '../middlewares/role';
import { checkJwt } from '../middlewares/jwt';
import { ActivityStudentController } from '../controller/ActivityStudentController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getAll);

// Get Students By Activity
router.get('/students-by-activity/:id', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getStudentsByActivity);

// Get Activitys By Student
router.get('/activities-by-student/:id', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getActivitiesByStudent);

// Get Activities By Student Document
router.get('/activities-by-student-document/:document', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getActivitiesByStudentDocument);

// Get Activities By Student Document
router.get('/activities-by-student-document/:documentType/:document', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getActivitiesByStudentDocuments);

// Get one user
router.get('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.new);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.edit);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin','docente'])], ActivityStudentController.delete);

export default router;
