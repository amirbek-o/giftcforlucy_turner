import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  X,
  Star,
} from 'lucide-react';

import demonSlayerImg from '../assets/images/anime_demon_slayer_1794145351697.jpg';
import haikyuImg from '../assets/images/anime_haikyu_1794145351825.jpg';
import attackOnTitanImg from '../assets/images/anime_attack_on_titan_1794145354310.jpg';
import hundredMetersImg from '../assets/images/anime_100_meters_1794145354783.jpg';
import jujutsuKaisenImg from '../assets/images/anime_jujutsu_kaisen_1794145356126.jpg';
import blueLockImg from '../assets/images/anime_blue_lock_1794145357417.jpg';
import deathNoteImg from '../assets/images/anime_death_note_1794145360499.jpg';
import steinsGateImg from '../assets/images/anime_steins_gate_1794145358451.jpg';

export interface WatchlistAnimeItem {
  id: string;
  title: string;
  japaneseTitle: string;
  studio: string;
  episodes: string;
  themes: string[];
  posterUrl: string;
  shortPitch: string;
  leadershipLens: string;
  amirNote: string;
}

export const WATCHLIST_ANIMES: WatchlistAnimeItem[] = [
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    japaneseTitle: 'Kimetsu no Yaiba',
    studio: 'ufotable',
    episodes: '4 Seasons + Film',
    themes: ['Empathy in Action', 'Relentless Craft', 'Family Bond'],
    posterUrl: demonSlayerImg,
    shortPitch:
      'Tanjiro Kamado’s journey to save his sister combines breathtaking swordsmanship with rare, unwavering compassion—even toward his fiercest adversaries.',
    leadershipLens:
      'True strength is rooted in empathy. Tanjiro never loses his kindness under pressure, reminding us that great leaders stay humane even in the hardest arenas.',
    amirNote:
      'One of my absolute favorites for its visual artistry and heart—the way mentors pass down their breathing styles feels just like great teaching.',
  },
  {
    id: 'haikyu',
    title: 'Haikyu!!',
    japaneseTitle: 'Haikyu!!',
    studio: 'Production I.G',
    episodes: '4 Seasons + Film',
    themes: ['Team Chemistry', 'Growth Mindset', 'Elevating Others'],
    posterUrl: haikyuImg,
    shortPitch:
      'An undersized volleyball player and a perfectionist setter learn that a team only flies when every player on the court connects and trusts one another.',
    leadershipLens:
      'A masterclass in Babson team dynamics: how diverse personalities, setters, and spikers turn friction into unstoppable collective momentum.',
    amirNote:
      'Whenever I think about our Babson Summer Study cohort cheering each other on, Haikyu!! is the exact energy that comes to mind.',
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    japaneseTitle: 'Shingeki no Kyojin',
    studio: 'WIT Studio / MAPPA',
    episodes: '4 Seasons (Complete)',
    themes: ['Vision Beyond Walls', 'Courageous Strategy', 'Mounted Scouts'],
    posterUrl: attackOnTitanImg,
    shortPitch:
      'Riding out on horseback beyond towering stone walls, the Survey Corps risks everything to uncover the truth of their world and chart the unknown.',
    leadershipLens:
      'Explores the weight of command, venturing into radical uncertainty, and the iconic equestrian formations of the Scout Regiment riding across open plains.',
    amirNote:
      'Beyond the epic mystery and storytelling, the Scout Regiment’s horsemanship and courage to question the status quo make it unforgettable.',
  },
  {
    id: '100-meters',
    title: '100 Meters',
    japaneseTitle: 'Hyakuemu (100M)',
    studio: 'By Uoto · Rock ’n’ Roll Mountain',
    episodes: 'Feature Film / Manga',
    themes: ['Pure Focus', 'Intrinsic Motivation', '10 Seconds of Truth'],
    posterUrl: hundredMetersImg,
    shortPitch:
      'A deeply philosophical story about two sprinters—one born with natural speed and one who grinds for every millisecond—discovering why we run.',
    leadershipLens:
      'Examines the psychology of excellence: what happens when external validation fades and you must find genuine meaning in the craft itself.',
    amirNote:
      'A hidden gem! It treats a 100-meter sprint like a philosophical inquiry into ambition, rivalry, and self-discovery.',
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    japaneseTitle: 'Jujutsu Kaisen',
    studio: 'MAPPA',
    episodes: '2 Seasons + Film',
    themes: ['Mentorship Legacy', 'Protecting Potential', ' kinetic Action'],
    posterUrl: jujutsuKaisenImg,
    shortPitch:
      'Yuji Itadori enters a secret academy of sorcerers where mentors fight to reform an outdated system by empowering the next generation of students.',
    leadershipLens:
      'Satoru Gojo chooses teaching because he believes lasting change comes not from standing alone at the top, but from raising strong, independent peers.',
    amirNote:
      'The mentorship philosophy at the heart of the story—investing in students so they surpass the old guard—is so inspiring.',
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock',
    japaneseTitle: 'Blue Lock',
    studio: '8bit',
    episodes: '2 Seasons',
    themes: ['Founder Drive', ' Flow State', 'Reinventing Strategy'],
    posterUrl: blueLockImg,
    shortPitch:
      'Three hundred young strikers enter an experimental training facility designed to forge world-class spatial awareness, decisiveness, and creative hunger.',
    leadershipLens:
      'Balances individual ownership ("ego" and initiative) with "chemical reactions"—when two ambitious builders challenge each other to unlock a new level.',
    amirNote:
      'When Isagi breaks down the field like puzzle pieces to pivot his strategy in real time, it feels just like iterating on a startup!',
  },
  {
    id: 'death-note',
    title: 'Death Note',
    japaneseTitle: 'Death Note',
    studio: 'Madhouse',
    episodes: '37 Episodes (Complete)',
    themes: ['Game Theory', 'Ethical Guardrails', 'Strategic Chess'],
    posterUrl: deathNoteImg,
    shortPitch:
      'A high-stakes psychological chess match between two brilliant minds testing the boundaries of deduction, asymmetric information, and unchecked power.',
    leadershipLens:
      'A gripping cautionary case study on why intelligence without humility and ethical accountability unravels—and how great detectives test hypotheses.',
    amirNote:
      'Every episode feels like a masterclass in game theory, deductive reasoning, and anticipating three moves ahead.',
  },
  {
    id: 'steins-gate',
    title: 'Steins;Gate',
    japaneseTitle: 'Steins;Gate',
    studio: 'White Fox',
    episodes: '24 Episodes (Complete)',
    themes: ['Garage Lab Innovation', 'Resilience', 'Co-Founder Loyalty'],
    posterUrl: steinsGateImg,
    shortPitch:
      'A quirky group of university friends in a tiny Akihabara apartment accidentally invent a device that can send messages into the past—and fight to save their team.',
    leadershipLens:
      'Starts like a scrappy student hardware startup tinkering in a summer lab, then blossoms into an emotional story about resilience and never leaving a teammate behind.',
    amirNote:
      'The Future Gadget Lab has the exact spirit of a passionate student founder team turning wild experiments into reality.',
  },
];

