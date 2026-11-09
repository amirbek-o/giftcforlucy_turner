# Gratitude Scrollytelling Website for Professor Lucy Turner

An interactive, editorial "Scrollytelling" digital keepsake created by Babson Summer Study 2026 student Amirbek (Amir) Orifjonov for Professor Lucy Turner (Assistant Professor of Practice in Management and Co-Director of FME at Babson College), blending equestrian warmth, Babson entrepreneurial leadership, personal memories, Gemini-powered reflections, and Google Drive archiving.

## User Review & Critical Decisions

> [!IMPORTANT]
> Below is the synthesis of your confirmed design and functional choices from Phase 1, alongside how your uploaded photos, Gemini intelligence, and Google Drive integration will be woven seamlessly into the experience.

- **Confirmed Decision 1 — Portrait & Screenshot Placement**: Your portrait photo (`/assets/aistudio/image_55603814.png`) will be featured alongside your signature at the bottom of the interactive parchment letter and inside a dedicated **Founder & Mentee Spotlight Card** connecting Gulistan, Uzbekistan to Wellesley, Massachusetts. Your three actual Babson Summer Study Zoom screenshots (`/assets/aistudio/Screenshot_2026-07-28_180335_c354e4d9.png`, `/assets/aistudio/Screenshot_2026-07-28_192258_13aa3923.png`, and `/assets/aistudio/Screenshot_2026-07-28_185900_4d9ba7b5.png`) will pre-populate the Polaroid Gallery frames with interactive lightbox viewing and custom photo upload/swap support.
- **Confirmed Decision 2 — Gemini Intelligence Integration**: The site preserves your exact written gratitude letter and anime curations as the centerpiece while adding two thoughtful AI layers powered by server-side Gemini (`gemini-3.8-flash`):
  1. **Subtle AI Memory Insights**: Context-aware reflection notes on each Summer Study Polaroid frame highlighting the FME & Entrepreneurial Leadership takeaways from that specific session (e.g., *Learn 2 Earn* presentation with Professor Turner's horse farm Zoom backdrop, *Startup Budget & Resources* Q&A chat exchange, and the *Wheel of Names* cohort session).
  2. **Interactive "Equestrian & Entrepreneurial Lens" Reflection Generator**: An interactive studio panel where Professor Turner (or any visitor) can select a leadership theme, venture idea, or favorite pastime and generate a custom Babson FME + Equestrian/Anime cross-disciplinary reflection or bespoke day-off recommendation.
- **Confirmed Decision 3 — Google Drive Integration**: Visitors can connect their Google Drive (`drive.file` and `drive.readonly` scopes) to:
  1. **Save Keepsake Archive to Google Drive**: Export and save a beautifully formatted keepsake document/archive of the gratitude letter, Summer Study memories, and curated recommendations directly to their Google Drive.
  2. **Import Photos from Google Drive**: Browse and pull additional Summer Study photos directly from Google Drive into the interactive Polaroid gallery.

---

## 1. Overview & Core Concept

- **What It Does**: Delivers a weightless, tactile single-page scrollytelling experience that unfolds like a curated monograph and personal letter—opening with an editorial hero, transitioning into an interactive wax-sealed envelope that reveals Amirbek's letter paragraph by paragraph with soft golden highlights, showcasing real July 2026 Babson Summer Study Zoom screenshots in an interactive Polaroid gallery, presenting four tailored anime recommendations through an Entrepreneur + Equestrian lens, and concluding with a celebratory virtual carrot & coffee particle burst.
- **Target Audience / Persona**: Professor Lucy Turner (Assistant Professor of Practice in Management & Co-Director of FME at Babson College), celebrating her mentorship, equestrian passion, and lasting impact on Amirbek's entrepreneurial journey in Uzbekistan.
- **Key Value**: Transforms a heartfelt thank-you note into an enduring, interactive digital artifact that demonstrates entrepreneurial care, craftsmanship, and cross-cultural gratitude from Gulistan to Wellesley.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Arrival & Navigation**: The user lands on a deep forest green (`#1F3D2B`) canvas illuminated by a gentle stardust particle drift and a top frosted-glass navigation bar (`backdrop-filter: blur(12px)`) featuring a subtle SVG galloping horse silhouette that progresses along a curved trail as the user scrolls.
2. **Hero Opening**: Displays the editorial metadata line (`Babson Summer Study 2026 · Entrepreneurial Leadership · From Uzbekistan to Wellesley`), the main serif headline, subheadline, and two smooth-scroll actions ("Read My Note ↓" and "Explore Curated Picks").
3. **Interactive Wax-Sealed Letter & Mentee Spotlight**: Scrolling to Section B triggers (or lets the reader click to unseal) a tactile gold wax seal (`LT` / Babson-inspired equestrian crest) on a Warm Sand Beige (`#E8DCC4`) envelope. As the parchment rises, each paragraph of Amirbek's exact letter fades and slides upward (`cubic-bezier(0.22, 1, 0.36, 1)`) with warm gold highlighter glows on key phrases. At the signature block, Amirbek's portrait photo appears alongside a **Mentee Spotlight Card** detailing his work in the Syrdarya region and Startup Podcast in Uzbekistan.
4. **Summer Study Memories Polaroid Gallery (Local + Google Drive)**: Displays the 3 real July 2026 Babson Summer Study Zoom screenshots in tactile Sand Beige Polaroid frames with subtle 3D tilt-on-hover physics, fullscreen lightbox inspection, local drag-and-drop/file swap, Google Drive photo picker/import, and subtle Gemini AI "Session Takeaway" annotations.
5. **Equestrian & Anime Curations + Gemini Lens Studio**: Presents the 4 curated anime picks (*Silver Spoon*, *Spice and Wolf*, *Fanfare of Adolescence*, and *Sakura Quest*). Hovering or toggling each card flips/expands the "Why You'll Love It (The Entrepreneur + Equestrian Lens)" pitch. Below the grid, an interactive **Gemini FME & Equestrian Reflection Studio** lets Professor Turner generate custom cross-disciplinary reflections or tailored recommendations.
6. **Celebratory Closing & Keepsake Export**: At the footer, clicking **"Celebrate with a Virtual Treat 🐎☕"** triggers a physics-guided burst of golden particles, horseshoes, carrots, and coffee cups, revealing the banner *"Thank you for everything, Professor Turner!"* alongside a one-click **"Save Keepsake to Google Drive"** action.

### Visual Identity & Theme
- **Aesthetic Direction**: *Fernwood Equestrian & Editorial*—calm, tactile, organic, and museum-grade archival warmth inspired by New England equestrian estates, Babson College heritage, and Studio Ghibli pastoral serenity.
- **Color Palette & Mood**:
  - `--background`: Deep Forest Green (`#1F3D2B`) with subtle deep canopy shading (`#162C1F`) and soft mist/fog section transitions.
  - `--surface` / `--card`: Warm Sand Beige (`#E8DCC4`) and Soft Archival Cream (`#F5EFE6`) with delicate `1px` borders (`rgba(232, 220, 196, 0.25)`).
  - `--secondary`: Muted Sage (`#2D5A40`) for quiet structural containers and interactive hover states.
  - `--accent`: Warm Equestrian Gold (`#D4AF37`) for the wax seal, scroll-progress horse trail, phrase highlighter glow, and celebration particles.
- **Typography & Hierarchy**:
  - *Display & Editorial Headings*: **Playfair Display** (Regular, Semi-Bold, and Italic accents) with `text-wrap: balance` and generous leading for an authentic monograph voice.
  - *Body Prose & UI Controls*: **Plus Jakarta Sans** for crisp legibility across body copy (`65ch–72ch` optimal measure, `1.75` line-height) and clean unboxed metadata separators (`·`).
- **Interactive Feedback & Motion**:
  - All scroll reveals, envelope flap animations, and card transitions use compositor-friendly `transform` and `opacity` properties with a buttery `cubic-bezier(0.22, 1, 0.36, 1)` easing curve.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pre-Populating Real Uploaded Screenshots + Live Swap & Drive Import**
  - *Chosen Approach*: Embed all four uploaded images directly—the three July 28, 2026 Zoom screenshots in the Polaroid frames and Amirbek's portrait photo in the letter signature and spotlight card—while retaining an interactive "Swap Photo / Import from Google Drive" control on every frame and an "Add Memory Frame" slot.
  - *Why*: Professor Turner immediately sees authentic moments from her actual July 2026 Zoom classroom (including her own horse-farm virtual background and chat messages!), while Amirbek still has full flexibility to swap or add more screenshots from his computer or Google Drive.
- **Decision 2: Non-Intrusive Gemini AI Enhancements**
  - *Chosen Approach*: Keep Amirbek's personal letter 100% authentic and unaltered, placing Gemini intelligence in expandable "FME Session Insights" on the Polaroids and a dedicated interactive reflection studio in the Curations section.
  - *Why*: Preserves the heartfelt human voice of the gratitude letter while making the website feel alive and intellectually engaging.
- **Decision 3: Client-Side Google Drive OAuth with Explicit Confirmation**
  - *Chosen Approach*: Use Firebase Google Auth Popup with Google Drive scopes (`drive.file` and `drive.readonly`) and an explicit confirmation modal before saving the keepsake document to Drive.
  - *Why*: Works reliably in the preview environment without redirect mismatches and respects user control over their Google Drive storage.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Client Application (React 19 + Motion)                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Floating Frosted Navbar + Curved SVG Galloping Horse Scroll Indicator  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│         │                    │                        │                      │
│         ▼                    ▼                        ▼                      │
│  ┌─────────────┐   ┌──────────────────┐   ┌───────────────────────────────┐  │
│  │ Section A:  │   │ Section B:       │   │ Section C:                    │  │
│  │ Fernwood    │   │ Wax-Sealed       │   │ Summer Study Polaroid Gallery │  │
│  │ Editorial   │   │ Envelope, Letter │   │ • 3 Real Zoom Screenshots     │  │
│  │ Hero &      │   │ Scrollytelling & │   │ • Local Swap & Lightbox Zoom  │  │
│  │ Stardust    │   │ Amir's Portrait  │   │ • Google Drive Photo Import   │  │
│  │ Canvas      │   │ Spotlight Card   │   │ • Gemini Session Insights     │  │
│  └─────────────┘   └──────────────────┘   └───────────────────────────────┘  │
│                              │                        │                      │
│                              ▼                        ▼                      │
│                    ┌──────────────────┐   ┌───────────────────────────────┐  │
│                    │ Section D:       │   │ Section E:                    │  │
│                    │ 4 Equestrian &   │   │ Virtual Carrot/Coffee Burst & │  │
│                    │ Anime Flip Cards │   │ Google Drive Keepsake Exporter│  │
│                    │ + Gemini Studio  │   │ (with Confirmation Dialog)    │  │
│                    └─────────┬────────┘   └───────────────┬───────────────┘  │
└──────────────────────────────┼────────────────────────────┼──────────────────┘
                               │                            │
              POST /api/gemini │                            │ Bearer Token
                               ▼                            ▼
┌─────────────────────────────────────────┐  ┌─────────────────────────────────┐
│     Express Backend (server.ts)         │  │     Google Drive REST API v3    │
│  • @google/genai (gemini-3.8-flash)     │  │  • GET /drive/v3/files (Import) │
│  • /api/gemini/reflection               │  │  • POST /upload/drive/v3/files  │
│  • /api/gemini/memory-insight           │  │    (Save Gratitude Keepsake)    │
└─────────────────────────────────────────┘  └─────────────────────────────────┘
```

### Data Model & State
- **Letter State**: Tracks `isEnvelopeOpen` (triggered automatically via scroll intersection or manual click on the wax seal), `activeParagraphIndex` for staggered scroll-linked reveal, and `highlightedPhrases` toggle.
- **Polaroid Gallery State**: Array of `MemoryFrame` items (`id`, `caption`, `date`, `imageUrl`, `sessionContext`, `aiInsight`), pre-seeded with the 3 uploaded Babson Summer Study Zoom screenshots and persisted in `localStorage` when custom photos are swapped or imported from Google Drive.
- **Curation Cards State**: Tracks flipped/expanded state for the 4 anime cards (*Silver Spoon*, *Spice and Wolf*, *Fanfare of Adolescence*, *Sakura Quest*) plus interactive filter/lens mode (`All`, `Equestrian Spirit`, `Venture Strategy`, `Community Ecosystem`) and custom Gemini-generated reflections.
- **Google Drive Auth State**: In-memory OAuth `accessToken` managed via Firebase `GoogleAuthProvider`, tracking connected user profile, Drive image picker modal state, and keepsake export confirmation modal state.

### Interactive Component & State Mapping
- **Top Navigation & Horse Progress SVG**: Clicking any section link (`Our Summer`, `The Letter`, `Equestrian & Anime Curations`, `Memories`) smoothly scrolls to the target anchor while `useScroll` + `useSpring` drives `strokeDashoffset` and horse silhouette coordinates along the SVG path.
- **Wax-Sealed Envelope & Parchment Card**: Scroll progress or clicking the gold wax seal animates the top envelope flap in 3D (`rotateX`) and translates the `#F5EFE6` parchment card upward; each paragraph observes viewport entry to transition `opacity: 0 -> 1` and `translateY(24px -> 0)` while illuminating key phrases in warm gold.
- **Polaroid Gallery & Lightbox**: Hovering tilts each Polaroid frame smoothly; clicking "Inspect" opens a high-res modal viewer; clicking "Swap Photo" opens a file input; clicking "Import from Drive" authenticates with Google Drive and displays a visual grid of the user's Drive images to add or replace a frame.
- **Gemini Reflection Studio**: Submitting a prompt or clicking a preset pill calls `/api/gemini/reflection` on the Express server (`gemini-3.8-flash`), returning a structured synthesis connecting Babson's Entrepreneurial Thought & Action (ET&A) with equestrian horsemanship and anime storytelling.
- **Virtual Treat Particle Engine & Keepsake Export**: Clicking "Celebrate with a Virtual Treat 🐎☕" increments a treat counter, launches a multi-wave canvas/motion particle burst of golden stars, horseshoes, carrots, and coffee cups, and reveals the closing banner with a "Save Keepsake to Google Drive" button (guarded by an explicit confirmation modal before uploading the HTML/Markdown keepsake file to Google Drive).
