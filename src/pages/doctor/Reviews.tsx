import React from 'react';
import { mockReviews } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import type { DoctorProfile } from '../../types';
import { Star, TrendingUp, MessageSquare } from 'lucide-react';

const Reviews: React.FC = () => {
  const { user } = useAuth();
  const doctor = user as DoctorProfile;
  const reviews = mockReviews;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: (reviews.filter(r => r.rating === stars).length / (reviews.length || 1)) * 100,
  }));

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><Star size={28} style={{ color: 'var(--warning-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Reviews & Ratings</h1>
        <p>See what your patients are saying about their experience.</p>
      </div>

      {/* Rating Summary */}
      <div className="glass-card animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="rating-summary">
          <div className="rating-summary-left">
            <div className="rating-big">{avgRating.toFixed(1)}</div>
            <div className="star-rating" style={{ marginBottom: '0.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} fill={i < Math.round(avgRating) ? 'var(--warning-400)' : 'none'} className={`star ${i < Math.round(avgRating) ? 'filled' : 'empty'}`} />
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Based on {doctor.totalReviews} reviews</p>
          </div>
          <div className="rating-summary-right">
            {ratingCounts.map(rc => (
              <div key={rc.stars} className="rating-bar-row">
                <span className="rating-bar-label">{rc.stars} <Star size={12} fill="var(--warning-400)" style={{ color: 'var(--warning-400)' }} /></span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-bar-fill" style={{ width: `${rc.percentage}%`, background: 'var(--warning-400)' }} />
                </div>
                <span className="rating-bar-count">{rc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {reviews.map((review, index) => (
          <div key={review.id} className="glass-card animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar" style={{ background: `linear-gradient(135deg, hsl(${index * 80 + 200}, 70%, 50%), hsl(${index * 80 + 240}, 70%, 40%))` }}>
                  {review.patientName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{review.patientName}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="star-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? 'var(--warning-400)' : 'none'} className={`star ${i < review.rating ? 'filled' : 'empty'}`} />
                ))}
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
