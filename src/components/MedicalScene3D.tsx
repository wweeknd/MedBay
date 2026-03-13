import React, { useEffect, useRef, useState } from 'react';

/*  ───────────────────────────────────────────────────────────
    MedicalScene3D
    ───────────────────────────────────────────────────────────
    A constellation of medical-themed SVG icons floating in 3D space.
    They rotate on multiple axes as the user scrolls, creating an
    interlocking / orbiting effect — like medical gears in 3D.
    ─────────────────────────────────────────────────────────── */

interface MedicalIcon {
  id: string;
  x: string;           // CSS left position
  y: string;           // CSS top position
  size: number;        // px
  rotateSpeed: number; // multiplier on scroll progress
  rotateAxis: string;  // 'X' | 'Y' | 'Z' or combo
  floatDelay: number;  // animation delay for idle float
  opacity: number;     // base opacity
  render: (color: string) => React.ReactNode;
}

/* ==================== INDIVIDUAL MEDICAL ICONS ==================== */

const DNAStrand = ({ color }: { color: string }) => (
  <svg viewBox="0 0 60 120" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    {/* Left rail */}
    <path d="M15 5 C15 20, 45 30, 45 45 C45 60, 15 70, 15 85 C15 100, 45 110, 45 115" opacity="0.7" />
    {/* Right rail */}
    <path d="M45 5 C45 20, 15 30, 15 45 C15 60, 45 70, 45 85 C45 100, 15 110, 15 115" opacity="0.7" />
    {/* Rungs */}
    <line x1="18" y1="12" x2="42" y2="12" opacity="0.4" />
    <line x1="26" y1="24" x2="34" y2="24" opacity="0.4" />
    <line x1="42" y1="36" x2="18" y2="36" opacity="0.4" />
    <line x1="34" y1="48" x2="26" y2="48" opacity="0.4" />
    <line x1="18" y1="60" x2="42" y2="60" opacity="0.4" />
    <line x1="26" y1="72" x2="34" y2="72" opacity="0.4" />
    <line x1="42" y1="84" x2="18" y2="84" opacity="0.4" />
    <line x1="34" y1="96" x2="26" y2="96" opacity="0.4" />
    {/* Node dots */}
    <circle cx="15" cy="5" r="3" fill={color} opacity="0.5" />
    <circle cx="45" cy="45" r="3" fill={color} opacity="0.5" />
    <circle cx="15" cy="85" r="3" fill={color} opacity="0.5" />
    <circle cx="45" cy="115" r="3" fill={color} opacity="0.5" />
  </svg>
);

const MedicalCross = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="28" y="8" width="24" height="64" rx="4" fill={color} stroke={color} strokeWidth="1.5" opacity="0.3" />
    <rect x="8" y="28" width="64" height="24" rx="4" fill={color} stroke={color} strokeWidth="1.5" opacity="0.3" />
    <rect x="32" y="12" width="16" height="56" rx="2" fill={color} opacity="0.1" />
    <rect x="12" y="32" width="56" height="16" rx="2" fill={color} opacity="0.1" />
  </svg>
);

const Heartbeat = ({ color }: { color: string }) => (
  <svg viewBox="0 0 140 60" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="0,30 20,30 30,30 38,10 46,50 54,20 62,35 70,30 80,30 88,15 96,45 104,25 112,32 120,30 140,30" opacity="0.6" />
    {/* Glow pulse dot */}
    <circle cx="54" cy="20" r="4" fill={color} opacity="0.3">
      <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const PillCapsule = ({ color }: { color: string }) => (
  <svg viewBox="0 0 40 80" fill="none">
    <rect x="5" y="5" width="30" height="70" rx="15" stroke={color} strokeWidth="2" opacity="0.5" />
    <rect x="5" y="40" width="30" height="35" rx="15" fill={color} opacity="0.15" />
    <line x1="5" y1="40" x2="35" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4" />
    {/* Highlight */}
    <ellipse cx="16" cy="22" rx="4" ry="8" fill={color} opacity="0.08" />
  </svg>
);

const StethoscopeHead = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 90" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    {/* Earpieces */}
    <path d="M20 5 L20 25" opacity="0.5" />
    <path d="M60 5 L60 25" opacity="0.5" />
    {/* Y connector */}
    <path d="M20 25 C20 45, 40 50, 40 55" opacity="0.5" />
    <path d="M60 25 C60 45, 40 50, 40 55" opacity="0.5" />
    {/* Tube */}
    <path d="M40 55 L40 65" opacity="0.5" />
    {/* Chest piece */}
    <circle cx="40" cy="74" r="12" fill={color} stroke={color} strokeWidth="2" opacity="0.3" />
    <circle cx="40" cy="74" r="6" fill={color} opacity="0.08" />
    {/* Ear tips */}
    <circle cx="20" cy="5" r="3" fill={color} opacity="0.3" />
    <circle cx="60" cy="5" r="3" fill={color} opacity="0.3" />
  </svg>
);

