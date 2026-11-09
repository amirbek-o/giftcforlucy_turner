import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

export interface LuminaSlide {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  accentColor: string;
  bgStart: string;
  bgEnd: string;
}

const GRATITUDE_SLIDES: LuminaSlide[] = [
  {
    title: "The Fernwood Spirit",
    subtitle: "01 · Mentorship & Community",
    description:
      "“Great mentors don’t just teach you how to build ventures—they teach you how to build communities.”",
    imageUrl: "/assets/aistudio/Screenshot_2026-07-28_180335_c354e4d9.png",
    accentColor: "#D4AF37",
    bgStart: "#1F3D2B",
    bgEnd: "#0E1F15",
  },
  {
    title: "Listening Deeply",
    subtitle: "02 · Babson Summer Study · July 2026",
    description:
      "True entrepreneurial leadership isn’t about pushing your own ideas forward—it is about elevating different perspectives.",
    imageUrl: "/assets/aistudio/Screenshot_2026-07-28_192258_13aa3923.png",
    accentColor: "#E8DCC4",
    bgStart: "#254934",
    bgEnd: "#12261A",
  },
  {
    title: "Across Time Zones",
    subtitle: "03 · From Wellesley to Uzbekistan",
    description:
      "Thank you for taking time out of your busy FME schedule to write on my behalf and stay in touch across 9 time zones.",
    imageUrl: "/assets/aistudio/Screenshot_2026-07-28_185900_4d9ba7b5.png",
    accentColor: "#D4AF37",
    bgStart: "#1B3626",
    bgEnd: "#0C1A12",
  },
  {
    title: "Equestrian Cadence",
    subtitle: "04 · Trust in the Saddle & Classroom",
    description:
      "Like horsemanship at dawn, guiding a cohort of young founders takes patience, empathy, and unspoken trust.",
    imageUrl: "/assets/aistudio/Screenshot_2026-07-28_180335_c354e4d9.png",
    accentColor: "#F5EFE6",
    bgStart: "#2D5A40",
    bgEnd: "#14291D",
  },
  {
    title: "Builders in Syrdarya",
    subtitle: "05 · Carrying Babson Lessons Forward",
    description:
      "From our Uzbekistan Startup Podcast to youth venture cohorts in Gulistan, your classroom lessons live in everything I build.",
    imageUrl: "/assets/aistudio/image_55603814.png",
    accentColor: "#D4AF37",
    bgStart: "#234430",
    bgEnd: "#102117",
  },
  {
    title: "With Deepest Gratitude",
    subtitle: "06 · Amirbek (Amir) Orifjonov",
    description:
      "Thank you for inspiring me to create opportunities that reach far beyond myself, Professor Turner.",
    imageUrl: "/assets/aistudio/Screenshot_2026-07-28_185900_4d9ba7b5.png",
    accentColor: "#E8DCC4",
    bgStart: "#1F3D2B",
    bgEnd: "#0B1810",
  },
];

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeEffect, setActiveEffect] = useState<
    "glass" | "frost" | "ripple" | "plasma" | "timeshift"
  >("glass");
  const effectSetterRef = useRef<((eff: string) => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId = 0;

    const SLIDER_CONFIG: any = {
      settings: {
        transitionDuration: 2.1,
        autoSlideSpeed: 5200,
        currentEffect: "glass",
        globalIntensity: 1.0,
        speedMultiplier: 1.0,
        distortionStrength: 1.0,
        colorEnhancement: 1.0,
        glassRefractionStrength: 1.0,
        glassChromaticAberration: 1.0,
        glassBubbleClarity: 1.0,
        glassEdgeGlow: 1.0,
        glassLiquidFlow: 1.0,
        frostIntensity: 1.5,
        frostCrystalSize: 1.0,
        frostIceCoverage: 1.0,
        frostTemperature: 1.0,
        frostTexture: 1.0,
        rippleFrequency: 25.0,
        rippleAmplitude: 0.08,
        rippleWaveSpeed: 1.0,
        rippleRippleCount: 1.0,
        rippleDecay: 1.0,
        plasmaIntensity: 1.2,
        plasmaSpeed: 0.8,
        plasmaEnergyIntensity: 0.4,
        plasmaContrastBoost: 0.3,
        plasmaTurbulence: 1.0,
        timeshiftDistortion: 1.6,
        timeshiftBlur: 1.5,
        timeshiftFlow: 1.4,
        timeshiftChromatic: 1.5,
        timeshiftTurbulence: 1.4,
      },
    };

    let currentSlideIndex = 0;
    let isTransitioning = false;
    let shaderMaterial: THREE.ShaderMaterial | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    const slideTextures: THREE.Texture[] = [];
    let texturesLoaded = false;
    let autoSlideTimer: any = null;
    let progressAnimation: any = null;
    let sliderEnabled = false;

    const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
    const PROGRESS_UPDATE_INTERVAL = 50;
    const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture1, uTexture2;
      uniform float uProgress;
      uniform vec2 uResolution, uTexture1Size, uTexture2Size;
      uniform int uEffectType;
      uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
      uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
      uniform float uRippleFrequency, uRippleAmplitude;
      varying vec2 vUv;

      vec2 getCoverUV(vec2 uv, vec2 textureSize) {
        vec2 s = uResolution / max(textureSize, vec2(1.0));
        float scale = max(s.x, s.y);
        vec2 scaledSize = textureSize * scale;
        vec2 offset = (uResolution - scaledSize) * 0.5;
        return (uv * uResolution - offset) / max(scaledSize, vec2(1.0));
      }

      vec4 glassEffect(vec2 uv, float progress) {
        float time = progress * 5.0 * uSpeedMultiplier;
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float maxR = length(uResolution) * 0.85;
        float br = progress * maxR;
        vec2 p = uv * uResolution;
        vec2 c = uResolution * 0.5;
        float d = length(p - c);
        float nd = d / max(br, 0.001);
        float param = smoothstep(br + 3.0, br - 3.0, d);
        vec4 img;
        if (param > 0.0) {
          float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
          vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
          vec2 distUV = uv2 - dir * ro;
          distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
          float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
          img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0
          );
          if (uGlassEdgeGlow > 0.0) {
            float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
            img.rgb += rim * 0.14 * uGlassEdgeGlow * vec3(0.83, 0.68, 0.21);
          }
        } else {
          img = texture2D(uTexture2, uv2);
        }
        vec4 oldImg = texture2D(uTexture1, uv1);
        if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
        return mix(oldImg, img, param);
      }

      vec4 rippleEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float dist = distance(uv, vec2(0.5));
        float wave = sin(dist * uRippleFrequency - progress * 12.0) * uRippleAmplitude * (1.0 - progress);
        vec2 displacedUv1 = uv1 + normalize(uv - vec2(0.5) + 0.0001) * wave;
        vec2 displacedUv2 = uv2 - normalize(uv - vec2(0.5) + 0.0001) * wave;
        return mix(texture2D(uTexture1, displacedUv1), texture2D(uTexture2, displacedUv2), smoothstep(0.0, 1.0, progress));
      }

      vec4 frostEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float n = fract(sin(dot(uv * 80.0, vec2(12.9898, 78.233))) * 43758.5453);
        float disp = (n - 0.5) * 0.04 * sin(progress * 3.14159);
        return mix(texture2D(uTexture1, uv1 + disp), texture2D(uTexture2, uv2 - disp), progress);
      }

      vec4 plasmaEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float swirl = sin(uv.x * 10.0 + progress * 6.0) * cos(uv.y * 10.0 + progress * 6.0) * 0.03 * sin(progress * 3.14159);
        vec4 c1 = texture2D(uTexture1, uv1 + swirl);
        vec4 c2 = texture2D(uTexture2, uv2 - swirl);
        vec4 mixed = mix(c1, c2, progress);
        mixed.rgb += vec3(0.83, 0.68, 0.21) * abs(swirl) * 2.5;
        return mixed;
      }

      vec4 timeshiftEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float shift = sin(progress * 3.14159) * 0.045;
        vec4 t1 = vec4(
          texture2D(uTexture1, uv1 + vec2(shift, 0.0)).r,
          texture2D(uTexture1, uv1).g,
          texture2D(uTexture1, uv1 - vec2(shift, 0.0)).b,
          1.0
        );
        vec4 t2 = vec4(
          texture2D(uTexture2, uv2 - vec2(shift, 0.0)).r,
          texture2D(uTexture2, uv2).g,
          texture2D(uTexture2, uv2 + vec2(shift, 0.0)).b,
          1.0
        );
        return mix(t1, t2, smoothstep(0.0, 1.0, progress));
      }

      void main() {
        if (uEffectType == 0) gl_FragColor = glassEffect(vUv, uProgress);
        else if (uEffectType == 1) gl_FragColor = frostEffect(vUv, uProgress);
        else if (uEffectType == 2) gl_FragColor = rippleEffect(vUv, uProgress);
        else if (uEffectType == 3) gl_FragColor = plasmaEffect(vUv, uProgress);
        else gl_FragColor = timeshiftEffect(vUv, uProgress);
      }
    `;

    const getEffectIndex = (n: string) =>
      (({ glass: 0, frost: 1, ripple: 2, plasma: 3, timeshift: 4 } as any)[n] ||
      0);

    effectSetterRef.current = (eff: string) => {
      SLIDER_CONFIG.settings.currentEffect = eff;
      if (shaderMaterial) {
        shaderMaterial.uniforms.uEffectType.value = getEffectIndex(eff);
      }
      navigateToSlide((currentSlideIndex + 1) % GRATITUDE_SLIDES.length);
    };

    const splitText = (text: string) => {
      return text
        .split("")
        .map(
          (char) =>
            `<span style="display: inline-block; opacity: 0;">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");
    };

    const updateContent = (idx: number) => {
      const container = containerRef.current;
      if (!container) return;
      const titleEl = container.querySelector("#mainTitle") as HTMLElement;
      const descEl = container.querySelector("#mainDesc") as HTMLElement;
      const subEl = container.querySelector("#mainSubtitle") as HTMLElement;

      if (titleEl && descEl) {
        gsap.to(Array.from(titleEl.children), {
          y: -20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.015,
          ease: "power2.in",
        });
        gsap.to(descEl, {
          y: -10,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        });

        setTimeout(() => {
          if (!isMounted) return;
          titleEl.innerHTML = splitText(GRATITUDE_SLIDES[idx].title);
          descEl.textContent = GRATITUDE_SLIDES[idx].description;
          if (subEl) subEl.textContent = GRATITUDE_SLIDES[idx].subtitle;

          const children = Array.from(titleEl.children);
          gsap.set(children, { opacity: 0 });
          gsap.set(descEl, { y: 20, opacity: 0 });

          switch (idx) {
            case 0:
              gsap.set(children, { y: 24 });
              gsap.to(children, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.028,
                ease: "power3.out",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.18,
                ease: "power3.out",
              });
              break;
            case 1:
              gsap.set(children, { y: -24 });
              gsap.to(children, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.028,
                ease: "back.out(1.7)",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.18,
                ease: "power3.out",
              });
              break;
            case 2:
              gsap.set(children, { filter: "blur(8px)", scale: 1.35, y: 0 });
              gsap.to(children, {
                filter: "blur(0px)",
                scale: 1,
                opacity: 1,
                duration: 0.85,
                stagger: { amount: 0.4, from: "random" },
                ease: "power2.out",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.85,
                delay: 0.22,
                ease: "power2.out",
              });
              break;
            case 3:
              gsap.set(children, { scale: 0, y: 0 });
              gsap.to(children, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.04,
                ease: "back.out(1.5)",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.18,
                ease: "power3.out",
              });
              break;
            case 4:
              gsap.set(children, {
                rotationX: 90,
                y: 0,
                transformOrigin: "50% 50%",
              });
              gsap.to(children, {
                rotationX: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.035,
                ease: "power2.out",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.18,
                ease: "power2.out",
              });
              break;
            default:
              gsap.set(children, { x: 28, y: 0 });
              gsap.to(children, {
                x: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.028,
                ease: "power3.out",
              });
              gsap.to(descEl, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.18,
                ease: "power3.out",
              });
              break;
          }
        }, 420);
      }
    };

    const updateNavigationState = (idx: number) => {
      const container = containerRef.current;
      if (!container) return;
      container
        .querySelectorAll(".slide-nav-item")
        .forEach((el, i) => el.classList.toggle("active", i === idx));
    };

    const updateSlideProgress = (idx: number, prog: number) => {
      const container = containerRef.current;
      if (!container) return;
      const el = container
        .querySelectorAll(".slide-nav-item")
        [idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.width = `${prog}%`;
        el.style.opacity = "1";
      }
    };

    const fadeSlideProgress = (idx: number) => {
      const container = containerRef.current;
      if (!container) return;
      const el = container
        .querySelectorAll(".slide-nav-item")
        [idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.opacity = "0";
        setTimeout(() => (el.style.width = "0%"), 300);
      }
    };

    const quickResetProgress = (idx: number) => {
      const container = containerRef.current;
      if (!container) return;
      const el = container
        .querySelectorAll(".slide-nav-item")
        [idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.transition = "width 0.2s ease-out";
        el.style.width = "0%";
        setTimeout(
          () => (el.style.transition = "width 0.1s ease, opacity 0.3s ease"),
          200
        );
      }
    };

    const updateCounter = (idx: number) => {
      const container = containerRef.current;
      if (!container) return;
      const sn = container.querySelector("#slideNumber");
      if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
      const st = container.querySelector("#slideTotal");
      if (st)
        st.textContent = String(GRATITUDE_SLIDES.length).padStart(2, "0");
    };

    const stopAutoSlideTimer = () => {
      if (progressAnimation) clearInterval(progressAnimation);
      if (autoSlideTimer) clearTimeout(autoSlideTimer);
      progressAnimation = null;
      autoSlideTimer = null;
    };

    const startAutoSlideTimer = () => {
      if (!texturesLoaded || !sliderEnabled || !isMounted) return;
      stopAutoSlideTimer();
      let progress = 0;
      const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
      progressAnimation = setInterval(() => {
        if (!sliderEnabled || !isMounted) {
          stopAutoSlideTimer();
          return;
        }
        progress += increment;
        updateSlideProgress(currentSlideIndex, progress);
        if (progress >= 100) {
          clearInterval(progressAnimation);
          progressAnimation = null;
          fadeSlideProgress(currentSlideIndex);
          if (!isTransitioning) {
            navigateToSlide(
              (currentSlideIndex + 1) % GRATITUDE_SLIDES.length
            );
          }
        }
      }, PROGRESS_UPDATE_INTERVAL);
    };

    const safeStartTimer = (delay = 0) => {
      stopAutoSlideTimer();
      if (sliderEnabled && texturesLoaded && isMounted) {
        if (delay > 0)
          autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
        else startAutoSlideTimer();
      }
    };

    const navigateToSlide = (targetIndex: number) => {
      if (
        isTransitioning ||
        targetIndex === currentSlideIndex ||
        !shaderMaterial
      )
        return;
      stopAutoSlideTimer();
      quickResetProgress(currentSlideIndex);

      const currentTexture = slideTextures[currentSlideIndex];
      const targetTexture = slideTextures[targetIndex];
      if (!currentTexture || !targetTexture) return;

      isTransitioning = true;
      shaderMaterial.uniforms.uTexture1.value = currentTexture;
      shaderMaterial.uniforms.uTexture2.value = targetTexture;
      shaderMaterial.uniforms.uTexture1Size.value =
        currentTexture.userData.size;
      shaderMaterial.uniforms.uTexture2Size.value =
        targetTexture.userData.size;

      updateContent(targetIndex);

      currentSlideIndex = targetIndex;
      updateCounter(currentSlideIndex);
      updateNavigationState(currentSlideIndex);

      gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: TRANSITION_DURATION(),
          ease: "power2.inOut",
          onComplete: () => {
            if (!shaderMaterial || !isMounted) return;
            shaderMaterial.uniforms.uProgress.value = 0;
            shaderMaterial.uniforms.uTexture1.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value =
              targetTexture.userData.size;
            isTransitioning = false;
            safeStartTimer(100);
          },
        }
      );
    };

    // Build rich 1600x1000 procedural + photo composite texture for each slide
    const createCompositeSlideTexture = (
      slide: LuminaSlide,
      idx: number
    ): Promise<THREE.Texture> => {
      return new Promise((resolve) => {
        const w = 1600;
        const h = 1000;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = w;
        offCanvas.height = h;
        const ctx = offCanvas.getContext("2d")!;

        const drawBaseAndResolve = (img?: HTMLImageElement) => {
          // Rich Fernwood gradient backdrop
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, slide.bgStart);
          grad.addColorStop(1, slide.bgEnd);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // If image loaded, draw it with atmospheric editorial framing and vignette
          if (img && img.width > 0) {
            ctx.save();
            ctx.globalAlpha = 0.42;
            const scale = Math.max(w / img.width, h / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
            ctx.restore();
          }

          // Dark forest editorial scrim for contrast
          const radialScrim = ctx.createRadialGradient(
            w * 0.5,
            h * 0.45,
            100,
            w * 0.5,
            h * 0.5,
            w * 0.75
          );
          radialScrim.addColorStop(0, "rgba(15, 33, 23, 0.35)");
          radialScrim.addColorStop(1, "rgba(10, 22, 15, 0.85)");
          ctx.fillStyle = radialScrim;
          ctx.fillRect(0, 0, w, h);

          // Subtle architectural golden rings & equestrian horizon lines
          ctx.strokeStyle = "rgba(212, 175, 55, 0.22)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(w * 0.76, h * 0.42, 240 + idx * 18, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(232, 220, 196, 0.12)";
          ctx.beginPath();
          ctx.arc(w * 0.76, h * 0.42, 340 + idx * 12, 0, Math.PI * 2);
          ctx.stroke();

          const tex = new THREE.CanvasTexture(offCanvas);
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.userData = { size: new THREE.Vector2(w, h) };
          resolve(tex);
        };

        if (slide.imageUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => drawBaseAndResolve(img);
          img.onerror = () => drawBaseAndResolve();
          img.src = slide.imageUrl;
        } else {
          drawBaseAndResolve();
        }
      });
    };

    const createSlidesNavigation = () => {
      const container = containerRef.current;
      if (!container) return;
      const nav = container.querySelector("#slidesNav");
      if (!nav) return;
      nav.innerHTML = "";
      GRATITUDE_SLIDES.forEach((slide, i) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `slide-nav-item text-left group cursor-pointer ${
          i === 0 ? "active" : ""
        }`;
        item.dataset.slideIndex = String(i);
        item.innerHTML = `
          <div class="slide-progress-line h-[3px] w-full bg-[#E8DCC4]/20 rounded-full overflow-hidden mb-2">
            <div class="slide-progress-fill h-full w-0 bg-[#D4AF37] transition-all"></div>
          </div>
          <div class="slide-nav-title text-[11px] sm:text-xs font-medium text-[#E8DCC4]/70 group-hover:text-[#F5EFE6] truncate">
            0${i + 1}. ${slide.title}
          </div>
        `;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!isTransitioning && i !== currentSlideIndex) {
            stopAutoSlideTimer();
            quickResetProgress(currentSlideIndex);
            navigateToSlide(i);
          }
        });
        nav.appendChild(item);
      });
    };

    const initRenderer = async () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const w = Math.max(rect.width, 320);
      const h = Math.max(rect.height, 480);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null },
          uTexture2: { value: null },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(w, h) },
          uTexture1Size: { value: new THREE.Vector2(1600, 1000) },
          uTexture2Size: { value: new THREE.Vector2(1600, 1000) },
          uEffectType: { value: 0 },
          uGlobalIntensity: { value: 1.0 },
          uSpeedMultiplier: { value: 1.0 },
          uDistortionStrength: { value: 1.0 },
          uGlassRefractionStrength: { value: 1.0 },
          uGlassChromaticAberration: { value: 1.0 },
          uGlassBubbleClarity: { value: 1.0 },
          uGlassEdgeGlow: { value: 1.0 },
          uGlassLiquidFlow: { value: 1.0 },
          uRippleFrequency: { value: 25.0 },
          uRippleAmplitude: { value: 0.08 },
        },
        vertexShader,
        fragmentShader,
      });

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

      for (let i = 0; i < GRATITUDE_SLIDES.length; i++) {
        const tex = await createCompositeSlideTexture(GRATITUDE_SLIDES[i], i);
        if (!isMounted) return;
        slideTextures.push(tex);
      }

      if (slideTextures.length >= 2 && shaderMaterial) {
        shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
        shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
        shaderMaterial.uniforms.uTexture1Size.value =
          slideTextures[0].userData.size;
        shaderMaterial.uniforms.uTexture2Size.value =
          slideTextures[1].userData.size;
        texturesLoaded = true;
        sliderEnabled = true;
        safeStartTimer(400);
      }

      const renderLoop = () => {
        if (!isMounted) return;
        animationFrameId = requestAnimationFrame(renderLoop);
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      renderLoop();
    };

    createSlidesNavigation();
    updateCounter(0);

    const container = containerRef.current;
    if (container) {
      const tEl = container.querySelector("#mainTitle") as HTMLElement;
      const dEl = container.querySelector("#mainDesc") as HTMLElement;
      const sEl = container.querySelector("#mainSubtitle") as HTMLElement;
      if (tEl && dEl) {
        tEl.innerHTML = splitText(GRATITUDE_SLIDES[0].title);
        dEl.textContent = GRATITUDE_SLIDES[0].description;
        if (sEl) sEl.textContent = GRATITUDE_SLIDES[0].subtitle;
        gsap.fromTo(
          Array.from(tEl.children),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.028,
            ease: "power3.out",
            delay: 0.3,
          }
        );
        gsap.fromTo(
          dEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.55 }
        );
      }
    }

    initRenderer();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !shaderMaterial) return;
      const rect = containerRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      shaderMaterial.uniforms.uResolution.value.set(rect.width, rect.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      stopAutoSlideTimer();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      slideTextures.forEach((t) => t.dispose());
      shaderMaterial?.dispose();
      renderer?.dispose();
    };
  }, []);

  const handleSwitchEffect = (
    eff: "glass" | "frost" | "ripple" | "plasma" | "timeshift"
  ) => {
    setActiveEffect(eff);
    effectSetterRef.current?.(eff);
  };

  return (
    <section
      aria-label="Interactive WebGL Gratitude Tapestry"
      className="relative py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto z-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-2">
            Interactive Shader Canvas · Touch &amp; Transition
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE6] font-normal tracking-tight">
            Six Pillars of Our Summer Study Journey
          </h2>
        </div>

        {/* Interactive Shader Effect Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#162C1F] p-1.5 rounded-xl border border-[#E8DCC4]/20">
          {(
            [
              { id: "glass", label: "Liquid Glass" },
              { id: "ripple", label: "Golden Ripple" },
              { id: "frost", label: "Morning Frost" },
              { id: "plasma", label: "Warm Glow" },
              { id: "timeshift", label: "Timeshift" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSwitchEffect(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeEffect === item.id
                  ? "bg-[#D4AF37] text-[#1F3D2B] font-semibold shadow-sm"
                  : "text-[#E8DCC4]/75 hover:text-[#F5EFE6]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main WebGL Slider Container */}
      <div
        ref={containerRef}
        className="slider-wrapper relative w-full h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-[#E8DCC4]/30 shadow-[0_30px_80px_rgba(0,0,0,0.55)] bg-[#14281C] flex flex-col justify-between p-6 sm:p-12 select-none"
      >
        <canvas
          ref={canvasRef}
          className="webgl-canvas absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Top Slide Counter Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-widest text-[#E8DCC4]/80">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F3D2B]/75 border border-[#E8DCC4]/25">
            <span id="slideNumber" className="text-[#D4AF37] font-bold">
              01
            </span>
            <span>/</span>
            <span id="slideTotal">06</span>
          </div>
          <span
            id="mainSubtitle"
            className="uppercase tracking-[0.2em] text-[#D4AF37] font-sans font-semibold text-xs"
          >
            01 · Mentorship &amp; Community
          </span>
        </div>

        {/* Center Animated Slide Typography */}
        <div className="slide-content relative z-10 my-auto max-w-3xl py-6">
          <h3
            id="mainTitle"
            className="slide-title font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#F5EFE6] font-normal tracking-tight leading-[1.08] mb-5 drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          />
          <p
            id="mainDesc"
            className="slide-description text-base sm:text-xl text-[#E8DCC4]/95 leading-relaxed max-w-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Bottom Interactive Slide Progress Navigation */}
        <nav
          id="slidesNav"
          aria-label="Gratitude Chapters"
          className="slides-navigation relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[#E8DCC4]/15"
        />
      </div>
    </section>
  );
}

export default Component;
