import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments/patient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [token]);

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">My Appointments</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(apt => (
          <div key={apt.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 className="mb-1">{apt.hospital.name}</h4>
              <p className="text-sm mb-2">Dr. {apt.doctor.user.name} ({apt.doctor.department.name})</p>
              <span className="text-muted text-sm">{new Date(apt.time).toLocaleString()}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                display: 'inline-block', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '1rem', 
                fontSize: '0.875rem',
                backgroundColor: apt.status === 'scheduled' ? '#dbeafe' : apt.status === 'completed' ? '#dcfce3' : '#fee2e2',
                color: apt.status === 'scheduled' ? '#1e40af' : apt.status === 'completed' ? '#166534' : '#991b1b',
                marginBottom: '0.5rem'
              }}>
                {apt.status.toUpperCase()}
              </span>
              {apt.prescriptions && apt.prescriptions.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p className="text-sm font-semibold text-secondary-dark">Prescription:</p>
                  <p className="text-sm text-muted">{apt.prescriptions[0].details}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="glass-card text-center">
            <p className="text-muted">You have no booked appointments.</p>
          </div>
        )}
      </div>
    </div>
  );
};