const RxSymbol = ({ color }: { color: string }) => (
  <svg viewBox="0 0 70 80" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* R stem */}
    <line x1="15" y1="10" x2="15" y2="70" opacity="0.5" />
    {/* R top arc */}
    <path d="M15 10 L35 10 C50 10, 50 30, 35 35 L15 35" opacity="0.5" />
    {/* R leg + x tail */}
    <line x1="30" y1="35" x2="55" y2="70" opacity="0.5" />
    <line x1="55" y1="35" x2="30" y2="70" opacity="0.4" />
  </svg>
);

/* ==================== SCENE CONFIG ==================== */

const medicalIcons: MedicalIcon[] = [
  {
    id: 'dna',
    x: '8%', y: '15%',
    size: 90,
    rotateSpeed: 1,
    rotateAxis: 'Y',
    floatDelay: 0,
    opacity: 0.55,
    render: (c) => <DNAStrand color={c} />,
  },
  {
    id: 'cross',
    x: '85%', y: '10%',
    size: 70,
    rotateSpeed: -0.7,
    rotateAxis: 'Z',
    floatDelay: 1,
    opacity: 0.45,
    render: (c) => <MedicalCross color={c} />,
  },
  {
    id: 'heartbeat',
    x: '65%', y: '70%',
    size: 130,
    rotateSpeed: 0.5,
    rotateAxis: 'X',
    floatDelay: 0.5,
    opacity: 0.4,
    render: (c) => <Heartbeat color={c} />,
  },
  {
    id: 'pill',
    x: '3%', y: '65%',
    size: 50,
    rotateSpeed: 1.3,
    rotateAxis: 'Y',
    floatDelay: 1.5,
    opacity: 0.45,
    render: (c) => <PillCapsule color={c} />,
  },
  {
    id: 'stethoscope',
    x: '90%', y: '50%',
    size: 75,
    rotateSpeed: -0.9,
    rotateAxis: 'X',
    floatDelay: 0.7,
    opacity: 0.4,
    render: (c) => <StethoscopeHead color={c} />,
  },
  {
    id: 'rx',
    x: '18%', y: '80%',
    size: 55,
    rotateSpeed: 0.8,
    rotateAxis: 'Z',
    floatDelay: 2,
    opacity: 0.35,
    render: (c) => <RxSymbol color={c} />,
  },
];

/* ==================== MAIN COMPONENT ==================== */

const MedicalScene3D: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    let mTicking = false;
    const onMouse = (e: MouseEvent) => {
      if (!mTicking) {
        requestAnimationFrame(() => {
          setMouse({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          });
          mTicking = false;
        });
        mTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const color = '#A85D34'; // terracotta

  return (
    <div ref={containerRef} className="medical-scene-3d" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', perspective: '1000px' }}>
      {medicalIcons.map((icon) => {
        const scrollAngle = scrollY * icon.rotateSpeed * 0.15;
        const mouseShiftX = mouse.x * 12 * (icon.rotateSpeed > 0 ? 1 : -1);
        const mouseShiftY = mouse.y * 8 * (icon.rotateSpeed > 0 ? 1 : -1);

        let transform = '';
        if (icon.rotateAxis === 'X') {
          transform = `rotateX(${scrollAngle}deg) rotateZ(${scrollAngle * 0.3}deg)`;
        } else if (icon.rotateAxis === 'Y') {
          transform = `rotateY(${scrollAngle}deg) rotateX(${scrollAngle * 0.2}deg)`;
        } else {
          transform = `rotateZ(${scrollAngle}deg) rotateY(${scrollAngle * 0.15}deg)`;
        }

        transform += ` translate(${mouseShiftX}px, ${mouseShiftY}px)`;

        return (
          <div
            key={icon.id}
            className="medical-icon-3d"
            style={{
              position: 'absolute',
              left: icon.x,
              top: icon.y,
              width: icon.size,
              height: icon.size,
              opacity: icon.opacity,
              transform,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s ease-out',
              animation: `float ${3 + icon.floatDelay}s ease-in-out ${icon.floatDelay}s infinite`,
            }}
          >
            {icon.render(color)}
          </div>
        );
      })}

      {/* Faint connecting lines between icons */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="10" y1="20" x2="85" y2="15" stroke={color} strokeWidth="0.15" opacity="0.15" />
        <line x1="85" y1="15" x2="90" y2="55" stroke={color} strokeWidth="0.15" opacity="0.12" />
        <line x1="90" y1="55" x2="65" y2="75" stroke={color} strokeWidth="0.15" opacity="0.1" />
        <line x1="65" y1="75" x2="20" y2="85" stroke={color} strokeWidth="0.15" opacity="0.12" />
        <line x1="20" y1="85" x2="5" y2="70" stroke={color} strokeWidth="0.15" opacity="0.1" />
        <line x1="5" y1="70" x2="10" y2="20" stroke={color} strokeWidth="0.15" opacity="0.15" />
      </svg>
    </div>
  );
};

export default MedicalScene3D;
