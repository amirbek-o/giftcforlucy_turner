import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Compass,
  BookOpen,
  RotateCw,
  Loader2,
  Send,
} from 'lucide-react';
import { ANIME_CURATIONS, AnimeCuration } from '../data/content';

const EASE_EDITORIAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface GeneratedReflection {
  title: string;
  equestrianParallel: string;
  fmeTakeaway: string;
  storyRecommendation: string;
}

const PRESET_THEMES = [
  'Trust in the Saddle & Co-Founder Alignment',
  'Grassroots Venture Ecosystems in Rural Communities',
  'Listening Before Leading in Babson FME',
];

export const AnimeCurations: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'equestrian' | 'venture' | 'community'>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'silver-spoon': true,
  });

  // Gemini Interactive Reflection Studio State
  const [selectedTheme, setSelectedTheme] = useState<string>(PRESET_THEMES[0]);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);
  const [reflectionResult, setReflectionResult] =
    useState<GeneratedReflection | null>({
      title: 'The Cadence of Shared Leadership',
      equestrianParallel:
        'In the saddle, a rider never forces a horse over an obstacle through tension; instead, you establish a calm, unmistakable rhythm and let mutual trust carry both partners forward.',
      fmeTakeaway:
        'In Babson FME and across our youth startup cohorts in Gulistan, the strongest founders lead the exact same way—by listening to their teammates and aligning around shared purpose.',
      storyRecommendation:
        'In Episode 4 of Silver Spoon, Hachiken realizes that respecting his horse’s pace turns exhaustion into quiet confidence—a timeless reminder for every educator and entrepreneur.',
    });

  const filteredCurations = ANIME_CURATIONS.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGenerateReflection = async (topicOverride?: string) => {
    const queryTopic = topicOverride || customTopic.trim() || selectedTheme;
    setIsGenerating(true);
    setReflectionError(null);

    try {
      const res = await fetch('/api/gemini/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme,
          customPrompt: queryTopic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not generate reflection.');
      }
      setReflectionResult(data);
    } catch (err: any) {
      setReflectionError(
        err?.message || 'Unable to reach Gemini right now. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      id="curations"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto z-10"
    >
      {/* Section Heading & Filter Control */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-3">
            03 · Curated Picks · Equestrian Grace, Ventures &amp; Anime
          </div>
          <h2
            className="font-editorial text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            For Your Next Day Off: Where Horses, Ventures &amp; Anime Meet
          </h2>
          <p className="text-sm sm:text-base text-[#E8DCC4]/80 leading-relaxed">
            Four warm, thoughtful series curated specifically for your love of
            horsemanship, entrepreneurial ecosystems, and anime storytelling.
            Hover or click any card to reveal the{' '}
            <span className="text-[#F5EFE6] font-medium">
              Entrepreneur + Equestrian Lens
            </span>
            .
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div
          role="tablist"
          aria-label="Filter curations by lens"
          className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-[#162C1F] border border-[#E8DCC4]/20 self-start lg:self-auto"
        >
          {[
            { id: 'all', label: 'All Curations (4)' },
            { id: 'equestrian', label: 'Equestrian Spirit' },
            { id: 'venture', label: 'Trade & Venture' },
            { id: 'community', label: 'Ecosystem Revival' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filter === tab.id
                  ? 'bg-[#E8DCC4] text-[#1F3D2B] shadow-sm font-semibold'
                  : 'text-[#E8DCC4]/75 hover:text-[#F5EFE6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Interactive Curation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredCurations.map((item: AnimeCuration, idx: number) => {
          const isExpanded = !!expandedCards[item.id];
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.65,
                delay: idx * 0.08,
                ease: EASE_EDITORIAL,
              }}
              onMouseEnter={() =>
                setExpandedCards((prev) => ({ ...prev, [item.id]: true }))
              }
              onClick={() => toggleCard(item.id)}
              className="group relative rounded-2xl bg-[#E8DCC4] text-[#1F3D2B] p-6 sm:p-8 border border-[#F5EFE6]/50 shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Index & Unboxed Metadata Line */}
                <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#1F3D2B]/12">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#2D5A40]">
                    <span className="font-mono font-semibold">
                      {item.index}.
                    </span>
                    <span>{item.tags.join(' · ')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard(item.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F3D2B]/70 group-hover:text-[#1F3D2B] transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-[#2D5A40]' : ''
                      }`}
                    />
                    <span>{isExpanded ? 'Lens Open' : 'Reveal Lens'}</span>
                  </button>
                </div>

                {/* Title & Creator */}
                <div className="mb-4">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F3D2B] tracking-tight">
                    {item.title}{' '}
                    <span className="italic font-normal text-[#1F3D2B]/75 text-xl sm:text-2xl">
                      ({item.japaneseTitle})
                    </span>
                  </h3>
                  {item.creator && (
                    <p className="text-xs text-[#2D5A40] font-semibold mt-1">
                      {item.creator}
                    </p>
                  )}
                </div>

                {/* Main Pitch */}
                <p className="text-sm sm:text-[15.5px] text-[#1F3D2B]/90 leading-relaxed">
                  {item.pitch}
                </p>
              </div>

              {/* Expandable "Why You'll Love It (The Entrepreneur + Equestrian Lens)" */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-5 border-t border-[#1F3D2B]/15 space-y-3 bg-[#F5EFE6] p-4 sm:p-5 rounded-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#2D5A40] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          Why You’ll Love It (The Entrepreneur + Equestrian
                          Lens)
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#1F3D2B]/90 leading-relaxed">
                        {item.lensHighlight}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-lg bg-[#E8DCC4]/55">
                          <div className="text-[11px] font-semibold text-[#1F3D2B] mb-0.5">
                            Babson FME Parallel
                          </div>
                          <p className="text-xs text-[#1F3D2B]/80 leading-relaxed">
                            {item.fmeConnection}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#E8DCC4]/55">
                          <div className="text-[11px] font-semibold text-[#1F3D2B] mb-0.5">
                            Equestrian Detail
                          </div>
                          <p className="text-xs text-[#1F3D2B]/80 leading-relaxed">
                            {item.equestrianNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      {/* Interactive Gemini Reflection Studio */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: EASE_EDITORIAL }}
        className="mt-14 rounded-2xl bg-[#2D5A40]/45 border border-[#E8DCC4]/25 p-6 sm:p-10 backdrop-blur-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8DCC4]/15">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Gemini Reflection Studio</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#F5EFE6] font-normal">
              Explore a Custom FME, Equestrian &amp; Anime Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DCC4]/80 mt-1">
              Select a leadership theme or enter any venture topic to weave a
              fresh reflection connecting Babson FME, horsemanship, and cozy
              storytelling.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => {
                  setSelectedTheme(theme);
                  setCustomTopic('');
                  handleGenerateReflection(theme);
                }}
                disabled={isGenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedTheme === theme && !customTopic
                    ? 'bg-[#D4AF37] text-[#1F3D2B] border-[#D4AF37] font-semibold'
                    : 'bg-[#1F3D2B]/60 text-[#E8DCC4]/85 border-[#E8DCC4]/20 hover:border-[#E8DCC4]/50'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Topic Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Or enter a custom theme (e.g., 'Building trust across time zones' or 'Morning barn routines & founder discipline')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1F3D2B]/80 border border-[#E8DCC4]/25 text-sm text-[#F5EFE6] placeholder:text-[#E8DCC4]/45 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="button"
            onClick={() => handleGenerateReflection()}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#E8DCC4] text-[#1F3D2B] hover:bg-[#F5EFE6] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Composing Reflection...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Generate Reflection</span>
              </>
            )}
          </button>
        </div>

        {reflectionError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-400/30 text-xs text-red-200">
            {reflectionError}
          </div>
        )}

        {/* Generated Result Display */}
        {reflectionResult && (
          <div className="mt-6 p-6 rounded-xl bg-[#1F3D2B]/75 border border-[#E8DCC4]/20">
            <h4 className="font-editorial text-xl sm:text-2xl text-[#F5EFE6] mb-4">
              {reflectionResult.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                  Equestrian Parallel
                </div>
                <p className="text-[#E8DCC4]/90 leading-relaxed">
                  {reflectionResult.equestrianParallel}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                  Babson FME &amp; Uzbekistan
                </div>
                <p className="text-[#E8DCC4]/90 leading-relaxed">
                  {reflectionResult.fmeTakeaway}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Day-Off Story Note</span>
                </div>
                <p className="text-[#E8DCC4]/90 leading-relaxed">
                  {reflectionResult.storyRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};
