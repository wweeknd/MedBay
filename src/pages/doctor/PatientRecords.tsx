import React from 'react';
import { mockConsultations, mockMedicalRecords, mockPatient } from '../../data/mockData';
import {
  ClipboardList, Eye, Shield, User, FileText, Pill,
  AlertTriangle, Droplets, Activity
} from 'lucide-react';

const PatientRecords: React.FC = () => {
  const acceptedConsultations = mockConsultations.filter(c => c.status === 'accepted' || c.status === 'completed');

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><ClipboardList size={28} style={{ color: 'var(--success-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Patient Records</h1>
        <p>View patient medical records for approved consultations only.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {acceptedConsultations.map((consult, index) => (
          <div key={consult.id} className="glass-card animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--success-500), var(--primary-500))' }}>
                  {consult.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3>{consult.patientName}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span className={`badge ${consult.status === 'completed' ? 'badge-primary' : 'badge-success'}`}>
                      {consult.status}
                    </span>
                    <span className="badge badge-neutral">
                      <Shield size={10} /> {consult.accessLevel === 'full' ? 'Full Access' : consult.accessLevel === 'limited' ? 'Limited Access' : 'Temporary Access'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" id={`view-patient-${consult.patientId}`}>
                <Eye size={14} /> View Records
              </button>
            </div>

            {/* Patient Quick Info */}
            <div className="patient-record-grid">
              <div className="patient-record-info">
                <div className="patient-info-icon"><Droplets size={16} style={{ color: 'var(--error-400)' }} /></div>
                <div>
                  <span className="form-label">Blood Group</span>
                  <span style={{ fontWeight: 600 }}>{mockPatient.bloodGroup}</span>
                </div>
              </div>
              <div className="patient-record-info">
                <div className="patient-info-icon"><User size={16} style={{ color: 'var(--primary-400)' }} /></div>
                <div>
                  <span className="form-label">Age / Gender</span>
                  <span style={{ fontWeight: 600 }}>{new Date().getFullYear() - new Date(mockPatient.dateOfBirth).getFullYear()} / {mockPatient.gender}</span>
                </div>
              </div>
              <div className="patient-record-info">
                <div className="patient-info-icon"><AlertTriangle size={16} style={{ color: 'var(--warning-400)' }} /></div>
                <div>
                  <span className="form-label">Allergies</span>
                  <span style={{ fontWeight: 600 }}>{mockPatient.allergies.join(', ')}</span>
                </div>
              </div>
              <div className="patient-record-info">
                <div className="patient-info-icon"><Activity size={16} style={{ color: 'var(--accent-400)' }} /></div>
                <div>
                  <span className="form-label">Conditions</span>
                  <span style={{ fontWeight: 600 }}>{mockPatient.chronicConditions.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Shared Records */}
            {consult.accessLevel !== 'limited' && (
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} style={{ color: 'var(--primary-400)' }} /> Shared Medical Records
                </h4>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMedicalRecords.slice(0, 3).map(record => (
                        <tr key={record.id}>
                          <td>{record.title}</td>
                          <td><span className="badge badge-neutral">{record.type}</span></td>
                          <td>{new Date(record.uploadedAt).toLocaleDateString()}</td>
                          <td><button className="btn btn-ghost btn-sm"><Eye size={14} /> View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Medications */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={16} style={{ color: 'var(--success-400)' }} /> Current Medications
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {mockPatient.currentMedications.map(med => (
                  <span key={med.id} className="badge badge-success">{med.name} {med.dosage} — {med.frequency}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {acceptedConsultations.length === 0 && (
        <div className="empty-state">
          <ClipboardList size={64} />
          <h3>No patient records available</h3>
          <p>Patient records will appear here once consultations are approved.</p>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