export const AnimeWatchlistCarousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<WatchlistAnimeItem | null>(
    null
  );
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0.85); // smooth pixels per frame

  // Duplicate list 2x for seamless infinite loop
  const loopedItems = [...WATCHLIST_ANIMES, ...WATCHLIST_ANIMES];

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const targetSpeed = isHovered || isManualPaused || selectedAnime ? 0 : 0.85;
      // Smoothly damp velocity so hovering decelerates with physical weight
      velocityRef.current += (targetSpeed - velocityRef.current) * 0.08;

      if (trackRef.current && Math.abs(velocityRef.current) > 0.005) {
        offsetRef.current += velocityRef.current;
        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, isManualPaused, selectedAnime]);

  const handleStep = (direction: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const stepAmount = 340;
    const halfWidth = trackRef.current.scrollWidth / 2;
    if (direction === 'next') {
      offsetRef.current = (offsetRef.current + stepAmount) % halfWidth;
    } else {
      offsetRef.current =
        (offsetRef.current - stepAmount + halfWidth) % halfWidth;
    }
    trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  };

  return (
    <section
      id="anime-watchlist"
      className="relative py-24 sm:py-28 overflow-hidden z-10"
    >
      {/* Header Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-3 flex items-center gap-2">
            <Film className="w-3.5 h-3.5" />
            <span>04 · Amir’s Essential Anime Watchlist Carousel</span>
          </div>
          <h2
            className="font-editorial text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            More Unforgettable Stories to Watch Next
          </h2>
          <p className="text-sm sm:text-base text-[#E8DCC4]/80 leading-relaxed">
            A rolling reel of my all-time favorite anime series—from high-flying
            team sports and garage-lab time travel to mounted scouts and
            strategic mind games.{' '}
            <span className="text-[#D4AF37] font-medium">
              Hover over the reel to pause the roll
            </span>
            , or click any poster to read my personal note.
          </p>
        </div>

        {/* Interactive Reel Controls & Status */}
        <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
          <div className="px-3.5 py-2 rounded-full bg-[#162C1F] border border-[#E8DCC4]/20 text-xs font-medium text-[#E8DCC4] flex items-center gap-2">
            <span className="text-[#D4AF37] font-semibold">
              {isHovered || isManualPaused ? 'Paused on Hover' : 'Rolling Reel'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsManualPaused((p) => !p)}
            aria-label={isManualPaused ? 'Resume rolling carousel' : 'Pause rolling carousel'}
            className="p-2.5 rounded-full bg-[#2D5A40]/70 hover:bg-[#2D5A40] text-[#F5EFE6] border border-[#E8DCC4]/25 transition-colors cursor-pointer"
          >
            {isManualPaused ? (
              <Play className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Pause className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleStep('prev')}
            aria-label="Previous anime card"
            className="p-2.5 rounded-full bg-[#E8DCC4] text-[#1F3D2B] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleStep('next')}
            aria-label="Next anime card"
            className="p-2.5 rounded-full bg-[#E8DCC4] text-[#1F3D2B] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infinite Rolling Carousel Track Wrapper */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full py-4 select-none"
      >
        {/* Left & Right Soft Forest Edge Vignettes */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#1F3D2B] to-transparent z-20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#1F3D2B] to-transparent z-20"
          aria-hidden="true"
        />

        {/* Rolling Flex Track */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 px-6 w-max will-change-transform"
        >
          {loopedItems.map((anime, idx) => (
            <article
              key={`${anime.id}-${idx}`}
              onClick={() => setSelectedAnime(anime)}
              className="group relative w-[290px] sm:w-[320px] shrink-0 rounded-2xl bg-[#E8DCC4] text-[#1F3D2B] p-3.5 pb-5 border border-[#F5EFE6]/60 shadow-[0_22px_50px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(212,175,55,0.28)] cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* 3:4 Anime Key Visual Poster */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#14281C] border border-[#1F3D2B]/15 mb-4">
                  <img
                    src={anime.posterUrl}
                    alt={`${anime.title} (${anime.japaneseTitle}) anime key visual poster`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Measured Gradient Scrim for Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="text-[11px] font-medium text-[#D4AF37] tracking-wide">
                      {anime.studio} · {anime.episodes}
                    </div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#F5EFE6] leading-tight mt-0.5">
                      {anime.title}
                    </h3>
                    <div className="text-xs italic text-[#E8DCC4]/85">
                      {anime.japaneseTitle}
                    </div>
                  </div>
                </div>

                {/* Unboxed Theme Metadata Line */}
                <div className="text-[11px] font-semibold text-[#2D5A40] px-1 mb-2">
                  {anime.themes.join(' · ')}
                </div>

                {/* Concise Pitch */}
                <p className="text-xs sm:text-[13px] text-[#1F3D2B]/85 leading-relaxed px-1 line-clamp-3">
                  {anime.shortPitch}
                </p>
              </div>

              {/* Amir's Personal Note Teaser */}
              <div className="mt-4 pt-3 border-t border-[#1F3D2B]/12 px-1 flex items-center justify-between text-xs font-semibold text-[#1F3D2B]">
                <span className="flex items-center gap-1.5 text-[#2D5A40]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Read Amir’s Note</span>
                </span>
                <span className="text-[#1F3D2B]/60 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Detail View When Clicking Any Anime Card */}
      <AnimatePresence>
        {selectedAnime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnime(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-[#F5EFE6] text-[#1F3D2B] rounded-2xl border border-[#E8DCC4] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
            >
              {/* Left Poster Column */}
              <div className="md:col-span-5 bg-[#14281C] relative">
                <img
                  src={selectedAnime.posterUrl}
                  alt={selectedAnime.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-[380px] md:max-h-none"
                />
              </div>

              {/* Right Editorial Details Column */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="text-xs font-semibold uppercase tracking-widest text-[#2D5A40]">
                      {selectedAnime.studio} · {selectedAnime.episodes}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAnime(null)}
                      aria-label="Close modal"
                      className="p-1.5 rounded-full bg-[#1F3D2B]/10 hover:bg-[#1F3D2B]/20 text-[#1F3D2B] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-editorial text-3xl font-semibold text-[#1F3D2B]">
                    {selectedAnime.title}{' '}
                    <span className="italic font-normal text-xl text-[#1F3D2B]/70">
                      ({selectedAnime.japaneseTitle})
                    </span>
                  </h3>

                  <div className="text-xs font-medium text-[#2D5A40] mt-1 mb-4">
                    {selectedAnime.themes.join(' · ')}
                  </div>

                  <p className="text-sm text-[#1F3D2B]/90 leading-relaxed mb-5">
                    {selectedAnime.shortPitch}
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#E8DCC4]/65 border border-[#1F3D2B]/10">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#2D5A40] flex items-center gap-1.5 mb-1">
                        <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                        <span>Leadership &amp; Mentorship Takeaway</span>
                      </div>
                      <p className="text-xs text-[#1F3D2B]/85 leading-relaxed">
                        {selectedAnime.leadershipLens}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1F3D2B] text-[#F5EFE6]">
                      <div className="text-xs font-semibold text-[#D4AF37] mb-1">
                        Why I Recommend It — Amirbek
                      </div>
                      <p className="text-xs text-[#E8DCC4]/90 italic leading-relaxed">
                        “{selectedAnime.amirNote}”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F3D2B]/12 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedAnime(null)}
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1F3D2B] text-[#F5EFE6] hover:bg-[#2D5A40] transition-colors cursor-pointer"
                  >
                    Back to Rolling Carousel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
