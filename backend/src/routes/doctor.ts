import { Router } from 'express';
import { getDoctorsByDepartment, getDoctorSchedule } from '../controllers/doctor';

const router = Router();

router.get('/', getDoctorsByDepartment);
router.get('/:id/schedule', getDoctorSchedule);

export default router;
