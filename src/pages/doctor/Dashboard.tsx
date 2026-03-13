import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockConsultations, mockReviews } from '../../data/mockData';
import type { DoctorProfile } from '../../types';
import PageSkeleton from '../../components/PageSkeleton';
import {
  Users, CalendarCheck, Star, MessageSquare, Clock, TrendingUp,
  CheckCircle, XCircle, ChevronRight, BarChart3, Activity
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const doctor = user as DoctorProfile;

  const userConsultations = mockConsultations.filter(c => c.doctorId === doctor.uid);
  const pendingConsultations = userConsultations.filter(c => c.status === 'pending');
  const activeConsultations = userConsultations.filter(c => c.status === 'accepted');
  const completedConsultations = userConsultations.filter(c => c.status === 'completed');
  
  const userReviews = mockReviews.filter(r => r.doctorId === doctor.uid);

  return (
    <PageSkeleton delay={500}>
    <div className="page-inner">
      {/* ── Hero gradient welcome banner ── */}
      <div className="dashboard-hero dashboard-hero-doctor animate-fade-in">
        <div className="dashboard-hero-inner">
          <div className="dashboard-hero-text">
            <p className="dashboard-hero-eyebrow">Doctor Portal</p>
            <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, <span>Dr. {doctor.displayName.split(' ').pop()}</span> ⚕️</h1>
            <p className="dashboard-hero-sub">Here's your practice overview and pending actions.</p>
          </div>
          <div className="dashboard-hero-date">
            <Clock size={15} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="dashboard-hero-orb" />
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card animate-fade-in-up stagger-1">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
            <Clock size={24} style={{ color: 'var(--warning-400)' }} />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning-400)' }}>{pendingConsultations.length}</div>
          <div className="stat-label">Pending Requests</div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <CalendarCheck size={24} style={{ color: 'var(--success-400)' }} />
          </div>
          <div className="stat-value">{activeConsultations.length}</div>
          <div className="stat-label">Active Consultations</div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
            <Users size={24} style={{ color: 'var(--primary-400)' }} />
          </div>
          <div className="stat-value">{completedConsultations.length}</div>
          <div className="stat-label">Patients Treated</div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-4">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
            <Star size={24} style={{ color: 'var(--accent-400)' }} />
          </div>
          <div className="stat-value">{doctor.rating}</div>
          <div className="stat-label">{doctor.totalReviews} Reviews</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Pending Consultation Requests */}
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="card-header" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3><Clock size={20} style={{ color: 'var(--warning-400)' }} /> Pending Requests</h3>
            <Link to="/doctor/consultations" className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></Link>
          </div>
          {pendingConsultations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {pendingConsultations.map(consult => (
                <div key={consult.id} className="pending-request-item">
                  <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--success-500), var(--primary-500))' }}>
                    {consult.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{consult.patientName}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{consult.reason}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                      {new Date(consult.preferredDate).toLocaleDateString()} at {consult.preferredTime}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-success btn-sm"><CheckCircle size={14} /> Accept</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error-400)' }}><XCircle size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <CheckCircle size={40} style={{ color: 'var(--success-400)' }} />
              <h4>All caught up!</h4>
              <p>No pending consultation requests.</p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <div className="card-header" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3><Star size={20} style={{ color: 'var(--warning-400)' }} /> Recent Reviews</h3>
            <Link to="/doctor/reviews" className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {userReviews.slice(0, 3).map(review => (
              <div key={review.id} className="review-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                      {review.patientName.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{review.patientName}</span>
                  </div>
                  <div className="star-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={`star ${i < review.rating ? 'filled' : 'empty'}`} fill={i < review.rating ? 'var(--warning-400)' : 'none'} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{review.comment}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card animate-fade-in-up" style={{ marginTop: 'var(--space-2xl)', animationDelay: '0.35s', opacity: 0 }}>
        <div className="card-header" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3><Activity size={20} style={{ color: 'var(--primary-400)' }} /> Quick Actions</h3>
        </div>
        <div className="grid-3">
          <Link to="/doctor/consultations" className="quick-action-item doctor-action" id="dqa-consultations">
            <div className="quick-action-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
              <CalendarCheck size={22} style={{ color: 'var(--primary-400)' }} />
            </div>
            <span>Manage Consultations</span>
            <ChevronRight size={16} className="quick-action-arrow" />
          </Link>
          <Link to="/doctor/patients" className="quick-action-item doctor-action" id="dqa-patients">
            <div className="quick-action-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Users size={22} style={{ color: 'var(--success-400)' }} />
            </div>
            <span>Patient Records</span>
            <ChevronRight size={16} className="quick-action-arrow" />
          </Link>
          <Link to="/doctor/messages" className="quick-action-item doctor-action" id="dqa-messages">
            <div className="quick-action-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <MessageSquare size={22} style={{ color: 'var(--accent-400)' }} />
            </div>
            <span>Messages</span>
            <ChevronRight size={16} className="quick-action-arrow" />
          </Link>
        </div>
      </div>
    </div>
    </PageSkeleton>
  );
};

export default DoctorDashboard;
