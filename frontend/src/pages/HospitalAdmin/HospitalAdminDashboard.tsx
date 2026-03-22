import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const HospitalAdminDashboard = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '', departmentId: 1 });
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchDoctors();
  }, [token]);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/doctors', {
        ...newDoctor,
        hospitalId: 1
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Doctor created successfully');
      setNewDoctor({ name: '', email: '', password: '', departmentId: 1 });
      fetchDoctors();
    } catch (err) {
      alert('Failed to create doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">Hospital Administration</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1 1 400px' }}>
          <h3 className="mb-4">Add New Doctor</h3>
          <form onSubmit={handleCreateDoctor}>
            <div className="mb-4">
              <label className="form-label">Full Name</label>
              <input className="input-field" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input type="email" className="input-field" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Temporary Password</label>
              <input type="password" className="input-field" value={newDoctor.password} onChange={e => setNewDoctor({...newDoctor, password: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Department ID (1-Cardiology)</label>
              <input type="number" className="input-field" value={newDoctor.departmentId} onChange={e => setNewDoctor({...newDoctor, departmentId: Number(e.target.value)})} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>Add Doctor</button>
          </form>
        </div>

        <div className="glass-card" style={{ flex: '2 1 500px' }}>
          <h3 className="mb-4">Hospital Doctors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doctors.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <div>
                  <strong>Dr. {d.user?.name}</strong>
                  <p className="text-sm text-muted">{d.user?.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-secondary text-sm" style={{ backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '1rem'}}>{d.department?.name}</span>
                </div>
              </div>
            ))}
            {doctors.length === 0 && <p className="text-muted">No doctors found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
