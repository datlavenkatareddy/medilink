import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { PatientDashboard } from './pages/Patient/PatientDashboard';
import { HospitalInfo } from './pages/Patient/HospitalInfo';
import { PatientAppointments } from './pages/Patient/PatientAppointments';
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { DoctorAppointments } from './pages/Doctor/DoctorAppointments';
import { HospitalAdminDashboard } from './pages/HospitalAdmin/HospitalAdminDashboard';
import { SystemAdminDashboard } from './pages/SystemAdmin/SystemAdminDashboard';
import { MedicalRecords } from './pages/Patient/MedicalRecords';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="app-container" style={{justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="main-content">
    <div className="glass-card text-center mt-8">
      <h2>{title}</h2>
      <p className="text-muted">This page is under construction.</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <div className="app-container">
      <Navbar />
      <img src="/logo.png" className="watermark-bg" alt="" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/hospital/:id" element={<ProtectedRoute allowedRoles={['patient']}><HospitalInfo /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><PatientAppointments /></ProtectedRoute>} />
        <Route path="/patient/records" element={<ProtectedRoute allowedRoles={['patient']}><MedicalRecords /></ProtectedRoute>} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/hospital-admin/dashboard" element={<ProtectedRoute allowedRoles={['hospital_admin']}><HospitalAdminDashboard /></ProtectedRoute>} />
        <Route path="/system-admin/dashboard" element={<ProtectedRoute allowedRoles={['system_admin']}><SystemAdminDashboard /></ProtectedRoute>} />
        
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
