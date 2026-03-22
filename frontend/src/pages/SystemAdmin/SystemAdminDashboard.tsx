import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const SystemAdminDashboard = () => {
  const { token } = useAuth();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [newHospital, setNewHospital] = useState({ name: '', location: '', image: '/hospital.png' });

  const fetchHospitals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hospitals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchHospitals();
  }, [token]);

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/hospitals', newHospital, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hospital registered successfully');
      setNewHospital({ name: '', location: '', image: '/hospital.png' });
      fetchHospitals();
    } catch (err) {
      alert('Failed to register hospital');
    }
  };

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">System Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1 1 400px' }}>
          <h3 className="mb-4">Register New Hospital</h3>
          <form onSubmit={handleCreateHospital}>
            <div className="mb-4">
              <label className="form-label">Hospital Name</label>
              <input className="input-field" value={newHospital.name} onChange={e => setNewHospital({...newHospital, name: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Location</label>
              <input className="input-field" value={newHospital.location} onChange={e => setNewHospital({...newHospital, location: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Image URL</label>
              <input className="input-field" value={newHospital.image} onChange={e => setNewHospital({...newHospital, image: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary w-full">Register Hospital</button>
          </form>
        </div>

        <div className="glass-card" style={{ flex: '2 1 600px' }}>
          <h3 className="mb-4">Active Hospitals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hospitals.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={h.image || '/hospital.png'} alt="hospital" style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div>
                    <strong>{h.name}</strong>
                    <p className="text-sm text-muted">{h.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span style={{ fontSize: '0.75rem', backgroundColor: h.isActive ? '#dcfce3' : '#fee2e2', color: h.isActive ? '#166534' : '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                    {h.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {hospitals.length === 0 && <p className="text-muted">No hospitals found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
