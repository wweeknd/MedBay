import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PatientProfile } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard, Droplets, AlertTriangle, Activity, Phone,
  Share2, Download, Copy, CheckCircle, Heart
} from 'lucide-react';

const EmergencyCard: React.FC = () => {
  const { user } = useAuth();
  const patient = user as PatientProfile;

  const emergencyData = {
    name: patient.displayName,
    dob: patient.dateOfBirth,
    blood: patient.bloodGroup,
    allergies: patient.allergies,
    conditions: patient.chronicConditions,
    medications: patient.currentMedications.map(m => `${m.name} ${m.dosage}`),
    contacts: patient.emergencyContacts,
  };

  const shareUrl = `${window.location.origin}/emergency/${patient.uid}`;
  const qrData = JSON.stringify(emergencyData);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><CreditCard size={28} style={{ color: 'var(--error-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Emergency Medical Card</h1>
        <p>Your shareable emergency card contains critical medical information for first responders.</p>
      </div>

      <div className="emergency-layout">
        {/* Emergency Card Preview */}
        <div className="emergency-card-wrapper animate-fade-in-up stagger-1">
          <div className="emergency-card">
            <div className="emergency-card-header">
              <div className="emergency-card-logo">
                <Heart size={20} />
                <span>MedBay</span>
              </div>
              <span className="emergency-card-label">EMERGENCY MEDICAL CARD</span>
            </div>

            <div className="emergency-card-patient">
              <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--primary-700))', color: 'white' }}>
                {patient.displayName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{patient.displayName}</h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="emergency-card-grid">
              <div className="emergency-info-block">
                <div className="emergency-info-icon"><Droplets size={16} /></div>
                <div>
                  <span className="emergency-info-label">Blood Group</span>
                  <span className="emergency-info-value">{patient.bloodGroup}</span>
                </div>
              </div>

              <div className="emergency-info-block">
                <div className="emergency-info-icon" style={{ background: 'var(--warning-50)' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--warning-500)' }} />
                </div>
                <div>
                  <span className="emergency-info-label">Allergies</span>
                  <span className="emergency-info-value">{patient.allergies.join(', ')}</span>
                </div>
              </div>

              <div className="emergency-info-block">
                <div className="emergency-info-icon" style={{ background: 'var(--info-50)' }}>
                  <Activity size={16} style={{ color: 'var(--info-500)' }} />
                </div>
                <div>
                  <span className="emergency-info-label">Chronic Conditions</span>
                  <span className="emergency-info-value">{patient.chronicConditions.join(', ')}</span>
                </div>
              </div>

              <div className="emergency-info-block">
                <div className="emergency-info-icon" style={{ background: 'var(--success-50)' }}>
                  <Phone size={16} style={{ color: 'var(--success-500)' }} />
                </div>
                <div>
                  <span className="emergency-info-label">Emergency Contact</span>
                  <span className="emergency-info-value">
                    {patient.emergencyContacts[0]?.name} ({patient.emergencyContacts[0]?.relationship})
                    <br />{patient.emergencyContacts[0]?.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="emergency-card-medications">
              <span className="emergency-info-label">Current Medications</span>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                {patient.currentMedications.map(med => (
                  <span key={med.id} className="emergency-med-tag">{med.name} {med.dosage}</span>
                ))}
              </div>
            </div>

            <div className="emergency-card-footer">
              <p>Powered by MedBay • medbay.health</p>
            </div>
          </div>
        </div>

        {/* QR Code & Sharing */}
        <div className="emergency-sidebar animate-fade-in-up stagger-2">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Scan QR Code</h3>
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={qrData}
                size={200}
                bgColor="transparent"
                fgColor="#3D2B18"
                level="M"
                includeMargin={true}
              />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 'var(--space-md) 0 var(--space-lg)' }}>
              Emergency personnel can scan this QR code to instantly view your critical medical information.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button className="btn btn-primary" onClick={handleCopyLink} id="copy-emergency-link">
                <Copy size={16} /> Copy Share Link
              </button>
              <button className="btn btn-outline" id="download-emergency-card">
                <Download size={16} /> Download Card
              </button>
              <button className="btn btn-outline" id="share-emergency-card">
                <Share2 size={16} /> Share Card
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
            <h4 style={{ marginBottom: 'var(--space-md)' }}>Tips for Emergency Preparedness</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-400)', flexShrink: 0, marginTop: 2 }} />
                <span>Print or save this card to your phone's lock screen</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-400)', flexShrink: 0, marginTop: 2 }} />
                <span>Share the link with close family members</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-400)', flexShrink: 0, marginTop: 2 }} />
                <span>Update your card whenever medications or conditions change</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-400)', flexShrink: 0, marginTop: 2 }} />
                <span>Add emergency contacts that are usually reachable</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
