import { useEffect, useRef, useState, useCallback } from 'react';

// ==================== SCROLL-LINKED 3D ROTATION ====================
export function useScrollRotation(intensity: number = 1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const viewH = window.innerHeight;
          const center = rect.top + rect.height / 2;
          const progress = (center - viewH / 2) / (viewH / 2); // -1 to 1
          const rotX = progress * 3 * intensity;
          const rotZ = progress * 1.5 * intensity;
          const translateZ = Math.abs(progress) * -20 * intensity;
          el.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) translateZ(${translateZ}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity]);

  return ref;
}

// ==================== MOUSE TILT EFFECT ====================
export function useMouseTilt(maxTilt: number = 8) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = x * maxTilt;
      const rotX = -y * maxTilt;
      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      el.style.transition = 'transform 0.1s ease-out';
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      el.style.transition = 'transform 0.5s ease-out';
    };

    el.addEventListener('mousemove', handleMouse);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouse);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [maxTilt]);

  return ref;
}

// ==================== SCROLL PARALLAX ====================
export function useScrollParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          el.style.transform = `translateY(${scrollY * speed}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// ==================== INTERSECTION OBSERVER REVEAL ====================
export function useScrollReveal(threshold: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ==================== MOUSE POSITION TRACKER ====================
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleMouse = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setPos({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return pos;
}

// ==================== SCROLL PROGRESS ====================
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docH = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docH > 0 ? scrollY / docH : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
