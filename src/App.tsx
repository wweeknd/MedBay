import React, { useState, useCallback } from 'react'; // useState/useCallback kept for IntroAnimation
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import IntroAnimation from './components/IntroAnimation';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import MedicalRecords from './pages/patient/MedicalRecords';
import MedicineTracker from './pages/patient/MedicineTracker';
import FindDoctors from './pages/patient/FindDoctors';
import PatientConsultations from './pages/patient/Consultations';
import EmergencyCard from './pages/patient/EmergencyCard';
import PatientProfilePage from './pages/patient/Profile';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorConsultations from './pages/doctor/Consultations';
import PatientRecords from './pages/doctor/PatientRecords';
import Reviews from './pages/doctor/Reviews';
import Messaging from './pages/messaging/Messaging';
import ForgotPassword from './pages/ForgotPassword';
import Legal from './pages/Legal';
import AboutRouter from './pages/About';
import AccountSettings from './pages/AccountSettings';
import NotFound from './pages/NotFound';

const PUBLIC_PATHS = ['/', '/login', '/register'];

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const showChrome = isAuthenticated && !isPublicPage;

  return (
    <>
      {showChrome && <Navbar />}
      <div className="page-layout">
        <main className={`page-content ${!showChrome ? 'no-navbar' : ''}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/patient/dashboard" element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute allowedRole="patient"><PatientProfilePage /></ProtectedRoute>} />
            <Route path="/patient/records" element={<ProtectedRoute allowedRole="patient"><MedicalRecords /></ProtectedRoute>} />
            <Route path="/patient/medicines" element={<ProtectedRoute allowedRole="patient"><MedicineTracker /></ProtectedRoute>} />
            <Route path="/patient/find-doctors" element={<ProtectedRoute allowedRole="patient"><FindDoctors /></ProtectedRoute>} />
            <Route path="/patient/consultations" element={<ProtectedRoute allowedRole="patient"><PatientConsultations /></ProtectedRoute>} />
            <Route path="/patient/emergency-card" element={<ProtectedRoute allowedRole="patient"><EmergencyCard /></ProtectedRoute>} />
            <Route path="/patient/messages" element={<ProtectedRoute allowedRole="patient"><Messaging /></ProtectedRoute>} />

            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute allowedRole="doctor"><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/profile/:doctorId" element={<DoctorProfile />} />
            <Route path="/doctor/consultations" element={<ProtectedRoute allowedRole="doctor"><DoctorConsultations /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRole="doctor"><PatientRecords /></ProtectedRoute>} />
            <Route path="/doctor/reviews" element={<ProtectedRoute allowedRole="doctor"><Reviews /></ProtectedRoute>} />
            <Route path="/doctor/messages" element={<ProtectedRoute allowedRole="doctor"><Messaging /></ProtectedRoute>} />

            {/* Public Info Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="/privacy" element={<Legal />} />
            <Route path="/about" element={<AboutRouter />} />
            <Route path="/contact" element={<AboutRouter />} />

            {/* Common Protected Routes */}
            <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <Router>
      <AuthProvider>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        {!showIntro && <AppContent />}
      </AuthProvider>
    </Router>
  );
};

export default App;
