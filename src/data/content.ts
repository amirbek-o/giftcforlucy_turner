export interface LetterParagraph {
  id: string;
  segments: {
    text: string;
    highlight?: boolean;
  }[];
}

export interface MemoryFrame {
  id: string;
  frameNumber: string;
  caption: string;
  subCaption: string;
  dateLabel: string;
  imageUrl: string;
  tiltDeg: number;
  sessionContext: string;
  aiInsight: string;
}

export interface AnimeCuration {
  id: string;
  index: string;
  title: string;
  japaneseTitle: string;
  creator?: string;
  tags: string[];
  category: 'equestrian' | 'venture' | 'community';
  pitch: string;
  lensHighlight: string;
  fmeConnection: string;
  equestrianNote: string;
}

export const AMIR_PORTRAIT_URL = '/assets/aistudio/image_55603814.png';

export const LETTER_SALUTATION = 'Dear Professor Turner,';

export const LETTER_PARAGRAPHS: LetterParagraph[] = [
  {
    id: 'p1',
    segments: [
      {
        text: 'When I first joined Babson Summer Study in July 2026, I arrived eager to learn how startups scale. Through your classes and our conversations since, you taught me something far more enduring: ',
      },
      {
        text: "that true entrepreneurial leadership isn't about pushing your own ideas forward—it is about listening deeply, elevating different perspectives, and building ecosystems where everyone around you can thrive.",
        highlight: true,
      },
    ],
  },
  {
    id: 'p2',
    segments: [
      {
        text: 'Whether I am working with ',
      },
      {
        text: 'young founders across the Syrdarya region, recording conversations for our Startup Podcast in Uzbekistan,',
        highlight: true,
      },
      {
        text: ' or researching emerging venture ecosystems, the lessons from your classroom are at the core of everything I build.',
      },
    ],
  },
  {
    id: 'p3',
    segments: [
      {
        text: 'Thank you for ',
      },
      {
        text: 'taking the time out of your busy FME schedule to write on my behalf, for staying in touch across time zones,',
        highlight: true,
      },
      {
        text: ' and for inspiring me to create opportunities that reach far beyond myself.',
      },
    ],
  },
];

export const LETTER_SIGNOFF = {
  closing: 'With deepest gratitude,',
  name: 'Amirbek (Amir) Orifjonov',
  location: 'Gulistan, Uzbekistan',
};

export const INITIAL_MEMORIES: MemoryFrame[] = [
  {
    id: 'frame-1',
    frameNumber: 'Frame 01',
    caption: 'July 2026 — Babson Summer Study Cohort & Team Continuum Sessions',
    subCaption:
      'Live pitch session for "Learn 2 Earn" with Professor Turner joining from her iconic equestrian farm backdrop.',
    dateLabel: 'July 28, 2026 · Wellesley & Uzbekistan',
    imageUrl: '/assets/aistudio/Screenshot_2026-07-28_180335_c354e4d9.png',
    tiltDeg: -1.8,
    sessionContext:
      'Zoom presentation of Learn 2 Earn (Valentina, Noah, Alex, Ece & Samantha) with Amirbek Orifjonov and Professor Lucy Turner visible in the top gallery.',
    aiInsight:
      'Seeing your white-fenced horse farm backdrop in our Zoom gallery while we unpacked education ventures reminded me that great mentors bring their whole authentic selves to the classroom.',
  },
  {
    id: 'frame-2',
    frameNumber: 'Frame 02',
    caption: 'Practicing Entrepreneurial Leadership Across Time Zones',
    subCaption:
      'Debating unit economics, startup budgets, and gym partnership value exchanges during live Q&A.',
    dateLabel: 'July 28, 2026 · 07:16 PM Session',
    imageUrl: '/assets/aistudio/Screenshot_2026-07-28_192258_13aa3923.png',
    tiltDeg: 1.5,
    sessionContext:
      'Startup Budget & Resources breakdown ($13,200 total startup costs) while Professor Lucy Turner moderates questions and Amirbek asks about revenue-share vs. lead generation in the chat.',
    aiInsight:
      'You encouraged us to ask sharp, constructive questions about real value exchange—pushing every founder in the room to think rigorously about sustainable partnerships.',
  },
  {
    id: 'frame-3',
    frameNumber: 'Frame 03',
    caption: 'Taking Babson Lessons Back to Builders in Uzbekistan',
    subCaption:
      'From the Wheel of Names pitch roulette (FashionPath, StreakUp, Healthy Food Rewards, Reflexerator) to community ecosystems in Syrdarya.',
    dateLabel: 'July 28, 2026 · Cohort Showcase',
    imageUrl: '/assets/aistudio/Screenshot_2026-07-28_185900_4d9ba7b5.png',
    tiltDeg: -1.2,
    sessionContext:
      'Professor Lucy Turner sharing her screen with the Wheel of Names selecting among cohort venture teams while students thank each other in the chat.',
    aiInsight:
      'The supportive energy in that final showcase—where every team cheered each other on—became the blueprint for how I now bring young founders together in Gulistan.',
  },
];

