import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee,
  Sparkles,
  FolderCheck,
  ExternalLink,
  X,
  Loader2,
  Heart,
} from 'lucide-react';
import {
  ANIME_CURATIONS,
  LETTER_PARAGRAPHS,
  LETTER_SALUTATION,
  LETTER_SIGNOFF,
  MemoryFrame,
} from '../data/content';
import { googleSignIn, saveKeepsakeToDrive } from '../services/googleDrive';

interface TreatParticle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  symbol: 'horse' | 'carrot' | 'coffee' | 'horseshoe' | 'gold';
}

interface CelebrationFooterProps {
  memories: MemoryFrame[];
  confirmSaveModalOpen: boolean;
  setConfirmSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDriveConnected: boolean;
  onDriveAuthSuccess: (email?: string | null) => void;
}

export const CelebrationFooter: React.FC<CelebrationFooterProps> = ({
  memories,
  confirmSaveModalOpen,
  setConfirmSaveModalOpen,
  isDriveConnected,
  onDriveAuthSuccess,
}) => {
  const [celebratedCount, setCelebratedCount] = useState(0);
  const [particles, setParticles] = useState<TreatParticle[]>([]);
  const [isSavingDrive, setIsSavingDrive] = useState(false);
  const [savedDriveFile, setSavedDriveFile] = useState<{
    id: string;
    name: string;
    webViewLink?: string;
  } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const triggerCelebration = () => {
    setCelebratedCount((c) => c + 1);
    const symbols: TreatParticle['symbol'][] = [
      'horse',
      'carrot',
      'coffee',
      'horseshoe',
      'gold',
    ];
    const now = Date.now();
    const burst: TreatParticle[] = Array.from({ length: 22 }, (_, i) => ({
      id: now + i,
      x: (Math.random() - 0.5) * 360,
      y: -Math.random() * 210 - 50,
      rotate: (Math.random() - 0.5) * 140,
      scale: Math.random() * 0.55 + 0.75,
      symbol: symbols[i % symbols.length],
    }));

    setParticles((prev) => [...prev.slice(-15), ...burst]);
  };

  const buildKeepsakeHtml = () => {
    const letterHtml = LETTER_PARAGRAPHS.map(
      (p) =>
        `<p style="margin-bottom: 18px; line-height: 1.8; font-size: 16px;">${p.segments
          .map((s) =>
            s.highlight
              ? `<mark style="background: rgba(212,175,55,0.28); padding: 2px 4px; border-radius: 4px;">${s.text}</mark>`
              : s.text
          )
          .join('')}</p>`
    ).join('');

    const curationsHtml = ANIME_CURATIONS.map(
      (c) =>
        `<li style="margin-bottom: 14px;"><strong>${c.title} (${c.japaneseTitle})</strong> — <em>${c.tags.join(
          ' · '
        )}</em><br/>${c.pitch}</li>`
    ).join('');

    const memoriesHtml = memories
      .map(
        (m) =>
          `<li style="margin-bottom: 12px;"><strong>${m.caption}</strong> (${m.dateLabel})<br/><em>“${m.aiInsight}”</em></li>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Gratitude Keepsake for Professor Lucy Turner — From Amirbek Orifjonov</title>
</head>
<body style="font-family: Georgia, serif; background: #F5EFE6; color: #1F3D2B; padding: 48px; max-width: 780px; margin: 0 auto;">
  <div style="border: 1px solid #1F3D2B; padding: 36px; border-radius: 16px; background: #FFFFFF;">
    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #2D5A40;">Babson Summer Study 2026 · Entrepreneurial Leadership · From Uzbekistan to Wellesley</p>
    <h1 style="font-size: 28px; margin-top: 8px; margin-bottom: 24px;">Great mentors don’t just teach you how to build ventures—they teach you how to build communities.</h1>
    <hr style="border: none; border-top: 1px solid #E8DCC4; margin: 24px 0;" />
    <p style="font-style: italic; font-size: 20px;">${LETTER_SALUTATION}</p>
    ${letterHtml}
    <p style="margin-top: 28px;"><em>${LETTER_SIGNOFF.closing}</em><br/><strong>${LETTER_SIGNOFF.name}</strong><br/>${LETTER_SIGNOFF.location}</p>
    <hr style="border: none; border-top: 1px solid #E8DCC4; margin: 32px 0;" />
    <h2 style="font-size: 20px;">Summer Study 2026 Classroom Memories</h2>
    <ul>${memoriesHtml}</ul>
    <h2 style="font-size: 20px; margin-top: 28px;">For Your Next Day Off: Where Horses, Ventures &amp; Anime Meet</h2>
    <ul>${curationsHtml}</ul>
  </div>
</body>
</html>`;
  };

  const handleConfirmSaveToDrive = async () => {
    setSaveError(null);
    setIsSavingDrive(true);

    try {
      if (!isDriveConnected) {
        const authRes = await googleSignIn();
        if (!authRes) {
          throw new Error('Google Sign-In was not completed.');
        }
        onDriveAuthSuccess(authRes.user.email);
      }

      const fileName =
        'Babson_Summer_Study_2026_Gratitude_Professor_Lucy_Turner.html';
      const htmlContent = buildKeepsakeHtml();
      const result = await saveKeepsakeToDrive({ fileName, htmlContent });
      setSavedDriveFile(result);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') {
        try {
          const authRes = await googleSignIn();
          if (authRes) {
            onDriveAuthSuccess(authRes.user.email);
            const fileName =
              'Babson_Summer_Study_2026_Gratitude_Professor_Lucy_Turner.html';
            const htmlContent = buildKeepsakeHtml();
            const result = await saveKeepsakeToDrive({ fileName, htmlContent });
            setSavedDriveFile(result);
          }
        } catch (retryErr: any) {
          setSaveError(
            retryErr?.message || 'Could not authenticate with Google Drive.'
          );
        }
      } else {
        setSaveError(
          err?.message || 'Could not save keepsake archive to Google Drive.'
        );
      }
    } finally {
      setIsSavingDrive(false);
    }
  };

  return (
    <footer className="relative pt-20 pb-28 px-4 sm:px-8 z-10 overflow-hidden border-t border-[#E8DCC4]/15 bg-gradient-to-b from-transparent to-[#162C1F]">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-3">
          04 · With Warmest Regards From Gulistan to Wellesley
        </div>

        <h2
          className="font-editorial text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight mb-4"
          style={{ textWrap: 'balance' }}
        >
          Send a Virtual Carrot &amp; Morning Coffee
        </h2>

        <p className="text-sm sm:text-base text-[#E8DCC4]/80 max-w-xl mx-auto mb-10 leading-relaxed">
          A small celebratory toast to early morning barn rounds, FME case
          discussions, and mentors who make a lifelong difference.
        </p>

        {/* Interactive Celebration Trigger & Particle Burst */}
        <div className="relative inline-flex flex-col items-center">
          {/* Particle Burst Layer */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          >
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: p.x,
                    y: p.y,
                    scale: p.scale,
                    rotate: p.rotate,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute select-none"
                >
                  {p.symbol === 'horse' && (
                    <span className="text-2xl">🐎</span>
                  )}
                  {p.symbol === 'carrot' && (
                    <span className="text-2xl">🥕</span>
                  )}
                  {p.symbol === 'coffee' && (
                    <span className="text-2xl">☕</span>
                  )}
                  {p.symbol === 'horseshoe' && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37] text-[#D4AF37] font-editorial font-bold text-sm">
                      Ω
                    </span>
                  )}
                  {p.symbol === 'gold' && (
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Primary Micro-Interaction Button */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={triggerCelebration}
              className="relative px-8 py-4 rounded-full bg-[#E8DCC4] text-[#1F3D2B] hover:bg-[#F5EFE6] font-semibold text-sm sm:text-base shadow-[0_14px_35px_rgba(0,0,0,0.35)] border border-[#D4AF37]/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Celebrate with a Virtual Treat 🐎☕
              {celebratedCount > 0 && (
                <span className="ml-2.5 px-2 py-0.5 rounded-full bg-[#1F3D2B] text-[#D4AF37] text-xs font-mono tabular-nums">
                  +{celebratedCount}
                </span>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setSavedDriveFile(null);
                setSaveError(null);
                setConfirmSaveModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#2D5A40]/70 hover:bg-[#2D5A40] text-[#F5EFE6] border border-[#E8DCC4]/30 font-medium text-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <FolderCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Keepsake Archive to Google Drive</span>
            </button>
          </div>
        </div>

        {/* Warm Closing Banner Revealed on Click */}
        <AnimatePresence>
          {celebratedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#F5EFE6] text-[#1F3D2B] border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-center gap-2 text-[#2D5A40] text-xs font-bold uppercase tracking-widest mb-2">
                <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Babson Summer Study 2026 · Forever Grateful</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-4xl font-semibold text-[#1F3D2B]">
                Thank you for everything, Professor Turner!
              </h3>
              <p className="text-xs sm:text-sm text-[#1F3D2B]/80 mt-2 leading-relaxed">
                Wishing you wonderful rides, inspiring FME cohorts in Wellesley,
                and a well-deserved day off with great coffee and a cozy story.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiet Editorial Colophon */}
        <div className="mt-16 pt-8 border-t border-[#E8DCC4]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DCC4]/60">
          <div>
            Crafted with gratitude by{' '}
            <span className="text-[#F5EFE6] font-medium">
              Amirbek (Amir) Orifjonov
            </span>{' '}
            · Gulistan, Uzbekistan
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>For Professor Lucy Turner · Babson College</span>
          </div>
        </div>
      </div>

      {/* Explicit Confirmation Modal for Saving Keepsake to Google Drive */}
      <AnimatePresence>
        {confirmSaveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmSaveModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full bg-[#F5EFE6] text-[#1F3D2B] rounded-2xl border border-[#E8DCC4] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#E8DCC4] border-b border-[#1F3D2B]/15">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#2D5A40] font-semibold">
                    Confirm Google Drive Action
                  </span>
                  <h3 className="font-editorial text-xl font-semibold text-[#1F3D2B]">
                    Save Gratitude Keepsake to Google Drive?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmSaveModalOpen(false)}
                  className="p-1.5 rounded-full bg-[#1F3D2B]/10 hover:bg-[#1F3D2B]/20 text-[#1F3D2B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {savedDriveFile ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#2D5A40]/15 border border-[#2D5A40]/30 text-sm text-[#1F3D2B]">
                      <div className="font-semibold text-[#2D5A40] mb-1">
                        Keepsake Saved to Google Drive!
                      </div>
                      <p className="text-xs text-[#1F3D2B]/80">
                        File created: <strong>{savedDriveFile.name}</strong>
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      {savedDriveFile.webViewLink && (
                        <a
                          href={savedDriveFile.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3D2B] text-[#F5EFE6] hover:bg-[#2D5A40]"
                        >
                          <span>Open in Google Drive</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmSaveModalOpen(false)}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E8DCC4] text-[#1F3D2B] cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#1F3D2B]/85 leading-relaxed">
                      This will create a new archival HTML file in your Google
                      Drive named{' '}
                      <strong className="font-semibold">
                        Babson_Summer_Study_2026_Gratitude_Professor_Lucy_Turner.html
                      </strong>{' '}
                      containing Amirbek’s full letter, Summer Study classroom
                      reflections, and curated anime recommendations.
                    </p>

                    {saveError && (
                      <div className="p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-xs text-red-900">
                        {saveError}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmSaveModalOpen(false)}
                        disabled={isSavingDrive}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-[#1F3D2B]/25 text-[#1F3D2B] hover:bg-[#1F3D2B]/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmSaveToDrive}
                        disabled={isSavingDrive}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-[#1F3D2B] text-[#F5EFE6] hover:bg-[#2D5A40] transition-colors cursor-pointer"
                      >
                        {isSavingDrive ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving to Drive...</span>
                          </>
                        ) : (
                          <>
                            <FolderCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Confirm &amp; Create File in Drive</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
