import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addHospital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, location, image } = req.body;
    const hospital = await prisma.hospital.create({ data: { name, location, image } });
    res.status(201).json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateHospitalStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const hospital = await prisma.hospital.update({
      where: { id: Number(id) },
      data: { isActive }
    });
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, hospitalId, departmentId } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: 'doctor' }
      });
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        hospitalId: Number(hospitalId),
        departmentId: Number(departmentId)
      }
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
