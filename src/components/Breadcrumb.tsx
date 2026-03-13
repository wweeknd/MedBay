import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Map route segments to human-readable labels
const ROUTE_LABELS: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  dashboard: 'Dashboard',
  records: 'Medical Records',
  medicines: 'Medicine Tracker',
  'find-doctors': 'Find Doctors',
  consultations: 'Consultations',
  messages: 'Messages',
  'emergency-card': 'Emergency Card',
  profile: 'My Profile',
  patients: 'Patient Records',
  reviews: 'Reviews',
  settings: 'Settings',
  about: 'About',
  contact: 'Contact',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  const isPublicPage = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isPublicPage) return null;

  const segments = location.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // Build crumbs
  const crumbs: { label: string; path: string }[] = [];
  let accumulated = '';

  for (const seg of segments) {
    accumulated += `/${seg}`;
    const label = ROUTE_LABELS[seg] || seg;
    // Skip role segment visually (patient/doctor) — inferred from role
    if (seg === 'patient' || seg === 'doctor') continue;
    crumbs.push({ label, path: accumulated });
  }

  // Home crumb
  const homePath = userRole === 'patient' ? '/patient/dashboard' : '/doctor/dashboard';
  const isOnHome = location.pathname === homePath;

  if (crumbs.length <= 1) return null; // Don't show on dashboard itself

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <Link to={homePath} className="breadcrumb-home" aria-label="Home">
        <Home size={13} />
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight size={13} className="breadcrumb-sep" />
          {i === crumbs.length - 1 ? (
            <span className="breadcrumb-current">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
