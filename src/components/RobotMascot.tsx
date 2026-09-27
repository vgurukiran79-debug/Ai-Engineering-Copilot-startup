import React from 'react';

interface RobotMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  isFloating?: boolean;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  size = 'md',
  className = '',
  isFloating = false,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44 md:w-52 md:h-52',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${dim} ${
        isFloating ? 'animate-bounce-subtle' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,210,255,0.35)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="cyberArcGrad" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          <linearGradient id="robotBodyGrad" x1="140" y1="110" x2="260" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="robotShadeGrad" x1="120" y1="120" x2="280" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="150" y1="130" x2="250" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="50%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#0A0E17" />
          </linearGradient>

          <linearGradient id="bookGrad" x1="100" y1="260" x2="300" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Side Cyber Circuits */}
        <g stroke="#00D2FF" strokeWidth="2.5" opacity="0.85" strokeLinecap="round">
          <path d="M 80 180 L 120 180 L 135 160" />
          <circle cx="80" cy="180" r="4.5" fill="#00D2FF" />
          <path d="M 70 215 L 110 215 L 130 235" />
          <circle cx="70" cy="215" r="4.5" fill="#00D2FF" />
          <path d="M 95 145 L 130 145 L 142 130" />
          <circle cx="95" cy="145" r="3.5" fill="#00D2FF" />
        </g>

        {/* Right Side Futuristic Gear Motif */}
        <g opacity="0.85" transform="translate(265, 125)">
          <path
            d="M 45 10 L 55 12 L 58 24 L 70 30 L 80 25 L 87 34 L 80 44 L 87 56 L 98 62 L 95 74 L 83 78 L 77 89 L 83 99 L 72 106 L 62 99 L 50 103 L 45 115 L 33 113 L 30 101 L 18 95 L 8 100 L 1 91 L 8 81 L 1 69 L -10 63 L -7 51 L 5 47 L 11 36 L 5 26 L 16 19 L 26 26 L 38 22 Z"
            fill="none"
            stroke="url(#cyberArcGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="44" cy="62" r="22" fill="#070B14" stroke="url(#cyberArcGrad)" strokeWidth="3" />
        </g>

        {/* Top Floating Cyber Bubble */}
        <g transform="translate(245, 70)" filter="url(#cyanGlow)">
          <rect x="0" y="0" width="56" height="42" rx="14" fill="#00D2FF" />
          <polygon points="12,42 22,42 14,50" fill="#00D2FF" />
          {/* 3 Message Dots */}
          <circle cx="16" cy="21" r="3.5" fill="#070B14" />
          <circle cx="28" cy="21" r="3.5" fill="#070B14" />
          <circle cx="40" cy="21" r="3.5" fill="#070B14" />
        </g>

        {/* Outer Circular Cyber Halo Arc */}
        <path
          d="M 95 240 A 135 135 0 1 1 315 220"
          stroke="url(#cyberArcGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />

        {/* Antenna with Cyan Tip */}
        <line x1="200" y1="110" x2="160" y2="85" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="155" cy="82" r="7" fill="#00D2FF" filter="url(#cyanGlow)" />

        {/* Robot Head Outer Shell */}
        <ellipse cx="200" cy="165" rx="66" ry="62" fill="url(#robotBodyGrad)" stroke="#CBD5E1" strokeWidth="3.5" />

        {/* Headphones / Ear Pods */}
        {/* Left Ear */}
        <rect x="126" y="142" width="14" height="42" rx="7" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="133" cy="163" r="5" fill="#00D2FF" filter="url(#cyanGlow)" />
        {/* Right Ear */}
        <rect x="260" y="142" width="14" height="42" rx="7" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="267" cy="163" r="5" fill="#00D2FF" filter="url(#cyanGlow)" />

        {/* Visor Screen */}
        <rect
          x="148"
          y="132"
          width="104"
          height="66"
          rx="22"
          fill="url(#visorGrad)"
          stroke="#00D2FF"
          strokeWidth="2.5"
          filter="url(#neonGlow)"
        />

        {/* Smiling Happy Cyan Eyes inside Visor */}
        <g stroke="#00D2FF" strokeWidth="4.5" strokeLinecap="round" fill="none" filter="url(#cyanGlow)">
          {/* Left Eye (Curved Joy Smile) */}
          <path d="M 170 162 Q 180 150 190 162" />
          {/* Right Eye (Curved Joy Smile) */}
          <path d="M 210 162 Q 220 150 230 162" />
          {/* Cute Mouth Smile */}
          <path d="M 194 175 Q 200 181 206 175" strokeWidth="3" />
        </g>

        {/* Cute Visor Reflection Highlight */}
        <path
          d="M 158 140 Q 180 136 210 138"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity="0.3"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect x="188" y="222" width="24" height="12" rx="4" fill="#475569" />

        {/* Robot Torso & Chest Plate */}
        <path
          d="M 160 232 C 160 232 170 230 200 230 C 230 230 240 232 240 232 C 248 245 252 270 252 276 L 148 276 C 148 270 152 245 160 232 Z"
          fill="url(#robotBodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* "AI" Typography Badge on Chest */}
        <text
          x="200"
          y="262"
          textAnchor="middle"
          fill="#0284C7"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="1.5"
        >
          AI
        </text>

        {/* Robot Arms resting on open book */}
        {/* Left Arm */}
        <path
          d="M 156 242 C 142 254 135 275 145 292 C 152 295 170 293 175 285"
          fill="url(#robotBodyGrad)"
          stroke="#94A3B8"
          strokeWidth="3"
        />
        {/* Right Arm */}
        <path
          d="M 244 242 C 258 254 265 275 255 292 C 248 295 230 293 225 285"
          fill="url(#robotBodyGrad)"
          stroke="#94A3B8"
          strokeWidth="3"
        />

        {/* Open Holographic / Cyber Book */}
        <g filter="url(#cyanGlow)">
          {/* Left Page */}
          <path
            d="M 200 286 C 170 282 135 286 110 298 L 118 318 C 142 308 174 304 200 306 Z"
            fill="url(#bookGrad)"
            stroke="#00D2FF"
            strokeWidth="2"
          />
          {/* Right Page */}
          <path
            d="M 200 286 C 230 282 265 286 290 298 L 282 318 C 258 308 226 304 200 306 Z"
            fill="url(#bookGrad)"
            stroke="#00D2FF"
            strokeWidth="2"
          />
          {/* Book Spine */}
          <line x1="200" y1="286" x2="200" y2="308" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Holographic Glowing Lines on Book Pages */}
          <path d="M 126 305 L 180 296" stroke="#BAE6FD" strokeWidth="1.5" opacity="0.8" />
          <path d="M 132 312 L 182 302" stroke="#BAE6FD" strokeWidth="1.5" opacity="0.8" />
          <path d="M 218 296 L 272 305" stroke="#BAE6FD" strokeWidth="1.5" opacity="0.8" />
          <path d="M 216 302 L 266 312" stroke="#BAE6FD" strokeWidth="1.5" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
};
