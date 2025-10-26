
import React, { useEffect, useRef } from 'react';

interface CelebrationOverlayProps {
  isActive: boolean;
  message: string;
  onComplete: () => void;
}

const FIREWORK_COUNT = 50;
const COLORS = ['#FFD700', '#FF6B9D', '#FFA07A', '#FFFFFF', '#FF8C42'];

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ isActive, message, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < FIREWORK_COUNT; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        
        const size = Math.random() * 8 + 2;
        firework.style.width = `${size}px`;
        firework.style.height = `${size}px`;

        const spreadX = (Math.random() - 0.5) * window.innerWidth * 1.2;
        const spreadY = (Math.random() - 0.5) * window.innerHeight * 1.2;
        firework.style.setProperty('--spread-x', `${spreadX}px`);
        firework.style.setProperty('--spread-y', `${spreadY}px`);

        const animation = firework.animate(
          [
            { transform: 'scale(1)', opacity: 1 },
            { transform: `scale(1.5) translate(${spreadX}px, ${spreadY}px)`, opacity: 0 }
          ],
          {
            duration: 1500 + Math.random() * 500,
            easing: 'ease-out',
            delay: Math.random() * 200
          }
        );
        animation.onfinish = () => firework.remove();
        container.appendChild(firework);
      }

      const timer = setTimeout(() => {
        onComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-red-800/95 via-pink-700/95 to-red-900/95 flex flex-col justify-center items-center z-[200] transition-all duration-700 ease-out ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
      <div
        id="celebration-text"
        className="font-['Dancing_Script'] text-3xl md:text-5xl lg:text-6xl text-center text-yellow-300 p-4"
        style={{ textShadow: '0 0 30px rgba(255,215,0,1)' }}
      >
        {message}
      </div>
    </div>
  );
};
