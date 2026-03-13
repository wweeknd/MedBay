import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-effects">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="auth-container animate-fade-in-up" style={{ maxWidth: '440px' }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <MinecraftHeart size={36} />
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Med<span className="gradient-text">Bay</span></span>
          </Link>

          {sent ? (
            <>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={32} style={{ color: 'var(--success-400)' }} />
                </div>
              </div>
              <h1 style={{ marginTop: '1rem' }}>Check Your Inbox</h1>
              <p style={{ marginTop: '0.5rem' }}>
                We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Back to Sign In</Link>
                <button className="btn btn-ghost" onClick={() => { setSent(false); setEmail(''); }} style={{ width: '100%' }}>
                  Didn't receive it? Try again
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Reset Password</h1>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
            </>
          )}
        </div>

        {!sent && (
          <>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="forgot-email"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isSubmitting} id="forgot-submit">
                {isSubmitting ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="auth-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
