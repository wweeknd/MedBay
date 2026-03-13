import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockMedicalRecords, mockConsultations, mockMedicalHistory } from '../../data/mockData';
import { COMMON_ALLERGIES, CHRONIC_CONDITIONS } from '../../data/medicalData';
import type { PatientProfile } from '../../types';
import PageSkeleton from '../../components/PageSkeleton';
import {
  FileText, Pill, CalendarCheck, MessageSquare, CreditCard,
  Activity, TrendingUp, Clock, AlertTriangle, ChevronRight,
  Heart, Droplets, Shield, Plus, X, Edit2, ExternalLink, Check, Search, ChevronDown
} from 'lucide-react';

/* ─── Open MedlinePlus search for a medical term ─── */
function openMedInfo(term: string) {
  const cleaned = term.replace(/\s*\(.*?\)\s*/g, '').trim(); // strip parenthetical clarifications
  const url = `https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&v%3Asources=medlineplus-bundle&query=${encodeURIComponent(cleaned)}`;
  window.open(url, '_blank', 'noopener');
}

/* ─── Clickable badge with working remove ─── */
const MedBadge: React.FC<{
  label: string;
  variant: 'warning' | 'primary';
  onRemove: () => void;
}> = ({ label, variant, onRemove }) => {
  return (
    <span className={`badge badge-${variant} med-badge`}>
      <span
        className="med-badge-label"
        onClick={() => openMedInfo(label)}
        role="button"
        tabIndex={0}
        title={`Learn about ${label}`}
      >
        {label}
        <ExternalLink size={10} />
      </span>
      <button
        type="button"
        className="med-badge-remove"
        onClick={onRemove}
        title={`Remove ${label}`}
        aria-label={`Remove ${label}`}
      >
        <X size={12} />
      </button>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════
   SEARCHABLE DROPDOWN — picks from a predefined list
   ═══════════════════════════════════════════════════════ */
const SearchableDropdown: React.FC<{
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  placeholder: string;
}> = ({ options, selected, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Only show options not already selected
  const available = options.filter(
    o => !selected.includes(o) &&
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="searchable-dropdown" ref={ref}>
      <button
        type="button"
        className="btn btn-ghost btn-sm searchable-dropdown-trigger"
        onClick={() => setOpen(!open)}
      >
        <Plus size={14} /> Add <ChevronDown size={12} />
      </button>

      {open && (
        <div className="searchable-dropdown-panel">
          <div className="searchable-dropdown-search">
            <Search size={14} />
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="searchable-dropdown-list">
            {available.length === 0 ? (
              <li className="searchable-dropdown-empty">
                {query ? `No match for "${query}"` : 'All options selected'}
              </li>
            ) : (
              available.slice(0, 15).map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    className="searchable-dropdown-item"
                    onClick={() => {
                      onSelect(option);
                      setQuery('');
                      setOpen(false);
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))
            )}
            {available.length > 15 && (
              <li className="searchable-dropdown-hint">
                Type to narrow down ({available.length - 15} more…)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ─── Editable field ─── */
const EditableField: React.FC<{
  label: string;
  value: string;
  onSave: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onSave, placeholder }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const save = () => {
    onSave(val.trim());
    setEditing(false);
  };

  return (
    <div className="profile-info-item">
      <span className="profile-info-label">{label}</span>
      {editing ? (
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <input
            className="form-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
            placeholder={placeholder}
            autoFocus
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: '120px' }}
          />
          <button className="btn btn-ghost btn-sm" onClick={save} style={{ padding: '0.25rem' }}><Check size={14} /></button>
        </div>
      ) : (
        <span
          className="profile-info-value"
          onClick={() => { setVal(value); setEditing(true); }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          title="Click to edit"
        >
          {value || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Not set</span>}
          <Edit2 size={12} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />
        </span>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   PATIENT DASHBOARD
   ═══════════════════════════════════════════════════════ */
const PatientDashboard: React.FC = () => {
  const { user, updatePatientProfile } = useAuth();
  const patient = user as PatientProfile;

  const isSushanth = patient.email.toLowerCase() === 'sssushanth2007@gmail.com';
  const isUday = patient.email.toLowerCase() === 'uday@medbay.com';
  
  const demoRecords = (isSushanth || isUday) ? [
    { id: 'demo-1', title: 'Medical Certificate - Degree', description: 'Verified medical professional degree.', type: 'other', uploadedAt: '2025-03-01T10:00:00Z', patientId: patient.uid },
    { id: 'demo-2', title: 'Prescription - Vitamin D', description: 'Weekly supplement.', type: 'prescription', uploadedAt: '2025-02-15T09:00:00Z', patientId: patient.uid }
  ] : [];

  const combinedRecords = [...mockMedicalRecords.filter(r => r.patientId === patient.uid), ...demoRecords];
  const pendingConsultations = mockConsultations.filter(c => c.status === 'pending' && c.patientId === patient.uid).length;
  const activeConsultations = mockConsultations.filter(c => c.status === 'accepted' && c.patientId === patient.uid).length;
  
  const demoHistory = (isSushanth || isUday) ? [
    { id: 'h-1', date: '2025-03-05', title: 'Degree Verification', description: 'System automatically verified professional documents.', type: 'checkup', patientId: patient.uid, doctor: 'MedBay System', hospital: 'Verification Hub' }
  ] : [];
  const recentHistory = [...mockMedicalHistory.filter(h => h.patientId === patient.uid), ...demoHistory].slice(0, 4);

  const [editingDob, setEditingDob] = useState(false);
  const [dobValue, setDobValue] = useState(patient.dateOfBirth);

  /* ── Profile update helpers ── */
  const addAllergy = (allergy: string) => {
    if (!patient.allergies.includes(allergy)) {
      updatePatientProfile({ allergies: [...patient.allergies, allergy] });
    }
  };
  const removeAllergy = (allergy: string) => {
    updatePatientProfile({ allergies: patient.allergies.filter(a => a !== allergy) });
  };
  const addCondition = (condition: string) => {
    if (!patient.chronicConditions.includes(condition)) {
      updatePatientProfile({ chronicConditions: [...patient.chronicConditions, condition] });
    }
  };
  const removeCondition = (condition: string) => {
    updatePatientProfile({ chronicConditions: patient.chronicConditions.filter(c => c !== condition) });
  };

  return (
    <PageSkeleton delay={500}>
    <div className="page-inner">
      {/* ── Hero gradient welcome banner ── */}
      <div className="dashboard-hero animate-fade-in">
        <div className="dashboard-hero-inner">
          <div className="dashboard-hero-text">
            <p className="dashboard-hero-eyebrow">Patient Portal</p>
            <h1>Welcome back, <span>{patient.displayName.split(' ')[0]}</span> 👋</h1>
            <p className="dashboard-hero-sub">Here's an overview of your health profile and recent activity.</p>
          </div>
          <div className="dashboard-hero-date">
            <Clock size={15} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="dashboard-hero-orb" />
      </div>

      {/* Quick Stats — Clickable */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
        <Link to="/patient/records" className="stat-card animate-fade-in-up stagger-1" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
            <FileText size={24} style={{ color: 'var(--primary-400)' }} />
          </div>
          <div className="stat-value">{combinedRecords.length}</div>
          <div className="stat-label">Medical Records</div>
          <ChevronRight size={14} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-tertiary)', opacity: 0.5 }} />
        </Link>

        <Link to="/patient/consultations" className="stat-card animate-fade-in-up stagger-2" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
            <CalendarCheck size={24} style={{ color: 'var(--accent-400)' }} />
          </div>
          <div className="stat-value">{activeConsultations}</div>
          <div className="stat-label">Active Consultations</div>
          <ChevronRight size={14} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-tertiary)', opacity: 0.5 }} />
        </Link>

        <Link to="/patient/medicines" className="stat-card animate-fade-in-up stagger-3" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <Pill size={24} style={{ color: 'var(--success-400)' }} />
          </div>
          <div className="stat-value">{patient.currentMedications.length}</div>
          <div className="stat-label">Active Medications</div>
          <ChevronRight size={14} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-tertiary)', opacity: 0.5 }} />
        </Link>
      </div>

      <div className="dashboard-grid">
        {/* Editable Health Profile Card */}
        <div className="glass-card dashboard-profile-card animate-fade-in-up">
          <div className="card-header">
            <h3><Heart size={20} style={{ color: 'var(--error-400)' }} /> Health Profile</h3>
          </div>

          {/* Age + Blood Group row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {/* Age with DOB editor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {patient.dateOfBirth
                  ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                  : '—'
                }
              </span>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>years old</div>
                {editingDob ? (
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.125rem' }}>
                    <input
                      type="date"
                      className="form-input"
                      value={dobValue}
                      onChange={(e) => setDobValue(e.target.value)}
                      style={{ padding: '0.125rem 0.375rem', fontSize: '0.75rem', width: '130px' }}
                      autoFocus
                    />
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { updatePatientProfile({ dateOfBirth: dobValue }); setEditingDob(false); }}
                      style={{ padding: '0.125rem' }}
                    ><Check size={12} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setDobValue(patient.dateOfBirth); setEditingDob(true); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.75rem', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Set DOB'}
                    <Edit2 size={10} />
                  </button>
                )}
              </div>
            </div>

            {/* Blood Group — styled as a distinct pill, not a clickable card */}
            {patient.bloodGroup ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <Droplets size={16} style={{ color: 'var(--error-400)' }} />
                <span style={{ fontWeight: 600, color: 'var(--error-400)', fontSize: '0.9375rem' }}>{patient.bloodGroup}</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Blood group not set</span>
            )}

            {/* Gender pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: 'var(--bg-secondary)', borderRadius: '999px' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{patient.gender || '—'}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="profile-info-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <EditableField
              label="Phone"
              value={patient.phone}
              placeholder="+91 98765 43210"
              onSave={(v) => updatePatientProfile({ phone: v })}
            />
          </div>

          {/* Allergies — Dropdown with real data */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
                <AlertTriangle size={16} style={{ color: 'var(--warning-400)' }} /> Allergies
              </h4>
              <SearchableDropdown
                options={COMMON_ALLERGIES}
                selected={patient.allergies}
                onSelect={addAllergy}
                placeholder="Search allergies..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {patient.allergies.length === 0 ? (
                <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  No allergies added — use the dropdown to add yours
                </span>
              ) : (
                patient.allergies.map((allergy) => (
                  <MedBadge key={allergy} label={allergy} variant="warning" onRemove={() => removeAllergy(allergy)} />
                ))
              )}
            </div>
          </div>

          {/* Chronic Conditions — Dropdown with real data */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
                <Shield size={16} style={{ color: 'var(--primary-400)' }} /> Chronic Conditions
              </h4>
              <SearchableDropdown
                options={CHRONIC_CONDITIONS}
                selected={patient.chronicConditions}
                onSelect={addCondition}
                placeholder="Search conditions..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {patient.chronicConditions.length === 0 ? (
                <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  No conditions added — use the dropdown if applicable
                </span>
              ) : (
                patient.chronicConditions.map((condition) => (
                  <MedBadge key={condition} label={condition} variant="primary" onRemove={() => removeCondition(condition)} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="card-header">
            <h3><Activity size={20} style={{ color: 'var(--primary-400)' }} /> Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <Link to="/patient/records" className="quick-action-item" id="qa-records">
              <div className="quick-action-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                <FileText size={22} style={{ color: 'var(--primary-400)' }} />
              </div>
              <span>Medical Records</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
            <Link to="/patient/medicines" className="quick-action-item" id="qa-medicines">
              <div className="quick-action-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                <Pill size={22} style={{ color: 'var(--success-400)' }} />
              </div>
              <span>Medicine Tracker</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
            <Link to="/patient/find-doctors" className="quick-action-item" id="qa-find-doctors">
              <div className="quick-action-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                <TrendingUp size={22} style={{ color: 'var(--accent-400)' }} />
              </div>
              <span>Find Doctors</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
            <Link to="/patient/messages" className="quick-action-item" id="qa-messages">
              <div className="quick-action-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                <MessageSquare size={22} style={{ color: 'var(--warning-400)' }} />
              </div>
              <span>Messages</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
            <Link to="/patient/emergency-card" className="quick-action-item" id="qa-emergency">
              <div className="quick-action-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                <CreditCard size={22} style={{ color: 'var(--error-400)' }} />
              </div>
              <span>Emergency Card</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
            <Link to="/patient/consultations" className="quick-action-item" id="qa-consultations">
              <div className="quick-action-icon" style={{ background: 'rgba(148, 163, 184, 0.15)' }}>
                <CalendarCheck size={22} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <span>Consultations {pendingConsultations > 0 && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>{pendingConsultations} pending</span>}</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Medical Timeline */}
      <div className="glass-card animate-fade-in-up" style={{ marginTop: 'var(--space-2xl)', animationDelay: '0.3s', opacity: 0 }}>
        <div className="card-header" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3><Clock size={20} style={{ color: 'var(--accent-400)' }} /> Recent Medical Timeline</h3>
          <Link to="/patient/records" className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></Link>
        </div>
        <div className="timeline">
          {recentHistory.map((entry) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-date">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9375rem' }}>{entry.title}</h4>
                  <span className={`badge ${entry.type === 'diagnosis' ? 'badge-primary' : entry.type === 'checkup' ? 'badge-success' : entry.type === 'procedure' ? 'badge-accent' : entry.type === 'vaccination' ? 'badge-warning' : 'badge-neutral'}`}>
                    {entry.type}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{entry.description}</p>
                {entry.doctor && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    {entry.doctor} {entry.hospital && `• ${entry.hospital}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageSkeleton>
  );
};

export default PatientDashboard;
