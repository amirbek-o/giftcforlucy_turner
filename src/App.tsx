/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StardustBackground } from './components/StardustBackground';
import { NavbarHorseProgress } from './components/NavbarHorseProgress';
import { CinematicHero } from './components/ui/cinematic-landing-hero';
import { Component as LuminaInteractiveList } from './components/ui/lumina-interactive-list';
import { InteractiveLetter } from './components/InteractiveLetter';
import { PolaroidGallery } from './components/PolaroidGallery';
import { AnimeCurations } from './components/AnimeCurations';
import { AnimeWatchlistCarousel } from './components/AnimeWatchlistCarousel';
import { CelebrationFooter } from './components/CelebrationFooter';
import { INITIAL_MEMORIES, MemoryFrame } from './data/content';
import { initAuth } from './services/googleDrive';

export default function App() {
  const [memories, setMemories] = useState<MemoryFrame[]>(() => {
    try {
      const saved = localStorage.getItem('fernwood_babson_memories_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_MEMORIES;
  });

  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [confirmSaveModalOpen, setConfirmSaveModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        'fernwood_babson_memories_v1',
        JSON.stringify(memories)
      );
    } catch {
      // ignore storage quota errors
    }
  }, [memories]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setIsDriveConnected(true);
        setUserEmail(user.email);
      },
      () => {
        setIsDriveConnected(false);
        setUserEmail(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDriveAuthSuccess = (email?: string | null) => {
    setIsDriveConnected(true);
    if (email) setUserEmail(email);
  };

  return (
    <div className="min-h-screen bg-[#1F3D2B] text-[#E8DCC4] overflow-x-hidden relative selection:bg-[#D4AF37]/30 selection:text-[#F5EFE6]">
      {/* Subtle Animated Stardust & Dot-Matrix Background */}
      <StardustBackground />

      {/* Floating Frosted Navigation & Curved SVG Galloping Horse Scroll Progress */}
      <NavbarHorseProgress
        onOpenDriveSaveModal={() => setConfirmSaveModalOpen(true)}
        isDriveConnected={isDriveConnected}
        userEmail={userEmail}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Section A: Pinned 3D Physical Skeuomorphic Cinematic Hero (GSAP ScrollTrigger) */}
        <CinematicHero />

        {/* Section B: The Interactive Scrollytelling Letter & Amir's Spotlight */}
        <InteractiveLetter />

        {/* Interactive WebGL Shader Gratitude Tapestry (Lumina Interactive List) */}
        <LuminaInteractiveList />

        {/* Section C: Summer Study Memories Polaroid Gallery */}
        <PolaroidGallery
          memories={memories}
          setMemories={setMemories}
          isDriveConnected={isDriveConnected}
          onDriveAuthSuccess={handleDriveAuthSuccess}
        />

        {/* Section D: For Your Next Day Off: Where Horses, Ventures & Anime Meet */}
        <AnimeCurations />

        {/* Section D2: Rolling Anime Watchlist Carousel (Pauses on Hover) */}
        <AnimeWatchlistCarousel />
      </main>

      {/* Section E: Interactive Closing & Google Drive Keepsake Archive */}
      <CelebrationFooter
        memories={memories}
        confirmSaveModalOpen={confirmSaveModalOpen}
        setConfirmSaveModalOpen={setConfirmSaveModalOpen}
        isDriveConnected={isDriveConnected}
        onDriveAuthSuccess={handleDriveAuthSuccess}
      />
    </div>
  );
}
