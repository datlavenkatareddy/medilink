import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getAllHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: { isActive: true },
      include: {
        doctors: {
          include: { department: true }
        }
      }
    });
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        doctors: {
          include: { 
            department: true, 
            user: { select: { name: true, email: true } } 
          }
        }
      }
    });
    if (!hospital) {
      res.status(404).json({ error: 'Hospital not found' });
      return;
    }
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, image } = req.body;
    const hospital = await prisma.hospital.create({ data: { name, location, image } });
    res.status(201).json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
