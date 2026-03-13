import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';

const termsContent = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using MedBay ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. MedBay reserves the right to update these terms at any time, and your continued use constitutes acceptance of any modifications.' },
  { title: '2. Description of Service', body: 'MedBay is a patient-owned medical records management platform that allows users to store, organize, and share their health information with healthcare providers. The Platform facilitates communication between patients and verified doctors but does not provide medical advice, diagnosis, or treatment.' },
  { title: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration and to update your information to keep it current. You must immediately notify MedBay of any unauthorized use of your account.' },
  { title: '4. Medical Records', body: 'Users retain full ownership of their medical records uploaded to the Platform. MedBay acts as a custodian and does not claim ownership of any user-generated content. You are responsible for the accuracy of the medical information you upload.' },
  { title: '5. Doctor Verification', body: 'Doctors using the Platform must submit valid medical credentials for verification. MedBay verifies credentials but does not guarantee the quality of care provided by any doctor on the platform. Patients should exercise their own judgment when selecting healthcare providers.' },
  { title: '6. Privacy & Data Protection', body: 'Your use of the Platform is also governed by our Privacy Policy. We implement industry-standard security measures including AES-256 encryption, HIPAA-compliant infrastructure, and role-based access controls to protect your health data.' },
  { title: '7. Limitation of Liability', body: 'MedBay is provided "as is" without warranties of any kind. MedBay shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid for the service in the preceding 12 months.' },
  { title: '8. Termination', body: 'MedBay reserves the right to suspend or terminate your account at any time for violation of these terms. Upon termination, you may request an export of your medical data within 30 days.' },
];

const privacyContent = [
  { title: '1. Information We Collect', body: 'We collect personal information you provide during registration (name, email, role), medical records you upload, profile information, and usage data. We also collect technical data such as device information, IP address, and browser type to improve our services.' },
  { title: '2. How We Use Your Information', body: 'Your personal information is used to provide and maintain the Platform, verify doctor credentials, facilitate patient-doctor communication, send important notifications about your account, and improve our services. We never sell your personal or medical data to third parties.' },
  { title: '3. Data Storage & Security', body: 'All data is stored on Google Cloud (Firebase) infrastructure with encryption at rest and in transit. We employ AES-256 encryption, regular security audits, and access controls to protect your information. Our infrastructure is designed to meet HIPAA compliance standards.' },
  { title: '4. Data Sharing & Access Control', body: 'Your medical records are shared only with healthcare providers you explicitly authorize. You control the access level: Full Access, Limited Access, or Temporary Access. You can revoke access at any time through your dashboard.' },
  { title: '5. Cookies & Tracking', body: 'We use essential cookies for authentication and session management. We use Firebase Analytics to understand usage patterns and improve the Platform. You can manage cookie preferences through your browser settings.' },
  { title: '6. Your Rights', body: 'You have the right to: access your personal data, correct inaccurate data, delete your account and data, export your medical records, restrict processing of your data, and object to certain uses of your information.' },
  { title: '7. Data Retention', body: 'We retain your data for as long as your account is active. Upon account deletion, we permanently remove your personal data within 30 days. Some anonymized analytical data may be retained for service improvement purposes.' },
  { title: '8. Contact Us', body: 'If you have questions about this Privacy Policy or your data, please contact our Data Protection Officer at privacy@medbay.com or through the Contact page on our website.' },
];

const Legal: React.FC = () => {
  const location = useLocation();
  const isPrivacy = location.pathname === '/privacy';
  const content = isPrivacy ? privacyContent : termsContent;
  const icon = isPrivacy ? <Shield size={28} style={{ color: 'var(--primary-400)' }} /> : <FileText size={28} style={{ color: 'var(--accent-400)' }} />;
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const subtitle = isPrivacy
    ? 'Last updated: March 13, 2025. Your privacy is important to us.'
    : 'Last updated: March 13, 2025. Please read these terms carefully.';

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ width: '100%', maxWidth: '780px', padding: '0 1.5rem' }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
          <Link to="/" className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <MinecraftHeart size={28} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Med<span className="gradient-text">Bay</span></span>
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {icon}
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{title}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {content.map((section, i) => (
            <div key={i} className="glass-card animate-fade-in-up" style={{ padding: '1.5rem 2rem', animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{section.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer navigation */}
        <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Questions? <Link to="/contact" style={{ color: 'var(--primary-400)' }}>Contact us</Link>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isPrivacy && <Link to="/privacy" className="btn btn-ghost btn-sm">Privacy Policy</Link>}
            {isPrivacy && <Link to="/terms" className="btn btn-ghost btn-sm">Terms of Service</Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
