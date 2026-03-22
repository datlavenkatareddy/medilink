import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ today: 0, upcoming: 0 });

  useEffect(() => {
    const fetchApts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({ today: res.data.length, upcoming: res.data.length });
      } catch (err) {}
    };
    if (token) fetchApts();
  }, [token]);

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">Welcome, Dr. {user?.name}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="glass-card text-center">
          <h3 className="text-muted mb-2">Today's Appointments</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)' }}>{stats.today}</h1>
        </div>
        <div className="glass-card text-center">
          <h3 className="text-muted mb-2">Pending Reports</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--secondary)' }}>0</h1>
        </div>
      </div>
    </div>
  );
};
