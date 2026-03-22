import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface MedicalRecord {
  id: number;
  date: string;
  description: string;
  hospital: { name: string };
}

export const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/records/patient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(res.data);
      } catch (err: any) {
        setError('Failed to fetch medical records. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRecords();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="glass-card text-center mt-8">
          <p>Loading medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="mb-8 text-primary">Medical Records</h1>
      
      {error && (
        <div className="glass-card mb-4" style={{backgroundColor: '#fee2e2', borderColor: '#ef4444'}}>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {records.map((record) => (
          <div key={record.id} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>{new Date(record.date).toLocaleDateString()}</h4>
              <p className="text-muted">{record.hospital.name}</p>
            </div>
            {record.description && (
              <p><strong>Notes:</strong> {record.description}</p>
            )}
          </div>
        ))}
        {records.length === 0 && !loading && (
          <p className="text-muted">No medical records found.</p>
        )}
      </div>
    </div>
  );
};
