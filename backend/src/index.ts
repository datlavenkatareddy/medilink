import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth';
import hospitalRoutes from './routes/hospital';
import doctorRoutes from './routes/doctor';
import appointmentRoutes from './routes/appointment';
import adminRoutes from './routes/admin';
import recordRoutes from './routes/record';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Medilink backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/records', recordRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
