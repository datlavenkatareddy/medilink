import { Router } from 'express';
import { 
  bookAppointment, 
  getPatientAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus, 
  addPrescription 
} from '../controllers/appointment';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, requireRole(['patient']), bookAppointment);
router.get('/patient', authenticateToken, requireRole(['patient']), getPatientAppointments);
router.get('/doctor', authenticateToken, requireRole(['doctor']), getDoctorAppointments);
router.put('/:id/status', authenticateToken, requireRole(['doctor', 'hospital_admin']), updateAppointmentStatus);
router.post('/:id/prescription', authenticateToken, requireRole(['doctor']), addPrescription);

export default router;
