import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [activeApt, setActiveApt] = useState<number | null>(null);
  const { token } = useAuth();

  const fetchApts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) { }
  };

  useEffect(() => {
    if (token) fetchApts();
  }, [token]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApt) return;
    try {
      await axios.post(`http://localhost:5000/api/appointments/${activeApt}/prescription`, { details: prescriptionText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptionText('');
      setActiveApt(null);
      alert('Prescription added successfully!');
      fetchApts();
    } catch (err) {
      alert('Failed to add prescription');
    }
  };

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">Provider Schedule</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(apt => (
          <div key={apt.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
            <div style={{ flex: 1.5 }}>
              <h4 className="mb-1">{new Date(apt.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</h4>
              <p className="text-muted text-sm">Patient: {apt.patient.user.name}</p>
              {apt.prescriptions && apt.prescriptions.length > 0 && (
                <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce3', color: '#166534', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>Prescribed</span>
              )}
            </div>
            
            <div style={{ flex: 1, textAlign: 'center' }}>
              <select 
                className="input-field" 
                style={{ width: 'auto', padding: '0.25rem 0.5rem', marginBottom: 0 }}
                value={apt.status}
                onChange={(e) => handleStatusChange(apt.id, e.target.value)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ flex: 1, textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                onClick={() => setActiveApt(activeApt === apt.id ? null : apt.id)}
              >
                {activeApt === apt.id ? 'Cancel' : '+ Rx'}
              </button>
            </div>
          </div>
        ))}
        {appointments.length === 0 && <p className="text-muted">No appointments found.</p>}
      </div>

      {activeApt && (
        <div className="glass-card mt-8" style={{ border: '1px solid var(--primary)' }}>
          <h3 className="mb-4 text-primary">Add Prescription & Notes</h3>
          <form onSubmit={handleAddPrescription}>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="Enter prescription details and medical notes here..."
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              required
            ></textarea>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary">Save Prescription</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
