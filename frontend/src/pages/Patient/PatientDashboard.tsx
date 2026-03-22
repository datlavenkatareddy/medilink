import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const PatientDashboard = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hospitals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHospitals(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitals();
  }, [token]);

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">Patient Dashboard</h1>
      
      <div className="mb-8">
        <h3 className="mb-4">Recommended Hospitals</h3>
        <div className="horizontal-scroll">
          {hospitals.map(h => (
            <div 
              key={h.id} 
              className="glass-card" 
              style={{ minWidth: '300px', cursor: 'pointer' }}
              onClick={() => navigate(`/patient/hospital/${h.id}`)}
            >
              <img src={h.image || '/hospital.png'} alt={h.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
              <h4>{h.name}</h4>
              <p className="text-muted text-sm">{h.location}</p>
            </div>
          ))}
          {hospitals.length === 0 && <p className="text-muted">No hospitals available right now.</p>}
        </div>
      </div>

      <div>
        <h3 className="mb-4">Previously Visited Hospitals</h3>
        <div className="horizontal-scroll">
          <p className="text-muted">You haven't visited any hospitals yet.</p>
        </div>
      </div>
    </div>
  );
};
