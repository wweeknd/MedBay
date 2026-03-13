import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Pill, CalendarCheck, MessageSquare,
  Search, CreditCard, User, Star, ClipboardList, ChevronLeft, ChevronRight, HelpCircle, Settings
} from 'lucide-react';
import MinecraftHeart from './MinecraftHeart';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('medbay_sidebar_collapsed') === 'true';
  });

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  if (isPublicPage) return null;

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('medbay_sidebar_collapsed', String(next));
  };

  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/profile', icon: User, label: 'My Profile' },
    { to: '/patient/records', icon: FileText, label: 'Medical Records' },
    { to: '/patient/medicines', icon: Pill, label: 'Medicine Tracker' },
    { to: '/patient/find-doctors', icon: Search, label: 'Find Doctors' },
    { to: '/patient/consultations', icon: CalendarCheck, label: 'Consultations' },
    { to: '/patient/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/patient/emergency-card', icon: CreditCard, label: 'Emergency Card' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/profile', icon: User, label: 'My Profile' },
    { to: '/doctor/consultations', icon: CalendarCheck, label: 'Consultations' },
    { to: '/doctor/patients', icon: ClipboardList, label: 'Patient Records' },
    { to: '/doctor/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/doctor/reviews', icon: Star, label: 'Reviews' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const links = userRole === 'patient' ? patientLinks : doctorLinks;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`} id="main-sidebar">
        {/* Header with brand */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <MinecraftHeart size={collapsed ? 24 : 22} />
            {!collapsed && <span>Med<span className="gradient-text">Bay</span></span>}
          </div>
          {/* Collapse toggle */}
          <button
            className="btn-icon sidebar-collapse-btn"
            onClick={toggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            id="sidebar-collapse-toggle"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-section-label">
            {userRole === 'patient' ? 'Patient Portal' : 'Doctor Portal'}
          </div>
        )}

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              title={collapsed ? link.label : undefined}
              id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <link.icon size={20} />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-footer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <HelpCircle size={16} style={{ color: 'var(--accent-500)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Need Help?</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                24/7 support available
              </p>
              <Link to="/contact" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
