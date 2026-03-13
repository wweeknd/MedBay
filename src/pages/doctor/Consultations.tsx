import React, { useState } from 'react';
import { mockConsultations } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  CalendarCheck, Clock, CheckCircle, XCircle, FileText,
  ChevronDown, ChevronUp, Send, Shield
} from 'lucide-react';
import type { ConsultationStatus } from '../../types';

const statusConfig: Record<ConsultationStatus, { color: string; label: string }> = {
  pending: { color: 'var(--warning-400)', label: 'Pending' },
  accepted: { color: 'var(--success-400)', label: 'Accepted' },
  rejected: { color: 'var(--error-400)', label: 'Rejected' },
  completed: { color: 'var(--primary-400)', label: 'Completed' },
  cancelled: { color: 'var(--text-tertiary)', label: 'Cancelled' },
};

const DoctorConsultations: React.FC = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | ConsultationStatus>('all');
  const [prescription, setPrescription] = useState('');

  const doctorConsultations = mockConsultations.filter(c => c.doctorId === user?.uid);

  const filtered = activeTab === 'all'
    ? doctorConsultations
    : doctorConsultations.filter(c => c.status === activeTab);

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><CalendarCheck size={28} style={{ color: 'var(--primary-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Consultations</h1>
        <p>Manage your consultation requests and communicate with patients.</p>
      </div>

      <div className="tabs animate-fade-in-up stagger-1">
        {(['all', 'pending', 'accepted', 'completed'] as const).map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'all' ? 'All' : statusConfig[tab].label}
          </button>
        ))}
      </div>

      <div className="consultations-list">
        {filtered.map((consult, index) => {
          const config = statusConfig[consult.status];
          return (
            <div key={consult.id} className="glass-card consultation-card animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}>
              <div className="consultation-card-main" onClick={() => setExpanded(expanded === consult.id ? null : consult.id)}>
                <div className="consultation-card-left">
                  <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--success-500), var(--primary-500))' }}>
                    {consult.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4>{consult.patientName}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{consult.reason}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: `${config.color}20`, color: config.color }}>
                        {config.label}
                      </span>
                      <span className="badge badge-neutral"><Shield size={10} /> {consult.accessLevel}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {new Date(consult.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{consult.preferredTime}</div>
                  </div>
                  {expanded === consult.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expanded === consult.id && (
                <div className="consultation-expanded">
                  {consult.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <button className="btn btn-success"><CheckCircle size={16} /> Accept</button>
                      <button className="btn btn-danger"><XCircle size={16} /> Reject</button>
                    </div>
                  )}

                  {(consult.status === 'accepted' || consult.status === 'completed') && (
                    <>
                      {consult.prescription && (
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                          <h5 style={{ marginBottom: '0.5rem', color: 'var(--success-400)' }}><FileText size={16} style={{ verticalAlign: 'middle' }} /> Prescription</h5>
                          <p style={{ color: 'var(--text-secondary)' }}>{consult.prescription}</p>
                        </div>
                      )}
                      {consult.treatmentNotes && (
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                          <h5 style={{ marginBottom: '0.5rem', color: 'var(--primary-400)' }}>Treatment Notes</h5>
                          <p style={{ color: 'var(--text-secondary)' }}>{consult.treatmentNotes}</p>
                        </div>
                      )}

                      {consult.status === 'accepted' && (
                        <div>
                          <h5 style={{ marginBottom: '0.5rem' }}>Send Prescription / Notes</h5>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <textarea
                              className="form-textarea"
                              placeholder="Write prescription or treatment notes..."
                              value={prescription}
                              onChange={e => setPrescription(e.target.value)}
                              style={{ minHeight: '80px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                            <button className="btn btn-primary btn-sm"><Send size={14} /> Send Prescription</button>
                            <button className="btn btn-success btn-sm"><CheckCircle size={14} /> Mark Completed</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <CalendarCheck size={64} />
          <h3>No consultations</h3>
          <p>There are no consultations matching this filter.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultations;
