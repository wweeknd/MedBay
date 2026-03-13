import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PatientProfile, Medication } from '../../types';
import {
  Pill, Plus, Edit3, Trash2, X, CheckCircle, AlertCircle,
  Clock, ChevronDown, ChevronUp
} from 'lucide-react';

const effectivenessColors: Record<string, string> = {
  'very-effective': 'var(--success-400)',
  'effective': 'var(--primary-400)',
  'somewhat-effective': 'var(--warning-400)',
  'not-effective': 'var(--error-400)',
};

const MedicineTracker: React.FC = () => {
  const { user } = useAuth();
  const patient = user as PatientProfile;
  const [medications, setMedications] = useState<Medication[]>(patient.currentMedications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
    name: '', dosage: '', frequency: '', notes: '', startDate: '', effectiveness: undefined, sideEffects: '',
  });

  const handleAdd = () => {
    const med: Medication = {
      id: `med-${Date.now()}`,
      name: newMed.name || '',
      dosage: newMed.dosage || '',
      frequency: newMed.frequency || '',
      startDate: newMed.startDate || new Date().toISOString().split('T')[0],
      notes: newMed.notes || '',
      effectiveness: newMed.effectiveness,
      sideEffects: newMed.sideEffects,
    };
    setMedications([...medications, med]);
    setShowAddModal(false);
    setNewMed({ name: '', dosage: '', frequency: '', notes: '', startDate: '', effectiveness: undefined, sideEffects: '' });
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1><Pill size={28} style={{ color: 'var(--success-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Medicine Tracker</h1>
            <p>Track your medications, add personal notes, and monitor effectiveness.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} id="add-medicine-btn">
            <Plus size={16} /> Add Medicine
          </button>
        </div>
      </div>

      {/* Medicine Cards */}
      <div className="medicine-list">
        {medications.map((med, index) => (
          <div
            key={med.id}
            className="glass-card medicine-card animate-fade-in-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}
          >
            <div className="medicine-card-main" onClick={() => setExpandedMed(expandedMed === med.id ? null : med.id)}>
              <div className="medicine-card-left">
                <div className="medicine-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                  <Pill size={22} style={{ color: 'var(--success-400)' }} />
                </div>
                <div className="medicine-info">
                  <h4>{med.name}</h4>
                  <div className="medicine-details">
                    <span className="badge badge-primary">{med.dosage}</span>
                    <span className="badge badge-neutral">{med.frequency}</span>
                    {med.effectiveness && (
                      <span className="badge" style={{
                        background: `${effectivenessColors[med.effectiveness]}20`,
                        color: effectivenessColors[med.effectiveness],
                      }}>
                        {med.effectiveness.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="medicine-card-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                  <Clock size={14} /> Since {new Date(med.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                {expandedMed === med.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expandedMed === med.id && (
              <div className="medicine-expanded">
                <div className="medicine-expanded-grid">
                  <div className="medicine-expanded-info">
                    <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success-400)' }} /> Notes
                    </h5>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{med.notes || 'No notes added.'}</p>
                  </div>
                  {med.sideEffects && (
                    <div className="medicine-expanded-info">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertCircle size={16} style={{ color: 'var(--warning-400)' }} /> Side Effects
                      </h5>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{med.sideEffects}</p>
                    </div>
                  )}
                </div>
                <div className="medicine-expanded-actions">
                  <button className="btn btn-ghost btn-sm"><Edit3 size={14} /> Edit</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error-400)' }} onClick={() => handleDelete(med.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {medications.length === 0 && (
        <div className="empty-state">
          <Pill size={64} />
          <h3>No medications tracked</h3>
          <p>Start tracking your medications to keep a comprehensive health record.</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ marginTop: 'var(--space-lg)' }}>
            <Plus size={16} /> Add Your First Medicine
          </button>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Medicine</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Medicine Name *</label>
                <input type="text" className="form-input" placeholder="e.g., Lisinopril" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} id="med-name" />
              </div>
              <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="form-group">
                  <label className="form-label">Dosage *</label>
                  <input type="text" className="form-input" placeholder="e.g., 10mg" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} id="med-dosage" />
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency *</label>
                  <input type="text" className="form-input" placeholder="e.g., Once daily" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} id="med-frequency" />
                </div>
              </div>
              <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={newMed.startDate} onChange={e => setNewMed({ ...newMed, startDate: e.target.value })} id="med-start" />
                </div>
                <div className="form-group">
                  <label className="form-label">Effectiveness</label>
                  <select className="form-select" value={newMed.effectiveness || ''} onChange={e => setNewMed({ ...newMed, effectiveness: e.target.value as Medication['effectiveness'] })} id="med-effectiveness">
                    <option value="">Select...</option>
                    <option value="very-effective">Very Effective</option>
                    <option value="effective">Effective</option>
                    <option value="somewhat-effective">Somewhat Effective</option>
                    <option value="not-effective">Not Effective</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Any notes about this medication..." value={newMed.notes} onChange={e => setNewMed({ ...newMed, notes: e.target.value })} id="med-notes" />
              </div>
              <div className="form-group">
                <label className="form-label">Side Effects</label>
                <textarea className="form-textarea" placeholder="Any side effects observed..." value={newMed.sideEffects} onChange={e => setNewMed({ ...newMed, sideEffects: e.target.value })} id="med-side-effects" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newMed.name || !newMed.dosage} id="med-submit">Add Medicine</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;
