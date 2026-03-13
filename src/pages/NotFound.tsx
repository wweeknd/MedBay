import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import MinecraftHeart from '../components/MinecraftHeart';

const NotFound: React.FC = () => {
  return (
    <div className="auth-page" style={{ minHeight: '100vh' }}>
      <div className="auth-bg-effects">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="animate-fade-in-up" style={{ textAlign: 'center', maxWidth: '520px', padding: '2rem' }}>
        <Link to="/" className="auth-logo" style={{ justifyContent: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <MinecraftHeart size={36} />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Med<span className="gradient-text">Bay</span></span>
        </Link>

        <div style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          404
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          <br />Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg" id="404-home">
            <Home size={18} /> Go Home
          </Link>
          <button className="btn btn-outline btn-lg" onClick={() => window.history.back()} id="404-back">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Search size={16} style={{ color: 'var(--primary-400)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Looking for something?</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ color: 'var(--primary-400)', fontSize: '0.875rem', textDecoration: 'none' }}>Sign In</Link>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <Link to="/register" style={{ color: 'var(--primary-400)', fontSize: '0.875rem', textDecoration: 'none' }}>Create Account</Link>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <Link to="/" style={{ color: 'var(--primary-400)', fontSize: '0.875rem', textDecoration: 'none' }}>Landing Page</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
