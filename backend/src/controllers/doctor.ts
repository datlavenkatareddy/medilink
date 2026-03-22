import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getDoctorsByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId, hospitalId } = req.query;
    const filter: any = {};
    if (departmentId) filter.departmentId = Number(departmentId);
    if (hospitalId) filter.hospitalId = Number(hospitalId);

    const doctors = await prisma.doctor.findMany({
      where: filter,
      include: {
        user: { select: { name: true, email: true, role: true } },
        department: true,
        hospital: { select: { name: true } }
      }
    });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = Number(req.params.id);
    const schedule = await prisma.doctorSchedule.findMany({
      where: { doctorId }
    });
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
