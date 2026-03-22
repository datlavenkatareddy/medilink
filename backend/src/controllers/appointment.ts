import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const bookAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId, hospitalId, time } = req.body;
    const userId = req.user?.userId;

    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      res.status(404).json({ error: 'Patient profile not found' });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: Number(doctorId),
        hospitalId: Number(hospitalId),
        time: new Date(time),
        status: 'scheduled'
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPatientAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: { include: { user: { select: { name: true } }, department: true } },
        hospital: { select: { name: true, location: true } },
        prescriptions: true
      },
      orderBy: { time: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        prescriptions: true
      },
      orderBy: { time: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status }
    });
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addPrescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { details } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId: Number(id),
        details
      }
    });
    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
