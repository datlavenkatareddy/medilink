import { Router } from 'express';
import { getAllHospitals, getHospitalById, createHospital } from '../controllers/hospital';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/', authenticateToken, requireRole(['system_admin']), createHospital);

export default router;
