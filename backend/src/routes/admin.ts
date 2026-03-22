import { Router } from 'express';
import { addHospital, updateHospitalStatus, addDoctor } from '../controllers/admin';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.post('/hospitals', authenticateToken, requireRole(['system_admin']), addHospital);
router.put('/hospitals/:id/status', authenticateToken, requireRole(['system_admin']), updateHospitalStatus);
router.post('/doctors', authenticateToken, requireRole(['hospital_admin', 'system_admin']), addDoctor);

export default router;
