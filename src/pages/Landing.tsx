import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, FileText, MessageSquare,
  QrCode, Star, ArrowRight, CheckCircle, Zap, Lock, Globe,
  Stethoscope
} from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';
import MedicalScene3D from '../components/MedicalScene3D';

/* ==================== SCROLL REVEAL ==================== */
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
};

/* ==================== TILT CARD ==================== */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
      el.style.transition = 'transform 0.12s ease-out';
    };
    const onLeave = () => { el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'; el.style.transition = 'transform 0.5s ease-out'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);
  return <div ref={ref} className={className} style={{ willChange: 'transform' }}>{children}</div>;
};

/* ==================== LANDING PAGE ==================== */
const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <header className="landing-nav">
        <div className="container landing-nav-inner">
          <Link to="/" className="landing-logo">
            <MinecraftHeart size={32} />
            <span>Med<span className="gradient-text">Bay</span></span>
          </Link>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#security">Security</a>
          </nav>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero">
        {/* 3D Medical Scene Background */}
        <MedicalScene3D />

        <div className="container hero-content">
          <ScrollReveal>
            <div className="hero-badge">
              <Zap size={14} />
              <span>Patient-Owned Healthcare Platform</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="hero-title">
              Your Health Records,<br />
              <span className="gradient-text">Your Control.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="hero-subtitle">
              MedBay empowers you to own, manage, and share your medical records securely.
              Connect with top doctors, track medications, and carry your emergency info everywhere.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg" id="hero-get-started">
                Start Free Today <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=doctor" className="btn btn-outline btn-lg" id="hero-join-doctor">
                <Stethoscope size={18} /> Join as Doctor
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="hero-stats">
              <div className="hero-stat"><span className="hero-stat-value">50K+</span><span className="hero-stat-label">Patients</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-value">2,500+</span><span className="hero-stat-label">Doctors</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-value">4.9</span><span className="hero-stat-label">Rating</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-value">99.9%</span><span className="hero-stat-label">Uptime</span></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section" id="features">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-badge"><Shield size={14} /> Core Features</span>
              <h2>Everything You Need for<br /><span className="gradient-text">Complete Health Management</span></h2>
              <p>From medical records to emergency cards, MedBay provides a comprehensive suite of tools.</p>
            </div>
          </ScrollReveal>
          <div className="features-grid">
            {[
              { icon: FileText, color: '#7C5832', bg: '#FAF5EF', title: 'Medical Records Vault', desc: 'Upload, organize, and access prescriptions, lab reports, and scans from one secure location.' },
              { icon: Users, color: '#A85D34', bg: '#FDF5F0', title: 'Doctor Connectivity', desc: 'Find verified doctors, request consultations, and communicate securely with providers.' },
              { icon: QrCode, color: '#5C8A3E', bg: '#F4F9EE', title: 'Emergency QR Card', desc: 'Generate a scannable QR code with your critical medical info for emergencies.' },
              { icon: Shield, color: '#C4912E', bg: '#FDF8EC', title: 'Privacy Controls', desc: 'Decide exactly who sees your records. Grant full, limited, or temporary access.' },
              { icon: MessageSquare, color: '#B54A3A', bg: '#FDF2F0', title: 'Secure Messaging', desc: 'Chat with doctors, share files, and receive prescriptions in a private channel.' },
              { icon: Star, color: '#7C5832', bg: '#FAF5EF', title: 'Ratings & Reviews', desc: 'Read authentic patient reviews and leave feedback to help others find the right doctor.' },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard className="feature-card glass-card">
                  <div className="feature-icon" style={{ background: f.bg }}>
                    <f.icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section landing-section-alt" id="how-it-works">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-badge"><Zap size={14} /> Simple Process</span>
              <h2>Get Started in<br /><span className="gradient-text">Three Simple Steps</span></h2>
            </div>
          </ScrollReveal>
          <div className="steps-grid">
            {[
              { num: '01', title: 'Create Your Profile', desc: 'Sign up as a patient or doctor. Fill in your profile or credentials.', checks: ['Quick registration', 'Role-based setup', 'Secure & private'] },
              { num: '02', title: 'Upload & Organize', desc: 'Import medical records, set up your medicine tracker, and configure privacy.', checks: ['Upload documents', 'Track medications', 'Emergency card setup'] },
              { num: '03', title: 'Connect & Consult', desc: 'Find doctors, request consultations, and manage your health from one dashboard.', checks: ['Find specialists', 'Book consultations', 'Secure messaging'] },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <TiltCard className="step-card glass-card">
                  <div className="step-number">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul className="step-checklist">
                    {s.checks.map((c, j) => <li key={j}><CheckCircle size={16} /> {c}</li>)}
                  </ul>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="landing-section" id="security">
        <div className="container">
          <div className="security-grid">
            <ScrollReveal>
              <div className="security-content">
                <span className="section-badge"><Lock size={14} /> Security First</span>
                <h2>Your Health Data Deserves <span className="gradient-text">Military-Grade Security</span></h2>
                <p>MedBay uses end-to-end encryption, HIPAA-compliant infrastructure, and granular access controls.</p>
                <div className="security-features">
                  {[
                    { icon: Lock, title: 'End-to-End Encryption', desc: 'All data encrypted in transit and at rest using AES-256.' },
                    { icon: Shield, title: 'HIPAA Compliant', desc: 'Built to meet healthcare data protection standards.' },
                    { icon: Globe, title: 'SOC 2 Certified', desc: 'Independently audited for security and availability.' },
                  ].map((f, i) => (
                    <div key={i} className="security-feature">
                      <div className="security-feature-icon"><f.icon size={20} /></div>
                      <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="security-visual">
                <TiltCard>
                  <div className="security-mock-card glass-card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>A</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Alex Rivera</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Patient ID: MDB-001</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-error">O+ Blood</span>
                      <span className="badge badge-warning">Penicillin Allergy</span>
                      <span className="badge badge-primary">Asthma</span>
                    </div>
                    <div className="security-shield-overlay">
                      <Shield size={48} />
                      <span>Protected</span>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <ScrollReveal>
            <div className="cta-content">
              <h2>Ready to Take Control of Your <span className="gradient-text">Health Records?</span></h2>
              <p>Join thousands of patients and doctors who trust MedBay for secure, patient-owned healthcare management.</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg" id="cta-sign-up">
                  Create Free Account <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="landing-logo">
                <MinecraftHeart size={24} />
                <span>Med<span className="gradient-text">Bay</span></span>
              </Link>
              <p>Patient-owned medical records platform. Your health data, your control.</p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#features">Features</a><a href="#security">Security</a><a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-links">
              <h4>For Patients</h4>
              <Link to="/register">Create Account</Link><a href="#features">Medical Records</a><a href="#features">Emergency Card</a>
            </div>
            <div className="footer-links">
              <h4>For Doctors</h4>
              <Link to="/register?role=doctor">Join as Doctor</Link><a href="#features">Consultations</a><a href="#features">Patient Communication</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 MedBay. All rights reserved. HIPAA Compliant.</p>
            <div className="footer-bottom-links"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/contact">Contact</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
