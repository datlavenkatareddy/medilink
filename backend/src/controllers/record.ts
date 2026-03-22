import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getMedicalRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patientId = Number(req.params.patientId);
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: { hospital: { select: { name: true } } }
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPatientRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patientId = req.user!.userId;
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: { 
        hospital: { select: { name: true } }
      }
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDiagnosisReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patientId = Number(req.params.patientId);
    const reports = await prisma.diagnosisReport.findMany({
      where: { patientId },
      include: { hospital: { select: { name: true } } }
    });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
