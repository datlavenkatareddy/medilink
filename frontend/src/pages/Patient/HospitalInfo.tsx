import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const HospitalInfo = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hospitals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHospital(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id, token]);

  const handleBook = async (doctorId: number) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      await axios.post('http://localhost:5000/api/appointments', {
        doctorId,
        hospitalId: Number(id),
        time: tomorrow.toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;
  if (!hospital) return <div className="main-content">Hospital not found</div>;

  return (
    <div className="main-content">
      <div className="glass-card mb-8" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <img src={hospital.image || '/hospital.png'} alt={hospital.name} style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }} />
        <div>
          <h1 className="text-primary">{hospital.name}</h1>
          <p className="text-muted text-lg mb-4">{hospital.location}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Array.from(new Set(hospital.doctors.map((d: any) => d.department.name))).map((dept: any) => (
              <span key={dept} style={{ backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' }}>
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h3 className="mb-4">Available Doctors</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {hospital.doctors.map((doctor: any) => (
          <div key={doctor.id} className="glass-card" style={{ padding: '1.5rem' }}>
            <h4>Dr. {doctor.user.name}</h4>
            <p className="text-primary text-sm mb-4">{doctor.department.name}</p>
            <button className="btn-primary w-full" onClick={() => handleBook(doctor.id)}>
              Book Appointment
            </button>
          </div>
        ))}
        {hospital.doctors.length === 0 && <p className="text-muted">No doctors available at this hospital.</p>}
      </div>
    </div>
  );
};
