import React, { useEffect, useState } from 'react';
import MinecraftHeart from './MinecraftHeart';

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'heart' | 'text' | 'exit'>('heart');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(onComplete, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${phase === 'exit' ? 'intro-exit' : ''}`}>
      <div className="intro-content">
        {/* Heart with pulse */}
        <div className={`intro-heart ${phase !== 'heart' ? 'intro-heart-settled' : ''}`}>
          <MinecraftHeart size={80} />
        </div>
        {/* Text reveal */}
        <div className={`intro-text ${phase === 'text' || phase === 'exit' ? 'intro-text-visible' : ''}`}>
          <span className="intro-title">Med<span style={{ color: '#A85D34' }}>Bay</span></span>
          <span className="intro-tagline">Your records. Your control.</span>
        </div>
      </div>
      {/* Decorative heartbeat line */}
      <svg className="intro-heartbeat" viewBox="0 0 400 60" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round">
        <polyline className="intro-heartbeat-line" points="0,30 60,30 80,30 100,8 120,52 140,20 160,35 180,30 220,30 240,12 260,48 280,25 300,32 320,30 400,30" />
      </svg>
    </div>
  );
};

export default IntroAnimation;
