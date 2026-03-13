import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PatientProfile } from '../../types';
import {
  User, Camera, Mail, Phone, MapPin, Calendar, Droplets,
  Edit2, Check, X, Save, Heart
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
] as const;

const PatientProfilePage: React.FC = () => {
  const { user, updatePatientProfile } = useAuth();
  const patient = user as PatientProfile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: patient.displayName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    phone: patient.phone,
    address: patient.address,
    email: patient.email,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    patient.photoURL || null
  );
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (editing) fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updatePatientProfile({
      displayName: form.displayName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender as PatientProfile['gender'],
      bloodGroup: form.bloodGroup,
      phone: form.phone,
      address: form.address,
      ...(avatarPreview ? { photoURL: avatarPreview } : {}),
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setForm({
      displayName: patient.displayName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      address: patient.address,
      email: patient.email,
    });
    setAvatarPreview(patient.photoURL || null);
    setEditing(false);
  };

  const age = form.dateOfBirth
    ? Math.floor((Date.now() - new Date(form.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const initials = form.displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1>My Profile</h1>
        <p>View and manage your personal information</p>
      </div>

      {saved && (
        <div className="badge badge-success" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9375rem', marginBottom: 'var(--space-xl)', animation: 'fadeInUp 0.3s ease' }}>
          <Check size={16} /> Profile saved successfully!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="glass-card animate-fade-in-up" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          padding: 'var(--space-xl)',
        }}>
          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: avatarPreview
                ? `url(${avatarPreview}) center/cover`
                : 'linear-gradient(135deg, var(--primary-300), var(--primary-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: avatarPreview ? 0 : '1.75rem', fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: editing ? 'pointer' : 'default',
              position: 'relative',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              flexShrink: 0,
            }}
          >
            {!avatarPreview && initials}
            {editing && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={22} color="white" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />

          {/* Info + edit button */}
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '0.375rem', fontSize: '1.5rem' }}>{form.displayName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-accent"><Heart size={10} /> Patient</span>
              {form.bloodGroup && <span className="badge badge-error">{form.bloodGroup}</span>}
              {age !== null && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{age} years old</span>}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ flexShrink: 0 }}>
            {!editing ? (
              <button className="btn btn-outline" onClick={() => setEditing(true)} id="edit-profile-btn">
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="btn btn-ghost" onClick={handleCancel}><X size={16} /> Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Form */}
      <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
        {/* Personal Information */}
        <div className="glass-card animate-fade-in-up stagger-1">
          <h3 style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--accent-500)' }} /> Personal Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              {editing ? (
                <input className="form-input" value={form.displayName} onChange={(e) => handleChange('displayName', e.target.value)} id="input-name" />
              ) : (
                <span className="profile-display-value">{form.displayName || '—'}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                {editing ? (
                  <input type="date" className="form-input" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} id="input-dob" />
                ) : (
                  <span className="profile-display-value">
                    {form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                {editing ? (
                  <select className="form-input form-select" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} id="input-gender">
                    {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                ) : (
                  <span className="profile-display-value" style={{ textTransform: 'capitalize' }}>{form.gender || '—'}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              {editing ? (
                <select className="form-input form-select" value={form.bloodGroup} onChange={(e) => handleChange('bloodGroup', e.target.value)} id="input-blood">
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              ) : (
                <span className="profile-display-value">{form.bloodGroup || '—'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-card animate-fade-in-up stagger-2">
          <h3 style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={20} style={{ color: 'var(--accent-500)' }} /> Contact Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem' }} />Email</label>
              <span className="profile-display-value" style={{ opacity: 0.6 }}>{form.email} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(cannot change)</span></span>
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem' }} />Phone Number</label>
              {editing ? (
                <input className="form-input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" id="input-phone" />
              ) : (
                <span className="profile-display-value">{form.phone || '—'}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem' }} />Address</label>
              {editing ? (
                <textarea className="form-textarea" value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter your address" rows={3} id="input-address" />
              ) : (
                <span className="profile-display-value">{form.address || '—'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
