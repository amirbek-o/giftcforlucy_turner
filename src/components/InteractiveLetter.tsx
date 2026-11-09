import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MailOpen, MapPin, Award, Mic } from 'lucide-react';
import {
  AMIR_PORTRAIT_URL,
  LETTER_PARAGRAPHS,
  LETTER_SALUTATION,
  LETTER_SIGNOFF,
} from '../data/content';

const EASE_EDITORIAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const InteractiveLetter: React.FC = () => {
  const [isSealBroken, setIsSealBroken] = useState(true);
  const [emphasizeHighlights, setEmphasizeHighlights] = useState(true);
  const [portraitError, setPortraitError] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const envelopeRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 5,
      rotateY: (x - 0.5) * 6,
      glareX: x * 100,
      glareY: y * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <section
      id="the-letter"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-5xl mx-auto z-10"
    >
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-3">
          01 · Personal Correspondence · Wellesley &amp; Gulistan
        </div>
        <h2
          className="font-editorial text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight mb-4"
          style={{ textWrap: 'balance' }}
        >
          A Letter of Gratitude Across Time Zones
        </h2>
        <p className="text-sm sm:text-base text-[#E8DCC4]/80 leading-relaxed">
          Move your cursor across the parchment to feel its physical texture,
          scroll gently to unfold each paragraph, or toggle the gold wax seal.
        </p>

        {/* Interactive Controls for the Envelope & Highlighter */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsSealBroken((prev) => !prev)}
            className="btn-modern-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#F5EFE6] cursor-pointer whitespace-nowrap shrink-0"
          >
            <MailOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isSealBroken ? 'Fold Envelope' : 'Break Wax Seal & Open'}</span>
          </button>

          <button
            type="button"
            onClick={() => setEmphasizeHighlights((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              emphasizeHighlights
                ? 'bg-[#D4AF37]/25 text-[#F5EFE6] border-[#D4AF37]/70 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                : 'bg-transparent text-[#E8DCC4]/75 border-[#E8DCC4]/25 hover:text-[#F5EFE6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {emphasizeHighlights
                ? 'Golden Phrase Glow: On'
                : 'Golden Phrase Glow: Off'}
            </span>
          </button>
        </div>
      </div>

      {/* Tactile 3D Sand Beige Envelope + Rising Parchment Container */}
      <div
        ref={envelopeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative mx-auto max-w-3xl"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
          }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
          className="relative rounded-t-3xl bg-[#E8DCC4] border border-[#E8DCC4]/50 shadow-[0_35px_90px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.7)] overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Dynamic Physical Paper Sheen */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(650px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(212, 175, 55, 0.14), transparent 50%)`,
            }}
            aria-hidden="true"
          />

          {/* Top Triangular Envelope Flap Visual */}
          <div className="relative h-20 sm:h-24 bg-gradient-to-b from-[#dfd0b3] to-[#E8DCC4] border-b border-[#1F3D2B]/15 flex items-center justify-between px-6 sm:px-10 shadow-inner">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#1F3D2B]/75 font-semibold">
              Babson Summer Study · July 2026
            </div>

            {/* Interactive Physical Gold Wax Seal */}
            <button
              type="button"
              onClick={() => setIsSealBroken((prev) => !prev)}
              aria-label="Toggle envelope wax seal"
              className="group relative -bottom-5 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#e8c655] via-[#D4AF37] to-[#8f7013] shadow-[0_10px_24px_rgba(31,61,43,0.5),inset_0_2px_3px_rgba(255,255,255,0.6)] border-2 border-[#F5EFE6]/80 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer z-40"
            >
              <span className="font-editorial text-xs sm:text-sm font-bold tracking-widest text-[#1F3D2B]">
                LT
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#1F3D2B]/85 font-semibold">
                FME · 26
              </span>
            </button>

            <div className="text-[11px] uppercase tracking-[0.2em] text-[#1F3D2B]/75 font-semibold hidden sm:block">
              Par Avion · Uzbekistan → MA
            </div>
          </div>

          {/* Rising Parchment Letter Card */}
          <motion.div
            animate={{
              height: isSealBroken ? 'auto' : 140,
              opacity: isSealBroken ? 1 : 0.75,
            }}
            transition={{ duration: 0.75, ease: EASE_EDITORIAL }}
            className="bg-[#F5EFE6] text-[#1F3D2B] px-6 sm:px-14 pt-12 pb-12 sm:pb-16 relative overflow-hidden shadow-[inset_0_8px_24px_rgba(31,61,43,0.06)]"
          >
            {/* Subtle archival paper rules */}
            <div className="flex items-center justify-between text-xs text-[#1F3D2B]/65 border-b border-[#1F3D2B]/12 pb-4 mb-8">
              <span>To: Professor Lucy Turner, Babson College</span>
              <span>From: Amirbek (Amir) Orifjonov</span>
            </div>

            {/* Salutation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
              className="font-editorial text-2xl sm:text-3xl text-[#1F3D2B] italic mb-7"
            >
              {LETTER_SALUTATION}
            </motion.p>

            {/* Scrollytelling Paragraphs */}
            <div className="space-y-7 text-base sm:text-[17.5px] leading-[1.85] text-[#1F3D2B]/90 max-w-[66ch]">
              {LETTER_PARAGRAPHS.map((para, index) => (
                <motion.p
                  key={para.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.08,
                    ease: EASE_EDITORIAL,
                  }}
                  className={
                    index === 0
                      ? 'first-letter:font-editorial first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#1F3D2B]'
                      : ''
                  }
                >
                  {para.segments.map((seg, idx) =>
                    seg.highlight ? (
                      <span
                        key={idx}
                        className={`transition-all duration-500 rounded px-1 -mx-0.5 ${
                          emphasizeHighlights
                            ? 'bg-[#D4AF37]/30 text-[#1F3D2B] font-medium shadow-[0_0_20px_rgba(212,175,55,0.28)] decoration-[#D4AF37] underline decoration-1 underline-offset-4'
                            : ''
                        }`}
                      >
                        {seg.text}
                      </span>
                    ) : (
                      <React.Fragment key={idx}>{seg.text}</React.Fragment>
                    )
                  )}
                </motion.p>
              ))}
            </div>

            {/* Signature & Portrait Block inside the Letter */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.75, ease: EASE_EDITORIAL }}
              className="mt-12 pt-8 border-t border-[#1F3D2B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <p className="text-sm text-[#1F3D2B]/75 italic mb-2">
                  {LETTER_SIGNOFF.closing}
                </p>
                <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F3D2B] tracking-tight">
                  {LETTER_SIGNOFF.name}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#2D5A40] font-semibold mt-1">
                  {LETTER_SIGNOFF.location}
                </p>
              </div>

              {/* Amir's Portrait Stamp */}
              <div className="flex items-center gap-4 bg-[#E8DCC4]/75 p-3 rounded-2xl border border-[#1F3D2B]/15 shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-md shrink-0 bg-[#1F3D2B]">
                  {!portraitError ? (
                    <img
                      src={AMIR_PORTRAIT_URL}
                      alt="Amirbek (Amir) Orifjonov"
                      referrerPolicy="no-referrer"
                      onError={() => setPortraitError(true)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#E8DCC4] font-editorial text-lg">
                      AO
                    </div>
                  )}
                </div>
                <div className="text-xs text-[#1F3D2B]/85 leading-snug pr-2">
                  <div className="font-semibold text-[#1F3D2B]">
                    Amirbek (Amir) Orifjonov
                  </div>
                  <div className="text-[#1F3D2B]/70 mt-0.5">
                    Babson Summer Study ’26 Alumnus
                  </div>
                  <div className="text-[#2D5A40] font-medium mt-1">
                    Syrdarya Venture Ecosystem Builder
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Physical Envelope Lip */}
          <div className="h-4 bg-[#E8DCC4] border-t border-[#1F3D2B]/15 shadow-inner" />
        </motion.div>
      </div>

      {/* Dedicated Founder & Mentee Spotlight Card (Featuring Amirbek's Full Portrait) */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        className="mt-14 max-w-3xl mx-auto rounded-2xl bg-[#2D5A40]/50 border border-[#E8DCC4]/25 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E8DCC4]/35 shadow-lg bg-[#1F3D2B] relative">
              {!portraitError ? (
                <img
                  src={AMIR_PORTRAIT_URL}
                  alt="Portrait of Amirbek (Amir) Orifjonov presenting in Uzbekistan"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#E8DCC4] font-editorial text-3xl">
                  Amirbek Orifjonov
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3">
                <span className="text-[11px] text-[#F5EFE6] font-medium">
                  Amirbek in Gulistan, Uzbekistan
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Mentee Spotlight · Carrying FME Forward
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#F5EFE6] font-normal">
              How Your Classroom Shaped My Work in Uzbekistan
            </h3>
            <p className="text-sm sm:text-base text-[#E8DCC4]/85 leading-relaxed">
              Every week as I meet young builders across the Syrdarya region and
              host conversations on our Uzbekistan Startup Podcast, I return to
              the core mindset from your Babson sessions: start by listening,
              value every team member’s perspective, and build bridges between
              communities.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#F5EFE6]/90">
              <div className="p-3 rounded-xl bg-[#1F3D2B]/70 border border-[#E8DCC4]/15">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Syrdarya Region</span>
                </div>
                <p className="text-[#E8DCC4]/75 leading-relaxed">
                  Mentoring youth startup teams &amp; grassroots founders.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#1F3D2B]/70 border border-[#E8DCC4]/15">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold mb-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Startup Podcast</span>
                </div>
                <p className="text-[#E8DCC4]/75 leading-relaxed">
                  Amplifying emerging founder stories across Uzbekistan.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#1F3D2B]/70 border border-[#E8DCC4]/15">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Babson ET&amp;A</span>
                </div>
                <p className="text-[#E8DCC4]/75 leading-relaxed">
                  Applying Entrepreneurial Thought &amp; Action daily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
