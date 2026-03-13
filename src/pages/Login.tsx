import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Stethoscope } from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';
import type { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password, role);
      navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoRole: UserRole) => {
    setIsSubmitting(true);
    try {
      await login(demoRole === 'patient' ? 'patient@medbay.com' : 'doctor@medbay.com', 'demo1234', demoRole);
      navigate(demoRole === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch {
      setError('Demo login failed.');
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

      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <MinecraftHeart size={36} />
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Med<span className="gradient-text">Bay</span></span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to access your health dashboard</p>
        </div>

        {/* Role Selector */}
        <div className="auth-role-selector">
          <button
            className={`auth-role-btn ${role === 'patient' ? 'active' : ''}`}
            onClick={() => setRole('patient')}
            type="button"
            id="role-patient"
          >
            <User size={18} />
            <span>Patient</span>
          </button>
          <button
            className={`auth-role-btn ${role === 'doctor' ? 'active' : ''}`}
            onClick={() => setRole('doctor')}
            type="button"
            id="role-doctor"
          >
            <Stethoscope size={18} />
            <span>Doctor</span>
          </button>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder={role === 'patient' ? 'patient@medbay.com' : 'doctor@medbay.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--primary-400)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="demo1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isSubmitting} id="login-submit">
            {isSubmitting ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or try a quick demo</span>
        </div>

        <div className="demo-login-buttons">
          <button className="btn btn-outline" onClick={() => handleDemoLogin('patient')} disabled={isSubmitting} id="demo-patient">
            <User size={16} /> Demo as Patient
          </button>
          <button className="btn btn-outline" onClick={() => handleDemoLogin('doctor')} disabled={isSubmitting} id="demo-doctor">
            <Stethoscope size={16} /> Demo as Doctor
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
