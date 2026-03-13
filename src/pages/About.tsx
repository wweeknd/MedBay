import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Users, Shield, Globe, ArrowLeft, Mail, Send, CheckCircle, MapPin, Phone } from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';

/* ═══════════════════════════════ ABOUT ═══════════════════════════════ */
const AboutPage: React.FC = () => (
  <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '4rem' }}>
    <div style={{ width: '100%', maxWidth: '780px', padding: '0 1.5rem' }}>
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <Link to="/" className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <MinecraftHeart size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Med<span className="gradient-text">Bay</span></span>
        </Link>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          About <span className="gradient-text">MedBay</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>Building the future of patient-owned healthcare.</p>
      </div>

      {/* Mission */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '2rem', marginBottom: '1.5rem', opacity: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Heart size={24} style={{ color: 'var(--error-400)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Our Mission</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
          MedBay was born from a simple belief: <strong>your health data belongs to you</strong>. In a world where medical records are scattered across hospitals, clinics, and paper files, we created a single secure platform where patients own, manage, and control who accesses their health information. We bridge the gap between patients and doctors through technology, transparency, and trust.
        </p>
      </div>

      {/* Values */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Shield, color: 'var(--primary-400)', bg: 'rgba(6, 182, 212, 0.15)', title: 'Privacy First', desc: 'Your data is encrypted end-to-end. We never sell or share your information.' },
          { icon: Users, color: 'var(--accent-400)', bg: 'rgba(99, 102, 241, 0.15)', title: 'Patient-Centered', desc: 'Every feature is designed with the patient experience as the top priority.' },
          { icon: Globe, color: 'var(--success-400)', bg: 'rgba(16, 185, 129, 0.15)', title: 'Accessible', desc: 'Healthcare management should be available to everyone, everywhere.' },
        ].map((v, i) => (
          <div key={i} className="glass-card animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <v.icon size={22} style={{ color: v.color }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '1.5rem', animationDelay: '0.3s', opacity: 0 }}>
        {[
          { value: '50K+', label: 'Patients' },
          { value: '2,500+', label: 'Verified Doctors' },
          { value: '99.9%', label: 'Uptime' },
          { value: '4.9★', label: 'Rating' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/register" className="btn btn-primary btn-lg">Get Started Today</Link>
        <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════ CONTACT ═══════════════════════════════ */
const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ width: '100%', maxWidth: '780px', padding: '0 1.5rem' }}>
        <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
          <Link to="/" className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <MinecraftHeart size={28} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Med<span className="gradient-text">Bay</span></span>
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Contact <span className="gradient-text">Support</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Have a question or need help? We're here for you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Contact Form */}
          <div className="glass-card animate-fade-in-up" style={{ padding: '2rem', gridColumn: 'span 2', opacity: 0 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={48} style={{ color: 'var(--success-400)', marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} style={{ color: 'var(--primary-400)' }} /> Send Us a Message
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input type="text" className="form-input" placeholder="John Doe" required id="contact-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="john@example.com" required id="contact-email" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Subject</label>
                  <select className="form-select" required id="contact-subject">
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="privacy">Privacy Concern</option>
                    <option value="verification">Doctor Verification</option>
                    <option value="bug">Report a Bug</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="How can we help you?" required style={{ minHeight: '120px' }} id="contact-message" />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} id="contact-submit">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Cards */}
          {[
            { icon: Mail, color: 'var(--primary-400)', title: 'Email', detail: 'support@medbay.com', sub: 'We reply within 24 hours' },
            { icon: Phone, color: 'var(--success-400)', title: 'Phone', detail: '+1 (555) 123-4567', sub: 'Mon–Fri, 9AM–6PM EST' },
            { icon: MapPin, color: 'var(--accent-400)', title: 'Office', detail: 'San Francisco, CA', sub: 'By appointment only' },
            { icon: Shield, color: 'var(--warning-400)', title: 'Security', detail: 'security@medbay.com', sub: 'Report vulnerabilities' },
          ].map((c, i) => (
            <div key={i} className="glass-card animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <c.icon size={20} style={{ color: c.color }} />
                <h4 style={{ fontWeight: 600 }}>{c.title}</h4>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{c.detail}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════ ROUTER SWITCH ═══════════════════════════════ */
const AboutRouter: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/contact') return <ContactPage />;
  return <AboutPage />;
};

export default AboutRouter;
