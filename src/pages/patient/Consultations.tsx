import React, { useState } from 'react';
import { mockConsultations, mockDoctors } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  CalendarCheck, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronDown, ChevronUp, FileText, MessageSquare, Shield,
  Plus, X
} from 'lucide-react';
import type { ConsultationStatus, AccessLevel } from '../../types';

const statusConfig: Record<ConsultationStatus, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: 'var(--warning-400)', icon: <Clock size={14} />, label: 'Pending' },
  accepted: { color: 'var(--success-400)', icon: <CheckCircle size={14} />, label: 'Accepted' },
  rejected: { color: 'var(--error-400)', icon: <XCircle size={14} />, label: 'Rejected' },
  completed: { color: 'var(--primary-400)', icon: <CheckCircle size={14} />, label: 'Completed' },
  cancelled: { color: 'var(--text-tertiary)', icon: <XCircle size={14} />, label: 'Cancelled' },
};

const accessLabels: Record<AccessLevel, string> = {
  full: 'Full Access',
  limited: 'Limited Access',
  temporary: 'Temporary Access',
};

const Consultations: React.FC = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | ConsultationStatus>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('limited');

  const userConsultations = mockConsultations.filter(c => c.patientId === user?.uid);

  const filtered = activeTab === 'all'
    ? userConsultations
    : userConsultations.filter(c => c.status === activeTab);

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1><CalendarCheck size={28} style={{ color: 'var(--accent-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Consultations</h1>
            <p>Manage your consultation requests and appointments with doctors.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewModal(true)} id="new-consultation-btn">
            <Plus size={16} /> New Consultation
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="tabs animate-fade-in-up stagger-1">
        {(['all', 'pending', 'accepted', 'completed', 'rejected'] as const).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All' : statusConfig[tab].label}
            {tab !== 'all' && (
              <span className="tab-count">{userConsultations.filter(c => c.status === tab).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Consultation Cards */}
      <div className="consultations-list">
        {filtered.map((consult, index) => {
          const config = statusConfig[consult.status];
          return (
            <div key={consult.id} className="glass-card consultation-card animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}>
              <div className="consultation-card-main" onClick={() => setExpanded(expanded === consult.id ? null : consult.id)}>
                <div className="consultation-card-left">
                  <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--primary-500))' }}>
                    {consult.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4>{consult.doctorName}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{consult.doctorSpecialization}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: `${config.color}20`, color: config.color }}>
                        {config.icon} {config.label}
                      </span>
                      <span className="badge badge-neutral">
                        <Shield size={10} /> {accessLabels[consult.accessLevel]}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {new Date(consult.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{consult.preferredTime}</div>
                  </div>
                  {expanded === consult.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expanded === consult.id && (
                <div className="consultation-expanded">
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Reason for Consultation</h5>
                    <p>{consult.reason}</p>
                  </div>
                  {consult.prescription && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--success-400)' }}>
                        <FileText size={16} /> Prescription
                      </h5>
                      <p style={{ color: 'var(--text-secondary)' }}>{consult.prescription}</p>
                    </div>
                  )}
                  {consult.treatmentNotes && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-400)' }}>
                        <AlertCircle size={16} /> Treatment Notes
                      </h5>
                      <p style={{ color: 'var(--text-secondary)' }}>{consult.treatmentNotes}</p>
                    </div>
                  )}
                  <div className="consultation-actions">
                    {consult.status === 'accepted' && (
                      <button className="btn btn-primary btn-sm"><MessageSquare size={14} /> Message Doctor</button>
                    )}
                    {consult.status === 'pending' && (
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error-400)' }}><XCircle size={14} /> Cancel Request</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <CalendarCheck size={64} />
          <h3>No consultations found</h3>
          <p>You haven't made any consultation requests yet.</p>
        </div>
      )}

      {/* New Consultation Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Consultation</h3>
              <button className="btn-icon" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Select Doctor</label>
                <select className="form-select" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} id="consult-doctor">
                  <option value="">Choose a doctor...</option>
                  {mockDoctors.map(d => (
                    <option key={d.uid} value={d.uid}>{d.displayName} — {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Reason for Consultation</label>
                <textarea className="form-textarea" placeholder="Describe your symptoms or reason..." id="consult-reason" />
              </div>
              <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" id="consult-date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <input type="time" className="form-input" id="consult-time" />
                </div>
              </div>

              {/* Access Level Selection */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
                  <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  Medical Record Access Level
                </label>
                <div className="access-level-options">
                  <label className={`access-option ${accessLevel === 'full' ? 'selected' : ''}`}>
                    <input type="radio" name="access" value="full" checked={accessLevel === 'full'} onChange={() => setAccessLevel('full')} />
                    <div className="access-option-content">
                      <strong>Full Access</strong>
                      <p>Doctor can view your complete medical history, records, and medications.</p>
                    </div>
                  </label>
                  <label className={`access-option ${accessLevel === 'limited' ? 'selected' : ''}`}>
                    <input type="radio" name="access" value="limited" checked={accessLevel === 'limited'} onChange={() => setAccessLevel('limited')} />
                    <div className="access-option-content">
                      <strong>Limited Access</strong>
                      <p>Doctor can view basic profile, allergies, and current medications only.</p>
                    </div>
                  </label>
                  <label className={`access-option ${accessLevel === 'temporary' ? 'selected' : ''}`}>
                    <input type="radio" name="access" value="temporary" checked={accessLevel === 'temporary'} onChange={() => setAccessLevel('temporary')} />
                    <div className="access-option-content">
                      <strong>Temporary Access</strong>
                      <p>Access expires 48 hours after the consultation ends.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowNewModal(false)} id="submit-consultation">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;
