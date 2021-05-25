import { Router } from 'express';
import auth from './auth';
import activity from './activity';
import user from './user';
import course from './course';
import student from './student';
import studentsTeacher from './studentsTeacher';
import studentCourse from './studentCourse';
import activityStudent from './activityStudent';

const routes = Router();

routes.use('/auth', auth);
routes.use('/activity', activity);
routes.use('/users', user);
routes.use('/courses', course);
routes.use('/students', student);
routes.use('/students-teacher', studentsTeacher);
routes.use('/students-course', studentCourse);
routes.use('/activity-student', activityStudent);

export default routes;
