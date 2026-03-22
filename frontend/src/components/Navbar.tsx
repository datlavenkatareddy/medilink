import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={user ? `/${user.role.replace('_', '-')}/dashboard` : '/'} className="nav-brand">
        <img src="/logo.png" alt="Medilink" />
        Medilink
      </Link>
      
      {user ? (
        <div className="nav-links">
          {user.role === 'patient' && (
            <>
              <Link to="/patient/dashboard" className="nav-link">Hospitals</Link>
              <Link to="/patient/appointments" className="nav-link">My Appointments</Link>
              <Link to="/patient/records" className="nav-link">Medical Records</Link>
            </>
          )}
          {user.role === 'doctor' && (
            <>
              <Link to="/doctor/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/doctor/appointments" className="nav-link">My Appointments</Link>
            </>
          )}
          {user.role === 'hospital_admin' && (
            <Link to="/hospital-admin/dashboard" className="nav-link">Admin Panel</Link>
          )}
          {user.role === 'system_admin' && (
            <Link to="/system-admin/dashboard" className="nav-link">System Panel</Link>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
            <span className="text-muted text-sm flex items-center gap-2">
              <UserIcon size={16} /> 
              {user.name} ({user.role.replace('_', ' ')})
            </span>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
              <LogOut size={16} style={{marginRight: '6px'}}/> Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      )}
    </nav>
  );
};
