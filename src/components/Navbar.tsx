import React, { useState, useCallback, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bell, LogOut, User, Settings, ChevronDown,
  Stethoscope, Heart, Check,
  LayoutDashboard, FileText, Pill, CalendarCheck, MessageSquare,
  Search, CreditCard, Star, ClipboardList
} from 'lucide-react';
import MinecraftHeart from './MinecraftHeart';
import Breadcrumb from './Breadcrumb';

interface Notification {
  id: string;
  icon: React.ReactNode;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    icon: <Stethoscope size={16} style={{ color: 'var(--primary-400)' }} />,
    message: 'Dr. Sarah Chen sent a new message',
    time: '2 hours ago',
    read: false,
    link: '/patient/messages',
  },
  {
    id: 'n2',
    icon: <Heart size={16} style={{ color: 'var(--success-400)' }} />,
    message: 'Your consultation request was accepted',
    time: '5 hours ago',
    read: false,
    link: '/patient/consultations',
  },
  {
    id: 'n3',
    icon: <Bell size={16} style={{ color: 'var(--warning-400)' }} />,
    message: 'Medication reminder: Lisinopril 10mg',
    time: '1 day ago',
    read: true,
    link: '/patient/medicines',
  },
];

const Navbar: React.FC<{ onToggleSidebar?: () => void }> = () => {
  const { user, userRole, logout, switchRole } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll-aware shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleNotificationClick = useCallback((notif: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    navigate(notif.link);
  }, [navigate]);

  if (isPublicPage) return null;

  const profileLink = userRole === 'patient' ? '/patient/profile' : '/doctor/profile';

  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/records', icon: FileText, label: 'Records' },
    { to: '/patient/medicines', icon: Pill, label: 'Medicines' },
    { to: '/patient/find-doctors', icon: Search, label: 'Find Doctors' },
    { to: '/patient/consultations', icon: CalendarCheck, label: 'Consultations' },
    { to: '/patient/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/patient/emergency-card', icon: CreditCard, label: 'Emergency' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/consultations', icon: CalendarCheck, label: 'Consultations' },
    { to: '/doctor/patients', icon: ClipboardList, label: 'Patients' },
    { to: '/doctor/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/doctor/reviews', icon: Star, label: 'Reviews' },
  ];

  const links = userRole === 'patient' ? patientLinks : doctorLinks;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      {/* ── Top bar ── */}
      <div className="navbar-top-bar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <MinecraftHeart size={26} />
            </div>
            <span className="navbar-brand-text">Med<span className="gradient-text">Bay</span></span>
          </Link>
        </div>

        <div className="navbar-right">
          {/* Demo Role Switcher */}
          {(user?.email === 'patient@medbay.com' || user?.email === 'doctor@medbay.com') && (
            <div className="demo-switcher">
              <button
                className={`demo-switch-btn ${userRole === 'patient' ? 'active' : ''}`}
                onClick={() => { switchRole('patient'); navigate('/patient/dashboard'); }}
                id="switch-to-patient"
              >
                <User size={14} /> Patient
              </button>
              <button
                className={`demo-switch-btn ${userRole === 'doctor' ? 'active' : ''}`}
                onClick={() => { switchRole('doctor'); navigate('/doctor/dashboard'); }}
                id="switch-to-doctor"
              >
                <Stethoscope size={14} /> Doctor
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className="navbar-notification-wrapper">
            <button
              className="btn-icon navbar-notification"
              onClick={() => setShowNotifications(!showNotifications)}
              id="notification-btn"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-dot" />}
            </button>
            {showNotifications && (
              <div className="notification-dropdown glass-card">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 ? (
                    <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
                      <Check size={12} /> Mark all read
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>All caught up!</span>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <div className="notification-icon" style={{
                        background: notif.id === 'n1' ? 'rgba(6, 182, 212, 0.15)' :
                          notif.id === 'n2' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                      }}>
                        {notif.icon}
                      </div>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="navbar-profile-wrapper">
            <button
              className="navbar-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              id="profile-menu-btn"
            >
              <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="navbar-profile-info">
                <span className="navbar-profile-name">{user?.displayName}</span>
                <span className="navbar-profile-role">{userRole === 'patient' ? 'Patient' : 'Doctor'}</span>
              </div>
              <ChevronDown size={14} />
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown glass-card">
                <Link to={profileLink} className="profile-dropdown-item" onClick={() => setShowProfileMenu(false)}>
                  <User size={16} /> My Profile
                </Link>
                <Link to="/settings" className="profile-dropdown-item" onClick={() => setShowProfileMenu(false)}>
                  <Settings size={16} /> Settings
                </Link>
                <hr className="profile-dropdown-divider" />
                <button className="profile-dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="btn-icon navbar-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* ── Nav tabs row ── */}
      <div className={`navbar-tabs-row ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-tabs">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-tab ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── Breadcrumb row ── */}
      <Breadcrumb />

      {/* Click outside overlay */}
      {(showProfileMenu || showNotifications) && (
        <div className="dropdown-overlay" onClick={() => { setShowProfileMenu(false); setShowNotifications(false); }} />
      )}
    </nav>
  );
};

export default Navbar;
