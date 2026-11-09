import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface NavbarHorseProgressProps {
  onOpenDriveSaveModal: () => void;
  isDriveConnected: boolean;
  userEmail?: string | null;
}

export const NavbarHorseProgress: React.FC<NavbarHorseProgressProps> = ({
  onOpenDriveSaveModal,
  isDriveConnected,
  userEmail,
}) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      setProgressPct(Math.max(0, Math.min(1, v)));
    });
  }, [smoothProgress]);

  // Calculate position along a gentle curved arc for the horse silhouette
  const trackWidth = 180;
  const horseX = progressPct * (trackWidth - 28) + 14;
  const horseY = 12 - Math.sin(progressPct * Math.PI) * 5;
  const gallopTilt = Math.sin(progressPct * Math.PI * 16) * 4;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 pt-3 pb-2 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-5 py-2.5 rounded-full bg-[#1F3D2B]/80 backdrop-blur-md border border-[#E8DCC4]/25 shadow-[0_10px_30px_rgba(0,0,0,0.28)] pointer-events-auto">
        {/* Zone 1: Brand Title */}
        <a
          href="#our-summer"
          className="font-editorial text-base sm:text-lg font-semibold tracking-tight text-[#F5EFE6] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
        >
          For Prof. Lucy Turner
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#E8DCC4]/85"
        >
          <a
            href="#our-summer"
            className="hover:text-[#F5EFE6] hover:underline underline-offset-4 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            Our Summer
          </a>
          <a
            href="#the-letter"
            className="hover:text-[#F5EFE6] hover:underline underline-offset-4 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            The Letter
          </a>
          <a
            href="#memories"
            className="hover:text-[#F5EFE6] hover:underline underline-offset-4 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            Memories
          </a>
          <a
            href="#curations"
            className="hover:text-[#F5EFE6] hover:underline underline-offset-4 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            Equestrian &amp; Anime Curations
          </a>
        </nav>

        {/* Zone 3: Curved SVG Horse Progress & Keepsake Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Minimalist SVG Galloping Horse along curved path */}
          <div
            className="hidden lg:flex items-center relative w-[180px] h-8 select-none"
            title={`Reading Progress: ${Math.round(progressPct * 100)}%`}
          >
            <svg
              viewBox="0 0 180 26"
              className="w-full h-full overflow-visible"
              fill="none"
            >
              {/* Subtle background curved path */}
              <path
                d="M 10 18 Q 90 6 170 18"
                stroke="rgba(232, 220, 196, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
              {/* Active golden trail path */}
              <motion.path
                d="M 10 18 Q 90 6 170 18"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                style={{ pathLength: smoothProgress }}
              />

              {/* Start & End markers */}
              <circle cx="10" cy="18" r="2.2" fill="#E8DCC4" opacity="0.6" />
              <circle cx="170" cy="18" r="2.5" fill="#D4AF37" />

              {/* Minimalist Line-Art Galloping Horse Silhouette */}
              <g
                transform={`translate(${horseX - 11}, ${horseY - 9}) rotate(${gallopTilt}, 11, 9)`}
              >
                <path
                  d="M3 13 C5 11, 7 10, 9 10 L13 9 C14.5 7, 16 5, 17.5 4.5 C18.5 4.2, 19.5 5, 19 6.2 C18.5 7.2, 17.2 8, 16.5 9.2 L17.5 11.5 C19 12.2, 20.5 13, 21.5 14 M15 11.5 L16.5 15.5 M9.5 11.5 L7.5 15.5 M8 10.5 C6 9.5, 4 10, 2 11.5"
                  stroke="#F5EFE6"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="17.5" cy="5.6" r="0.7" fill="#D4AF37" />
              </g>
            </svg>
          </div>

          <button
            onClick={onOpenDriveSaveModal}
            title={
              isDriveConnected && userEmail
                ? `Connected to Google Drive (${userEmail})`
                : 'Save Keepsake Archive to Google Drive'
            }
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8DCC4] text-[#1F3D2B] hover:bg-[#F5EFE6] transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isDriveConnected ? 'Save Keepsake to Drive' : 'Save to Drive'}
          </button>
        </div>
      </div>
    </header>
  );
};
