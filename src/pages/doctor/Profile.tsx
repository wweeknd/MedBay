import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockDoctors, mockReviews } from '../../data/mockData';
import type { DoctorProfile as DoctorProfileType } from '../../types';
import {
  MapPin, Star, Clock, DollarSign, Award, Globe, BookOpen,
  CheckCircle, Calendar, Edit3, Phone, Mail, Shield, X, Save, Plus, Upload
} from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams();
  const { user, userRole, updateDoctorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'schedule'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);

  // If viewing own profile (doctor) or viewing another doctor's profile (patient)
  const doctor: DoctorProfileType = doctorId
    ? (mockDoctors.find(d => d.uid === doctorId) || mockDoctors[0])
    : (user as DoctorProfileType);

  const [form, setForm] = useState<Partial<DoctorProfileType>>(doctor);

  const isOwnProfile = userRole === 'doctor' && !doctorId;
  const doctorReviews = mockReviews.filter(r => r.doctorId === doctor.uid);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSave = () => {
    updateDoctorProfile(form);
    setIsEditing(false);
  };

  const handleVerify = () => {
    if (degreeFile) {
      updateDoctorProfile({ isVerified: true });
      setShowVerifyModal(false);
      alert("Verification document submitted! (Auto-verified for this demo)");
    }
  };

  return (
    <div className="page-inner">
      {/* Verification Banner */}
      {isOwnProfile && !doctor.isVerified && (
        <div className="glass-card animate-fade-in" style={{ backgroundColor: 'var(--warning-900)', border: '1px solid var(--warning-700)', marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <Shield size={24} style={{ color: 'var(--warning-400)' }} />
            <div>
              <h4 style={{ color: 'var(--warning-100)' }}>Your profile is not verified</h4>
              <p style={{ color: 'var(--warning-300)', fontSize: '0.875rem' }}>Verified doctors get 5x more consultations. Upload your medical degree to verify now.</p>
            </div>
          </div>
          <button className="btn btn-warning" onClick={() => setShowVerifyModal(true)}>Verify Now</button>
        </div>
      )}

      {/* Profile Header */}
      <div className="doctor-profile-header glass-card animate-fade-in" style={{ borderColor: isEditing ? 'var(--primary-500)' : 'var(--glass-border)' }}>
        <div className="doctor-profile-banner" />
        <div className="doctor-profile-main">
          <div className="doctor-profile-avatar">
            <div className="avatar avatar-2xl" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
              {doctor.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {doctor.isVerified && (
              <div className="verified-check"><CheckCircle size={20} /></div>
            )}
          </div>
          <div className="doctor-profile-info">
            {isEditing ? (
              <input 
                className="form-input" 
                style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}
                value={form.displayName}
                onChange={e => setForm({...form, displayName: e.target.value})}
              />
            ) : (
              <h1>{doctor.displayName}</h1>
            )}
            
            {isEditing ? (
              <select 
                className="form-select" 
                value={form.specialization}
                onChange={e => setForm({...form, specialization: e.target.value})}
              >
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Dermatology</option>
                <option>Orthopedics</option>
                <option>Psychiatry</option>
                <option>General Medicine</option>
                <option>Pediatrics</option>
              </select>
            ) : (
              <p className="doctor-profile-spec">{doctor.specialization || 'New User Profile'}</p>
            )}

            <div className="doctor-profile-meta">
              {isEditing ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Hospital</label>
                    <input className="form-input btn-sm" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} placeholder="Hospital Name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Exp (Years)</label>
                    <input type="number" className="form-input btn-sm" value={form.yearsOfExperience} onChange={e => setForm({...form, yearsOfExperience: parseInt(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Fee ($)</label>
                    <input type="number" className="form-input btn-sm" value={form.consultationFee} onChange={e => setForm({...form, consultationFee: parseInt(e.target.value)})} />
                  </div>
                </div>
              ) : (
                <>
                  <span><MapPin size={14} /> {doctor.hospital || 'Hospital not set'}</span>
                  <span><Clock size={14} /> {doctor.yearsOfExperience || 0} years experience</span>
                  <span>
                    <Star size={14} style={{ color: 'var(--warning-400)' }} />
                    <strong>{doctor.rating || 0}</strong> ({doctor.totalReviews || 0} reviews)
                  </span>
                  <span><DollarSign size={14} /> ${doctor.consultationFee || 0} per consultation</span>
                </>
              )}
            </div>
          </div>
          {isOwnProfile && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isEditing ? (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={16} /> Save Changes</button>
                </>
              ) : (
                <button className="btn btn-outline" id="edit-profile-btn" onClick={() => {
                  setForm(doctor);
                  setIsEditing(true);
                }}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in-up stagger-1">
        <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
        <button className={`tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>Schedule</button>
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({doctorReviews.length})</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <div className="grid-2 animate-fade-in">
          {/* Bio & Philosophy */}
          <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}><BookOpen size={18} /> About</h3>
            {isEditing ? (
              <textarea 
                className="form-textarea" 
                rows={5} 
                value={form.bio} 
                onChange={e => setForm({...form, bio: e.target.value})}
                placeholder="Write your professional bio here..."
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>{doctor.bio || 'No bio written yet.'}</p>
            )}

            {isEditing ? (
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-400)' }}>Treatment Philosophy</h4>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  value={form.treatmentPhilosophy} 
                  onChange={e => setForm({...form, treatmentPhilosophy: e.target.value})}
                  placeholder="How do you treat your patients?"
                />
              </div>
            ) : (
              doctor.treatmentPhilosophy && (
                <>
                  <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-400)' }}>Treatment Philosophy</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>"{doctor.treatmentPhilosophy}"</p>
                </>
              )
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="glass-card">
              <h4 style={{ marginBottom: 'var(--space-md)' }}><Award size={18} /> Qualifications</h4>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {form.qualifications?.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input className="form-input btn-sm" value={q} onChange={e => {
                        const newQ = [...(form.qualifications || [])];
                        newQ[i] = e.target.value;
                        setForm({...form, qualifications: newQ});
                      }} />
                      <button className="btn-icon" onClick={() => setForm({...form, qualifications: form.qualifications?.filter((_, idx) => idx !== i)})}><X size={14} /></button>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => setForm({...form, qualifications: [...(form.qualifications || []), '']})}><Plus size={14} /> Add Qualification</button>
                </div>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {doctor.qualifications.length > 0 ? doctor.qualifications.map((q, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                      <CheckCircle size={14} style={{ color: 'var(--success-400)', flexShrink: 0 }} /> {q}
                    </li>
                  )) : <li style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No qualifications listed.</li>}
                </ul>
              )}
            </div>

            <div className="glass-card">
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Contact Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isEditing ? (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone</label>
                      <input className="form-input btn-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Clinic Address</label>
                      <input className="form-input btn-sm" value={form.clinicAddress} onChange={e => setForm({...form, clinicAddress: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Phone size={14} /> {doctor.phone || 'Phone not set'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {doctor.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {doctor.clinicAddress || 'Clinic address not set'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="glass-card animate-fade-in">
          <h3 style={{ marginBottom: 'var(--space-xl)' }}><Calendar size={20} /> Consultation Schedule</h3>
          <div className="schedule-grid">
            {days.map(day => {
              const daySchedule = doctor.schedule[day];
              return (
                <div key={day} className={`schedule-day ${daySchedule?.available ? '' : 'unavailable'}`}>
                  <div className="schedule-day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                  {daySchedule?.available ? (
                    <div className="schedule-slots">
                      {daySchedule.slots.map((slot, i) => (
                        <span key={i} className="schedule-slot">{slot.start} - {slot.end}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="schedule-closed">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="animate-fade-in">
          {/* Rating Summary */}
          <div className="glass-card" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--warning-400)' }}>{doctor.rating}</div>
            <div className="star-rating" style={{ justifyContent: 'center', margin: 'var(--space-sm) 0' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className={`star ${i < Math.round(doctor.rating) ? 'filled' : 'empty'}`} fill={i < Math.round(doctor.rating) ? 'var(--warning-400)' : 'none'} />
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Based on {doctor.totalReviews} reviews</p>
          </div>

          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {doctorReviews.map(review => (
              <div key={review.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                      {review.patientName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{review.patientName}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="star-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={`star ${i < review.rating ? 'filled' : 'empty'}`} fill={i < review.rating ? 'var(--warning-400)' : 'none'} />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Your Medical License</h3>
              <button className="btn-icon" onClick={() => setShowVerifyModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                  To maintain the highest standards, we manually verify every doctor. 
                  Please upload a clear scan of your Medical Degree or Professional License.
                </p>
                <div className="upload-dropzone" onClick={() => document.getElementById('degree-upload')?.click()}>
                  <Upload size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                  {degreeFile ? (
                    <p style={{ color: 'var(--success-400)', fontWeight: 600 }}>{degreeFile.name}</p>
                  ) : (
                    <>
                      <p>Click to upload Medical Degree (PDF/JPG)</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Max file size: 10MB</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="degree-upload" 
                    style={{ display: 'none' }} 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setDegreeFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', paddingLeft: '1.25rem' }}>
                <li>Your documents are stored securely and encrypted.</li>
                <li>Verification usually takes 24-48 hours.</li>
                <li>You will receive a notification once verified.</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowVerifyModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!degreeFile} onClick={handleVerify}>Submit for Verification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
