import { Router } from 'express';
import { getMedicalRecords, getDiagnosisReports, getPatientRecords } from '../controllers/record';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/patient', authenticateToken, getPatientRecords);
router.get('/medical/:patientId', authenticateToken, getMedicalRecords);
router.get('/diagnosis/:patientId', authenticateToken, getDiagnosisReports);

export default router;
