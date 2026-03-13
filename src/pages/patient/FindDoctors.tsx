import React, { useState, useMemo } from 'react';
import { mockDoctors } from '../../data/mockData';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  Search, MapPin, Star, Clock, DollarSign, Award,
  ChevronRight, Filter, Globe, CheckCircle
} from 'lucide-react';

const specializations = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Psychiatry', 'General Medicine', 'Pediatrics'];

const FindDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const filteredDoctors = useMemo(() => {
    let results = mockDoctors;

    if (searchTerm.trim()) {
      const fuse = new Fuse(mockDoctors, {
        keys: ['displayName', 'specialization', 'hospital', 'bio', 'languages'],
        threshold: 0.3,
        ignoreLocation: true
      });
      results = fuse.search(searchTerm).map(result => result.item);
    }

    if (selectedSpec !== 'All') {
      results = results.filter(doc => doc.specialization === selectedSpec);
    }

    return results;
  }, [searchTerm, selectedSpec]);

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><Search size={28} style={{ color: 'var(--accent-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Find Doctors</h1>
        <p>Search and connect with verified healthcare professionals across specializations.</p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="search-bar" style={{ marginBottom: 'var(--space-lg)' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, specialization, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="doctor-search"
          />
        </div>
        <div className="specialization-filters">
          {specializations.map(spec => (
            <button
              key={spec}
              className={`spec-filter-btn ${selectedSpec === spec ? 'active' : ''}`}
              onClick={() => setSelectedSpec(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count animate-fade-in-up stagger-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
        <Filter size={16} style={{ color: 'var(--text-tertiary)' }} />
        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Doctor Cards */}
      <div className="doctors-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {filteredDoctors.map((doctor, index) => (
          <div key={doctor.uid} className="doctor-card glass-card animate-fade-in-up" 
               style={{ 
                 animationDelay: `${0.1 * (index + 1)}s`, 
                 opacity: 0, 
                 position: 'relative', 
                 overflow: 'hidden',
                 border: '1px solid var(--border-primary)',
                 background: 'var(--bg-card)',
                 boxShadow: 'var(--shadow-md)'
               }}>
            {/* Subtle background glow */}
            <div style={{ 
              position: 'absolute', 
              top: '-50px', 
              right: '-50px', 
              width: '200px', 
              height: '200px', 
              background: 'radial-gradient(circle, var(--primary-100) 0%, transparent 70%)', 
              opacity: 0.3, 
              pointerEvents: 'none',
              zIndex: 0
            }} />
            <div className="doctor-card-content">
              <div className="doctor-card-left">
                <div className="avatar avatar-xl" style={{ background: `linear-gradient(135deg, hsl(${index * 60 + 180}, 70%, 50%), hsl(${index * 60 + 220}, 70%, 40%))` }}>
                  {doctor.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              </div>
              <div className="doctor-card-middle">
                <div className="doctor-card-name-row">
                  <h3>{doctor.displayName}</h3>
                  {doctor.isVerified && (
                    <span className="verified-badge"><CheckCircle size={14} /> Verified</span>
                  )}
                </div>
                <p className="doctor-specialization">{doctor.specialization}</p>
                <p className="doctor-hospital"><MapPin size={14} /> {doctor.hospital}</p>

                <div className="doctor-meta-row">
                  <span className="doctor-meta-item">
                    <Star size={14} style={{ color: 'var(--warning-400)' }} />
                    <strong>{doctor.rating}</strong> ({doctor.totalReviews} reviews)
                  </span>
                  <span className="doctor-meta-item">
                    <Clock size={14} /> {doctor.yearsOfExperience} yrs experience
                  </span>
                  <span className="doctor-meta-item">
                    <Globe size={14} /> {doctor.languages.join(', ')}
                  </span>
                </div>

                <div className="doctor-qualifications">
                  {doctor.qualifications.slice(0, 2).map((q, i) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      <Award size={10} /> {q}
                    </span>
                  ))}
                </div>
              </div>
              <div className="doctor-card-right">
                <div className="consultation-fee">
                  <DollarSign size={16} />
                  <span className="fee-amount">${doctor.consultationFee}</span>
                  <span className="fee-label">per consultation</span>
                </div>
                <Link to={`/doctor/profile/${doctor.uid}`} className="btn btn-primary" id={`view-doctor-${doctor.uid}`}>
                  View Profile <ChevronRight size={16} />
                </Link>
                <Link to={`/patient/consultations?doctor=${doctor.uid}`} className="btn btn-outline" id={`consult-doctor-${doctor.uid}`}>
                  Request Consultation
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="empty-state">
          <Search size={64} />
          <h3>No doctors found</h3>
          <p>Try adjusting your search terms or broadening your specialization filter.</p>
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
