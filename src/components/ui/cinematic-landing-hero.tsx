"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Compass, Heart, Sparkles, MailOpen } from "lucide-react";
import { cn } from "../../lib/utils";
import { AMIR_PORTRAIT_URL } from "../../data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, rgba(232, 220, 196, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(232, 220, 196, 0.07) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Fernwood Equestrian & Editorial 3D Depth)
  ---------------------------------------------------------------------- */
  
  .text-3d-matte {
      color: #F5EFE6;
      text-shadow: 
          0 12px 32px rgba(0, 0, 0, 0.55), 
          0 2px 6px rgba(212, 175, 55, 0.22);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #F5EFE6 0%, #E8DCC4 48%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.45)) 
          drop-shadow(0px 2px 6px rgba(212, 175, 55, 0.25));
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #F5EFE6 0%, #E8DCC4 55%, #C5A028 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.85)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.65));
  }

  /* Deep Physical Fernwood Equestrian Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #264B35 0%, #14281C 55%, #0D1B13 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.92),
          0 20px 40px -20px rgba(0, 0, 0, 0.85),
          inset 0 1px 2px rgba(232, 220, 196, 0.32),
          inset 0 -2px 6px rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(232, 220, 196, 0.18);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.12) 0%, rgba(232, 220, 196, 0.05) 25%, transparent 45%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic Keepsake Hardware Bezel */
  .iphone-bezel {
      background-color: #16281D;
      box-shadow: 
          inset 0 0 0 2px #D4AF37, 
          inset 0 0 0 7px #0B160F, 
          0 40px 80px -15px rgba(0,0,0,0.92),
          0 15px 25px -5px rgba(0,0,0,0.75);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #D4AF37 0%, #6E5814 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.25),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.12);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(245,239,230,0.1) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(232, 220, 196, 0.09) 0%, rgba(232, 220, 196, 0.03) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.35),
          inset 0 1px 1px rgba(245, 239, 230, 0.14),
          inset 0 -1px 1px rgba(0,0,0,0.55);
      border: 1px solid rgba(232, 220, 196, 0.12);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(245, 239, 230, 0.14) 0%, rgba(45, 90, 64, 0.35) 100%);
      backdrop-filter: blur(20px); 
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 
          0 0 0 1px rgba(232, 220, 196, 0.25),
          0 25px 50px -12px rgba(0, 0, 0, 0.85),
          inset 0 1px 1px rgba(255,255,255,0.25),
          inset 0 -1px 1px rgba(0,0,0,0.55);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #F5EFE6 0%, #E8DCC4 100%);
      color: #1F3D2B;
      box-shadow: 0 0 0 1px rgba(212,175,55,0.35), 0 2px 4px rgba(0,0,0,0.2), 0 14px 28px -4px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(31,61,43,0.12);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(212,175,55,0.55), 0 8px 16px -2px rgba(0,0,0,0.25), 0 22px 36px -6px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(31,61,43,0.12);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #E8DCC4 0%, #D8C7A8 100%);
      box-shadow: 0 0 0 1px rgba(212,175,55,0.3), 0 1px 2px rgba(0,0,0,0.2), inset 0 3px 6px rgba(0,0,0,0.15);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #2D5A40 0%, #193324 100%);
      color: #F5EFE6;
      box-shadow: 0 0 0 1px rgba(232,220,196,0.25), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.7);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #376B4D 0%, #1F3D2B 100%);
      box-shadow: 0 0 0 1px rgba(212,175,55,0.45), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #162C1F;
      box-shadow: 0 0 0 1px rgba(232,220,196,0.15), inset 0 3px 8px rgba(0,0,0,0.85);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }

  @keyframes equestrianTrotting {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-4px) rotate(-2deg); }
      75% { transform: translateY(-2px) rotate(2deg); }
  }

  .animate-equestrian-crest {
      animation: equestrianTrotting 3.6s ease-in-out infinite;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({
  brandName = "THANK YOU",
  tagline1 = "Great mentors don’t just build ventures—",
  tagline2 = "they build communities.",
  cardHeading = "Gratitude Across Time Zones.",
  cardDescription = (
    <>
      <span className="text-[#F5EFE6] font-semibold">
        Dear Professor Lucy Turner
      </span>
      , thank you for your mentorship during Babson Summer Study 2026, your
      leadership in FME, and for inspiring me to elevate builders across
      Gulistan and the Syrdarya region of Uzbekistan.
    </>
  ),
  metricValue = 100,
  metricLabel = "% Gratitude & Impact",
  ctaHeading = "A Digital Keepsake for Professor Turner",
  ctaDescription = "Unseal your personal parchment letter, revisit our July 2026 classroom snapshots, and explore curated Equestrian & Anime picks for your next day off.",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const [gratitudePulse, setGratitudePulse] = useState(1);

  // 1. High-Performance 3D Physical Mouse Interaction Logic (Using requestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 3.5) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 14,
            rotationX: -yVal * 14,
            ease: "power3.out",
            duration: 1.1,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Complex Cinematic Physical Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".hero-kicker-badge", { autoAlpha: 0, y: -24, scale: 0.92 });
      gsap.set(".text-track", {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: "blur(20px)",
        rotationX: -20,
      });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".hero-subcopy", { autoAlpha: 0, y: 28 });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set(
        [
          ".card-left-text",
          ".card-right-text",
          ".mockup-scroll-wrapper",
          ".floating-badge",
          ".phone-widget",
        ],
        { autoAlpha: 0 }
      );
      gsap.set(".cta-wrapper", {
        autoAlpha: 0,
        scale: 0.85,
        filter: "blur(24px)",
      });

      const introTl = gsap.timeline({ delay: 0.2 });
      introTl
        .to(".hero-kicker-badge", {
          duration: 1.0,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "expo.out",
        })
        .to(
          ".text-track",
          {
            duration: 1.6,
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            ease: "expo.out",
          },
          "-=0.6"
        )
        .to(
          ".text-days",
          {
            duration: 1.35,
            clipPath: "inset(0 0% 0 0)",
            ease: "power4.inOut",
          },
          "-=1.0"
        )
        .to(
          ".hero-subcopy",
          {
            duration: 1.1,
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
          },
          "-=0.6"
        );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3600",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(
          [".hero-text-wrapper", ".bg-grid-theme"],
          {
            scale: 1.15,
            filter: "blur(18px)",
            opacity: 0.15,
            ease: "power2.inOut",
            duration: 2,
          },
          0
        )
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", {
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        .fromTo(
          ".mockup-scroll-wrapper",
          {
            y: 260,
            z: -480,
            rotationX: 46,
            rotationY: -28,
            autoAlpha: 0,
            scale: 0.62,
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.4,
          },
          "-=0.8"
        )
        .fromTo(
          ".phone-widget",
          { y: 36, autoAlpha: 0, scale: 0.94 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.15,
            ease: "back.out(1.2)",
            duration: 1.4,
          },
          "-=1.5"
        )
        .to(
          ".progress-ring",
          { strokeDashoffset: 36, duration: 2, ease: "power3.inOut" },
          "-=1.2"
        )
        .to(
          ".counter-val",
          {
            innerHTML: metricValue,
            snap: { innerHTML: 1 },
            duration: 2,
            ease: "expo.out",
          },
          "-=2.0"
        )
        .fromTo(
          ".floating-badge",
          { y: 90, autoAlpha: 0, scale: 0.72, rotationZ: -10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: "back.out(1.5)",
            duration: 1.5,
            stagger: 0.2,
          },
          "-=2.0"
        )
        .fromTo(
          ".card-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5"
        )
        .fromTo(
          ".card-right-text",
          { x: 50, autoAlpha: 0, scale: 0.82 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<"
        )
        .to({}, { duration: 1.8 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.0 })
        .to(
          [
            ".mockup-scroll-wrapper",
            ".floating-badge",
            ".card-left-text",
            ".card-right-text",
          ],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          }
        )
        .to(
          ".main-card",
          {
            width: isMobile ? "92vw" : "85vw",
            height: isMobile ? "92vh" : "85vh",
            borderRadius: isMobile ? "32px" : "40px",
            ease: "expo.inOut",
            duration: 1.6,
          },
          "pullback"
        )
        .to(
          ".cta-wrapper",
          {
            scale: 1,
            filter: "blur(0px)",
            ease: "expo.inOut",
            duration: 1.6,
          },
          "pullback"
        )
        .to(".main-card", {
          y: -window.innerHeight - 300,
          ease: "power3.in",
          duration: 1.4,
        });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      id="our-summer"
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#1F3D2B] text-[#E8DCC4] antialiased select-none",
        className
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-75"
        aria-hidden="true"
      />

      {/* BACKGROUND LAYER 1: Animated Opening Hero Header & Interactive Welcome */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 sm:px-8 max-w-6xl mx-auto will-change-transform transform-style-3d pt-12">
        {/* Animated Equestrian & Babson Welcome Badge */}
        <div className="hero-kicker-badge gsap-reveal inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 py-2.5 rounded-full bg-[#2D5A40]/70 border border-[#D4AF37]/45 shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-xs sm:text-sm font-medium text-[#F5EFE6] mb-7">
          <span className="inline-flex items-center gap-1.5 text-[#D4AF37] font-semibold">
            <svg
              viewBox="0 0 28 20"
              className="w-5 h-4 animate-equestrian-crest"
              fill="none"
            >
              <path
                d="M3 15 C5 12, 8 11, 11 11 L16 9.5 C18 7, 20 5, 22 4.5 C23.2 4.2, 24.5 5, 23.8 6.5 C23.2 7.8, 21.5 8.8, 20.5 10.2 L22 13 C23.8 14, 25.5 15, 26.5 16.2 M18.5 13 L20.5 18 M11.5 13 L9 18"
                stroke="#D4AF37"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>+ Babson Summer Study 2026</span>
          </span>
          <span className="text-[#E8DCC4]/40">·</span>
          <span>+ Entrepreneurial Leadership</span>
          <span className="text-[#E8DCC4]/40">·</span>
          <span>+ From Uzbekistan to Wellesley</span>
        </div>

        {/* 3D Animated Opening Headline */}
        <h1 className="text-track gsap-reveal font-editorial text-3d-matte text-4xl sm:text-6xl lg:text-[4.6rem] font-normal tracking-tight leading-[1.08] mb-2 max-w-5xl">
          {tagline1}
        </h1>
        <h2 className="text-days gsap-reveal font-editorial italic text-silver-matte text-4xl sm:text-6xl lg:text-[4.8rem] font-semibold tracking-tight leading-[1.12] pb-2">
          {tagline2}
        </h2>

        {/* Subheadline & Physical Scroll Prompt */}
        <div className="hero-subcopy gsap-reveal mt-5 max-w-2xl mx-auto flex flex-col items-center">
          <p className="text-base sm:text-xl text-[#E8DCC4]/90 leading-relaxed mb-7">
            A small digital token of gratitude for{" "}
            <span className="text-[#F5EFE6] font-semibold underline decoration-[#D4AF37]/70 underline-offset-4">
              Professor Lucy Turner
            </span>
            —for your mentorship, your belief in my journey, and the lessons I
            carry forward.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#the-letter"
              className="btn-modern-light inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap shrink-0"
            >
              <MailOpen className="w-4 h-4 text-[#2D5A40]" />
              <span>Read My Note ↓</span>
            </a>
            <a
              href="#curations"
              className="btn-modern-dark inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-medium whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Explore Curated Picks</span>
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>Scroll gently to experience the 3D Gratitude Keepsake</span>
          </div>
        </div>
      </div>

      {/* BACKGROUND LAYER 2: Tactile Pullback CTA Screen */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 sm:px-8 gsap-reveal pointer-events-auto will-change-transform">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D5A40]/70 border border-[#D4AF37]/40 text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Thank You, Professor Lucy Turner</span>
        </div>
        <h2 className="font-editorial text-4xl md:text-6xl lg:text-7xl font-normal mb-5 tracking-tight text-silver-matte max-w-4xl leading-[1.1]">
          {ctaHeading}
        </h2>
        <p className="text-[#E8DCC4]/85 text-base md:text-xl mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <a
            href="#the-letter"
            className="btn-modern-light flex items-center justify-center gap-3.5 px-8 py-4 rounded-2xl group"
          >
            <MailOpen className="w-7 h-7 text-[#1F3D2B] transition-transform group-hover:scale-110" />
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-[#2D5A40] uppercase mb-[-2px]">
                Section 01 · Wax-Sealed
              </div>
              <div className="text-lg font-bold leading-none tracking-tight text-[#1F3D2B]">
                Open Personal Letter ↓
              </div>
            </div>
          </a>

          <a
            href="#curations"
            className="btn-modern-dark flex items-center justify-center gap-3.5 px-8 py-4 rounded-2xl group"
          >
            <Compass className="w-7 h-7 text-[#D4AF37] transition-transform group-hover:scale-110" />
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-[#D4AF37] uppercase mb-[-2px]">
                Section 03 · Equestrian &amp; Anime
              </div>
              <div className="text-lg font-bold leading-none tracking-tight text-[#F5EFE6]">
                Explore Curated Picks
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Skeuomorphic Deep Forest & Gold Card */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE 3-COLUMN PHYSICAL GRID */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            {/* 1. TOP (Mobile) / RIGHT (Desktop): SCULPTED GRATITUDE WORDMARK */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex flex-col items-center lg:items-end justify-center z-20 w-full">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
                Babson College · FME &amp; Summer ’26
              </span>
              <h2 className="font-editorial text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-bold uppercase tracking-tight text-card-silver-matte text-center lg:text-right leading-[0.95]">
                {brandName}
              </h2>
              <p className="hidden lg:block text-xs text-[#E8DCC4]/70 mt-3 text-right max-w-xs">
                Move your cursor to tilt the 3D keepsake in physical space, or
                click the heart to send a thank-you pulse.
              </p>
            </div>

            {/* 2. MIDDLE (Mobile) / CENTER (Desktop): 3D INTERACTIVE KEEPSAKE HARDWARE MOCKUP */}
            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                {/* Physical 3D Bezel */}
                <div
                  ref={mockupRef}
                  className="relative w-[290px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Physical Gold Hardware Buttons */}
                  <div
                    className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]"
                    aria-hidden="true"
                  />

                  {/* Inner Screen Container */}
                  <div className="absolute inset-[7px] bg-[#0F2117] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_18px_rgba(0,0,0,0.95)] text-[#F5EFE6] z-10">
                    <div
                      className="absolute inset-0 screen-glare z-40 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.12)]">
                      <span className="text-[9px] font-mono text-[#D4AF37] tracking-wider">
                        BABSON ’26
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    </div>

                    {/* Interactive Keepsake App Interface */}
                    <div className="relative w-full h-full pt-12 px-5 pb-7 flex flex-col justify-between">
                      {/* Header with Amirbek's Portrait */}
                      <div className="phone-widget flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-0.5">
                            Mentee Tribute
                          </span>
                          <span className="font-editorial text-lg font-semibold tracking-tight text-[#F5EFE6]">
                            For Prof. Turner
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md bg-[#1F3D2B]">
                          <img
                            src={AMIR_PORTRAIT_URL}
                            alt="Amirbek Orifjonov"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* Animated Golden Progress Ring */}
                      <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center my-2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          aria-hidden="true"
                        >
                          <circle
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="rgba(232,220,196,0.08)"
                            strokeWidth="11"
                          />
                          <circle
                            className="progress-ring"
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="11"
                          />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center px-3">
                          <span className="counter-val font-editorial text-4xl font-bold tracking-tight text-[#F5EFE6] tabular-nums">
                            0
                          </span>
                          <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.12em] font-bold mt-1">
                            {metricLabel}
                          </span>
                        </div>
                      </div>

                      {/* Tactile Mini Widgets inside Screen */}
                      <div className="space-y-2.5">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/35 shrink-0">
                            <span className="text-base">🐎</span>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-semibold text-[#F5EFE6] leading-tight">
                              Equestrian &amp; FME Spirit
                            </div>
                            <div className="text-[10px] text-[#E8DCC4]/70">
                              Listening deeply &amp; building trust
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setGratitudePulse((n) => n + 1)}
                          className="phone-widget widget-depth w-full rounded-2xl p-3 flex items-center justify-between gap-2 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#2D5A40]/50 flex items-center justify-center border border-[#E8DCC4]/25 shrink-0">
                              <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-semibold text-[#F5EFE6] leading-tight">
                                Tap to Send Gratitude
                              </div>
                              <div className="text-[10px] text-[#E8DCC4]/70">
                                Gulistan → Wellesley
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#1F3D2B] font-mono text-[10px] font-bold tabular-nums">
                            +{gratitudePulse}
                          </span>
                        </button>
                      </div>

                      <div className="w-[110px] h-[4px] mx-auto bg-[#E8DCC4]/25 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating 3D Glass Badges */}
                <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-85px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 z-30">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/45 shadow-inner">
                    <span className="text-base lg:text-xl" aria-hidden="true">
                      🌱
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[#F5EFE6] text-xs lg:text-sm font-bold tracking-tight">
                      Syrdarya Ecosystem
                    </p>
                    <p className="text-[#D4AF37] text-[10px] lg:text-xs font-medium">
                      Babson Lessons in Action
                    </p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-85px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 z-30">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#2D5A40]/60 flex items-center justify-center border border-[#E8DCC4]/35 shadow-inner">
                    <span className="text-base lg:text-lg" aria-hidden="true">
                      🤝
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[#F5EFE6] text-xs lg:text-sm font-bold tracking-tight">
                      Mentorship &amp; FME
                    </p>
                    <p className="text-[#E8DCC4]/80 text-[10px] lg:text-xs font-medium">
                      Amirbek Orifjonov · July ’26
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BOTTOM (Mobile) / LEFT (Desktop): GRATITUDE EDITORIAL TEXT */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="font-editorial text-[#F5EFE6] text-2xl md:text-3xl lg:text-4xl font-normal mb-2 lg:mb-4 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-[#E8DCC4]/85 text-sm md:text-base lg:text-[17px] font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