export const ANIME_CURATIONS: AnimeCuration[] = [
  {
    id: 'silver-spoon',
    index: '01',
    title: 'Silver Spoon',
    japaneseTitle: 'Gin no Saji',
    creator: 'By Hiromu Arakawa',
    tags: ['Equestrian Club', 'Agri-Entrepreneurship', 'Mentorship'],
    category: 'equestrian',
    pitch:
      'A burned-out city student enrolls in an agricultural high school in Hokkaido, joins the Equestrian Club, bonds with horses, and launches a student food-venture from scratch. The ultimate blend of horse care, personal growth, and hands-on entrepreneurship.',
    lensHighlight:
      'Hachiken learns that horses immediately sense hesitation—and that launching a brick-oven pizza venture requires the exact same humility, resourcefulness, and respect for the ecosystem.',
    fmeConnection:
      'Mirrors Babson FME: starting with what you have (Bird-in-Hand principle), rallying classmates with diverse skills, and testing prototypes with real local customers.',
    equestrianNote:
      'Features deeply authentic horsemanship—from mucking stalls at 5:00 AM to gentle cadence training with retired draft and riding horses.',
  },
  {
    id: 'spice-and-wolf',
    index: '02',
    title: 'Spice and Wolf',
    japaneseTitle: 'Ookami to Koushinryou',
    creator: 'By Isuna Hasekura',
    tags: ['Microeconomics', 'Trade Strategy', 'Partnership'],
    category: 'venture',
    pitch:
      'A traveling merchant and a sharp-witted harvest deity travel by horse-drawn cart across medieval market towns, navigating currency arbitrage, supply chains, and trust—essentially an FME case study disguised as a cozy fantasy.',
    lensHighlight:
      'Every town presents a live negotiation puzzle where information asymmetry, credit, and long-term reputation matter far more than quick wins.',
    fmeConnection:
      'Reads like an interactive Babson case discussion on stakeholder alignment, ethical negotiation, and co-founder chemistry under uncertainty.',
    equestrianNote:
      'Set entirely to the unhurried rhythm of a horse-drawn merchant wagon winding through golden wheat fields and cobblestone trade routes.',
  },
  {
    id: 'fanfare-of-adolescence',
    index: '03',
    title: 'Fanfare of Adolescence',
    japaneseTitle: 'Gunjou no Fanfare',
    creator: 'By Lay-duce Original',
    tags: ['Equestrian Academy', 'Team Dynamics', 'Resilience'],
    category: 'equestrian',
    pitch:
      'Set at a prestigious horse-racing academy, following young riders from completely different backgrounds learning that leadership in the saddle requires empathy, trust, and listening to your partner.',
    lensHighlight:
      'Shows that you cannot command a thoroughbred through ego or force; true speed and grace emerge only when rider and horse breathe in sync.',
    fmeConnection:
      'Captures the heart of your Summer Study leadership lessons: bringing together peers from vastly different worlds and learning to listen before leading.',
    equestrianNote:
      'Breathtaking animation of morning mist over training tracks, coastal riding therapy, and the quiet unspoken bond between rider and mount.',
  },
  {
    id: 'sakura-quest',
    index: '04',
    title: 'Sakura Quest',
    japaneseTitle: 'Sakura Quest',
    creator: 'By P.A.Works',
    tags: ['Social Entrepreneurship', 'Ecosystem Building', 'Community Revival'],
    category: 'community',
    pitch:
      "Five young women team up to revitalize a struggling rural town's local economy—a heartwarming story about social entrepreneurship, listening to stakeholders, and strengthening communities.",
    lensHighlight:
      'Instead of imposing flashy top-down stunts, the protagonists succeed only when they sit down with local artisans, farmers, and elders to co-create lasting value.',
    fmeConnection:
      'Directly echoes the work I am doing in the Syrdarya region of Uzbekistan—building grassroots entrepreneurial communities where local builders feel seen and empowered.',
    equestrianNote:
      'Infused with warm pastoral countryside charm, heritage crafts, and the patient cadence of rural stewardship.',
  },
];
