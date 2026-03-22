import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      login(token, user);

      // Role-based redirect
      switch(user.role) {
        case 'patient': navigate('/patient/dashboard'); break;
        case 'doctor': navigate('/doctor/dashboard'); break;
        case 'hospital_admin': navigate('/hospital-admin/dashboard'); break;
        case 'system_admin': navigate('/system-admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', backgroundImage: 'url(/hospital.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(240, 249, 255, 0.85)', backdropFilter: 'blur(8px)' }}></div>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Medilink Logo" style={{ height: '60px', marginBottom: '1rem' }} />
          <h2>Welcome to Medilink</h2>
          <p className="text-muted">Seamless Healthcare Connections</p>
        </div>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted text-sm">
            Don't have an account? <Link to="/register" className="text-primary" style={{ fontWeight: 600 }}>Register as Patient</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
