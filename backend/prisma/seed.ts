import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const sysUser = await prisma.user.upsert({
    where: { email: 'admin@medilink.com' },
    update: {},
    create: { email: 'admin@medilink.com', password, role: 'system_admin', name: 'Super Admin' }
  });
  if (!(await prisma.systemAdmin.findUnique({ where: { userId: sysUser.id } }))) {
    await prisma.systemAdmin.create({ data: { userId: sysUser.id } });
  }

  const hospitalAdminUser = await prisma.user.upsert({
    where: { email: 'hospital@medilink.com' },
    update: {},
    create: { email: 'hospital@medilink.com', password, role: 'hospital_admin', name: 'Hospital Manager' }
  });

  const hospital = await prisma.hospital.create({
    data: { name: 'City Central Hospital', location: 'Downtown, CA', image: '/hospital.png' }
  });

  if (!(await prisma.hospitalAdmin.findUnique({ where: { userId: hospitalAdminUser.id } }))) {
    await prisma.hospitalAdmin.create({ data: { userId: hospitalAdminUser.id, hospitalId: hospital.id } });
  }

  const dept = await prisma.department.create({ data: { name: 'Cardiology' } });
  const dept2 = await prisma.department.create({ data: { name: 'Neurology' } });

  const docUser = await prisma.user.upsert({
    where: { email: 'doctor@medilink.com' },
    update: {},
    create: { email: 'doctor@medilink.com', password, role: 'doctor', name: 'John Doe' }
  });
  if (!(await prisma.doctor.findUnique({ where: { userId: docUser.id } }))) {
    await prisma.doctor.create({
      data: { userId: docUser.id, hospitalId: hospital.id, departmentId: dept.id }
    });
  }

  const patUser = await prisma.user.upsert({
    where: { email: 'patient@medilink.com' },
    update: {},
    create: { email: 'patient@medilink.com', password, role: 'patient', name: 'Jane Smith' }
  });
  if (!(await prisma.patient.findUnique({ where: { userId: patUser.id } }))) {
    await prisma.patient.create({ data: { userId: patUser.id } });
  }

  console.log('Database seeded successfully. Credentials:');
  console.log('System Admin: admin@medilink.com / password123');
  console.log('Hospital Admin: hospital@medilink.com / password123');
  console.log('Doctor: doctor@medilink.com / password123');
  console.log('Patient: patient@medilink.com / password123');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
