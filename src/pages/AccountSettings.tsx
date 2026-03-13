import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, storage } from '../lib/firebase';
import { updatePassword, updateEmail, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Settings, Lock, Mail, Trash2, Camera, AlertTriangle, CheckCircle, Upload, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { PatientProfile, DoctorProfile } from '../types';

const DEMO_EMAILS = ['patient@medbay.com', 'doctor@medbay.com'];
const AUTO_VERIFIED_EMAILS = ['sssushanth2007@gmail.com'];

const AccountSettings: React.FC = () => {
  const { user, userRole, logout, updatePatientProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Change email state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Profile picture state
  const [uploadingPic, setUploadingPic] = useState(false);
  const [picMsg, setPicMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Doctor verification state
  const [uploadingDegree, setUploadingDegree] = useState(false);
  const [degreeMsg, setDegreeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const degreeInputRef = useRef<HTMLInputElement>(null);

  const isDemoAccount = DEMO_EMAILS.includes(user?.email || '');
  const isAutoVerified = AUTO_VERIFIED_EMAILS.includes(user?.email || '');
  const doctorUser = user as DoctorProfile;

  /* ── Profile Picture Upload ── */
  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPicMsg({ type: 'error', text: 'Please select an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPicMsg({ type: 'error', text: 'Image must be under 5MB.' });
      return;
    }

    setUploadingPic(true);
    setPicMsg(null);
    try {
      const storageRef = ref(storage, `profile-pictures/${user!.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatePatientProfile({ photoURL: downloadURL } as Partial<PatientProfile>);
      setPicMsg({ type: 'success', text: 'Profile picture updated!' });
    } catch {
      setPicMsg({ type: 'error', text: 'Failed to upload. Please try again.' });
    } finally {
      setUploadingPic(false);
    }
  };

  /* ── Doctor Degree Upload ── */
  const handleDegreeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setDegreeMsg({ type: 'error', text: 'Please upload a PDF or image file.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDegreeMsg({ type: 'error', text: 'File must be under 10MB.' });
      return;
    }

    setUploadingDegree(true);
    setDegreeMsg(null);
    try {
      const storageRef = ref(storage, `doctor-degrees/${user!.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      setDegreeMsg({ type: 'success', text: 'Degree uploaded! Verification is pending review by our team.' });
    } catch {
      setDegreeMsg({ type: 'error', text: 'Failed to upload degree. Please try again.' });
    } finally {
      setUploadingDegree(false);
    }
  };

  /* ── Change Password ── */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (isDemoAccount) { setPasswordMsg({ type: 'error', text: 'Cannot change password for demo accounts.' }); return; }
    if (newPassword.length < 6) { setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return; }
    if (newPassword !== confirmNewPassword) { setPasswordMsg({ type: 'error', text: 'Passwords do not match.' }); return; }

    setPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Current password is incorrect.' : 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  /* ── Change Email ── */
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    if (isDemoAccount) { setEmailMsg({ type: 'error', text: 'Cannot change email for demo accounts.' }); return; }

    setEmailLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser!.email!, emailPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updateEmail(auth.currentUser!, newEmail);
      setEmailMsg({ type: 'success', text: 'Email updated! You may need to verify the new address.' });
      setNewEmail(''); setEmailPassword('');
    } catch (err: any) {
      setEmailMsg({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Password is incorrect.' : 'Failed to update email.' });
    } finally {
      setEmailLoading(false);
    }
  };

  /* ── Delete Account ── */
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteMsg(null);
    if (isDemoAccount) { setDeleteMsg({ type: 'error', text: 'Cannot delete demo accounts.' }); return; }
    if (deleteConfirm !== 'DELETE') { setDeleteMsg({ type: 'error', text: 'Please type DELETE to confirm.' }); return; }

    setDeleteLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser!.email!, deletePassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await deleteUser(auth.currentUser!);
      logout();
    } catch (err: any) {
      setDeleteMsg({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Password is incorrect.' : 'Failed to delete account.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile Picture', icon: Camera },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'email', label: 'Change Email', icon: Mail },
    ...(userRole === 'doctor' ? [{ id: 'verification', label: 'Verification', icon: Shield }] : []),
    { id: 'danger', label: 'Delete Account', icon: Trash2 },
  ];

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><Settings size={28} style={{ color: 'var(--primary-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Account Settings</h1>
        <p>Manage your account preferences, security, and profile.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
        {/* Sidebar */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '0.5rem', position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`btn btn-ghost btn-sm`}
              style={{
                width: '100%', justifyContent: 'flex-start', gap: '0.5rem',
                background: activeSection === s.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                color: s.id === 'danger' ? 'var(--error-400)' : activeSection === s.id ? 'var(--primary-400)' : 'var(--text-secondary)',
                fontWeight: activeSection === s.id ? 600 : 400,
                borderRadius: 'var(--radius-md)', padding: '0.625rem 0.75rem',
              }}
              id={`settings-tab-${s.id}`}
            >
              <s.icon size={16} /> {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Profile Picture */}
          {activeSection === 'profile' && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} style={{ color: 'var(--primary-400)' }} /> Profile Picture
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: (user as PatientProfile)?.photoURL ? `url(${(user as PatientProfile).photoURL}) center/cover` : 'linear-gradient(135deg, var(--primary-500), var(--accent-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                  {!(user as PatientProfile)?.photoURL && user?.displayName?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{user?.displayName}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{user?.email}</p>
                </div>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleProfilePicUpload} style={{ display: 'none' }} />
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploadingPic || isDemoAccount} id="upload-pic-btn">
                {uploadingPic ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Upload size={16} /> Upload New Picture</>}
              </button>
              {isDemoAccount && <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>Profile picture uploads are disabled for demo accounts.</p>}
              {picMsg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: picMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: picMsg.type === 'success' ? 'var(--success-400)' : 'var(--error-400)', fontSize: '0.875rem' }}>{picMsg.text}</div>}
            </div>
          )}

          {/* Change Password */}
          {activeSection === 'password' && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: 'var(--primary-400)' }} /> Change Password
              </h3>
              {isDemoAccount && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Password changes are disabled for demo accounts.</div>}
              <form onSubmit={handleChangePassword}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required disabled={isDemoAccount} id="current-password" />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required disabled={isDemoAccount} id="new-password" />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required disabled={isDemoAccount} id="confirm-new-password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={passwordLoading || isDemoAccount} id="change-password-btn">
                  {passwordLoading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Update Password'}
                </button>
                {passwordMsg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: passwordMsg.type === 'success' ? 'var(--success-400)' : 'var(--error-400)', fontSize: '0.875rem' }}>{passwordMsg.text}</div>}
              </form>
            </div>
          )}

          {/* Change Email */}
          {activeSection === 'email' && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={20} style={{ color: 'var(--primary-400)' }} /> Change Email
              </h3>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Current email: <strong>{user?.email}</strong>
              </div>
              {isDemoAccount && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Email changes are disabled for demo accounts.</div>}
              <form onSubmit={handleChangeEmail}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">New Email Address</label>
                  <input type="email" className="form-input" value={newEmail} onChange={e => setNewEmail(e.target.value)} required disabled={isDemoAccount} id="new-email" />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} required disabled={isDemoAccount} id="email-password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={emailLoading || isDemoAccount} id="change-email-btn">
                  {emailLoading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Update Email'}
                </button>
                {emailMsg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: emailMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: emailMsg.type === 'success' ? 'var(--success-400)' : 'var(--error-400)', fontSize: '0.875rem' }}>{emailMsg.text}</div>}
              </form>
            </div>
          )}

          {/* Doctor Verification */}
          {activeSection === 'verification' && userRole === 'doctor' && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} style={{ color: 'var(--primary-400)' }} /> Doctor Verification
              </h3>

              {/* Verification status */}
              {(isAutoVerified || doctorUser?.isVerified) ? (
                <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <ShieldCheck size={28} style={{ color: 'var(--success-400)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--success-400)' }}>Verified Doctor</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Your credentials have been verified. Patients can see the ✓ badge on your profile.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <ShieldAlert size={28} style={{ color: 'var(--warning-400)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--warning-400)' }}>Not Yet Verified</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Upload your medical degree certificate to get verified. Our team reviews submissions within 2-3 business days.</div>
                    </div>
                  </div>
                </div>
              )}

              {!(isAutoVerified || doctorUser?.isVerified) && (
                <>
                  <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Upload Medical Degree</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Please upload a clear scan or photo of your medical degree or license. Accepted formats: PDF, JPG, PNG, WebP. Max size: 10MB.
                  </p>
                  <input type="file" ref={degreeInputRef} accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleDegreeUpload} style={{ display: 'none' }} />
                  <button className="btn btn-primary" onClick={() => degreeInputRef.current?.click()} disabled={uploadingDegree} id="upload-degree-btn">
                    {uploadingDegree ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Upload size={16} /> Upload Degree Certificate</>}
                  </button>
                  {degreeMsg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: degreeMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: degreeMsg.type === 'success' ? 'var(--success-400)' : 'var(--error-400)', fontSize: '0.875rem' }}>{degreeMsg.text}</div>}
                </>
              )}
            </div>
          )}

          {/* Delete Account */}
          {activeSection === 'danger' && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error-400)' }}>
                <AlertTriangle size={20} /> Delete Account
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                This action is <strong>permanent and irreversible</strong>. All your medical records, profile data, and account information will be permanently deleted.
              </p>
              {isDemoAccount && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Account deletion is disabled for demo accounts.</div>}
              <form onSubmit={handleDeleteAccount}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Password</label>
                  <input type="password" className="form-input" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} required disabled={isDemoAccount} id="delete-password" />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Type "<strong>DELETE</strong>" to confirm</label>
                  <input type="text" className="form-input" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" required disabled={isDemoAccount} id="delete-confirm" />
                </div>
                <button type="submit" className="btn" disabled={deleteLoading || isDemoAccount} id="delete-account-btn"
                  style={{ background: 'var(--error-400)', color: 'white', opacity: isDemoAccount ? 0.5 : 1 }}>
                  {deleteLoading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Trash2 size={16} /> Permanently Delete Account</>}
                </button>
                {deleteMsg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: deleteMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: deleteMsg.type === 'success' ? 'var(--success-400)' : 'var(--error-400)', fontSize: '0.875rem' }}>{deleteMsg.text}</div>}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
