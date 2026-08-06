/** Sample biological specimen SVG illustrations and data */
import { DINOSAUR_SPECIMENS } from './DinosaurSpecimens';

export interface SampleSpecimen {
  id: string;
  name: string;
  subtitle: string;
  type: 'photo' | 'text';
  svg: React.ReactNode;
  description: string;
  era?: string;
}

/** DNA Helix SVG */
function DnaHelix() {
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="dna1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF2D95" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="dna2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      {/* Left strand */}
      <path d="M40 10 C20 30, 20 50, 40 70 C60 90, 60 110, 40 130 C20 150, 20 160, 40 160"
        stroke="url(#dna1)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="0" to="300" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Right strand */}
      <path d="M80 10 C100 30, 100 50, 80 70 C60 90, 60 110, 80 130 C100 150, 100 160, 80 160"
        stroke="url(#dna2)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Rungs */}
      <line x1="44" y1="20" x2="76" y2="20" stroke="#FF2D95" strokeWidth="1.5" opacity="0.4" />
      <line x1="28" y1="40" x2="92" y2="40" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.4" />
      <line x1="40" y1="60" x2="80" y2="60" stroke="#FFD700" strokeWidth="1.5" opacity="0.4" />
      <line x1="48" y1="80" x2="72" y2="80" stroke="#FF2D95" strokeWidth="1.5" opacity="0.4" />
      <line x1="40" y1="100" x2="80" y2="100" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.4" />
      <line x1="28" y1="120" x2="92" y2="120" stroke="#FFD700" strokeWidth="1.5" opacity="0.4" />
      <line x1="44" y1="140" x2="76" y2="140" stroke="#FF2D95" strokeWidth="1.5" opacity="0.4" />
      {/* Glow nodes */}
      <circle cx="40" cy="10" r="3" fill="#FF2D95" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="160" r="3" fill="#FFD700" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/** Cell / Microbe SVG */
function CellStructure() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="cell-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF2D95" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* Outer membrane */}
      <ellipse cx="60" cy="60" rx="48" ry="48" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" fill="url(#cell-core)">
        <animate attributeName="rx" values="48;50;48" dur="4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="48;50;48" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner membrane */}
      <ellipse cx="60" cy="60" rx="32" ry="32" stroke="#FF2D95" strokeWidth="1.5" opacity="0.3" />
      {/* Nucleus */}
      <circle cx="60" cy="60" r="12" fill="#FF2D95" opacity="0.15" stroke="#FF2D95" strokeWidth="1.5">
        <animate attributeName="r" values="12;13;12" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Surface proteins */}
      <circle cx="20" cy="35" r="4" fill="#FFD700" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="45" r="3" fill="#FFD700" opacity="0.3" />
      <circle cx="30" cy="90" r="3.5" fill="#8B5CF6" opacity="0.35" />
      <circle cx="90" cy="85" r="4" fill="#FF2D95" opacity="0.3" />
      <circle cx="45" cy="25" r="2.5" fill="#FFD700" opacity="0.25" />
      {/* Flagella */}
      <path d="M12 50 C5 45, 3 35, 8 30" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M10 55 C3 55, 0 65, 6 70" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" fill="none" />
      {/* Mitochondria-like organelle */}
      <ellipse cx="78" cy="38" rx="8" ry="5" stroke="#FFD700" strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
  );
}

/** Butterfly SVG */
function Butterfly() {
  return (
    <svg viewBox="0 0 140 120" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="wingL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FF2D95" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="wingR" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FF2D95" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Left wing */}
      <path d="M65 55 C45 20, 15 10, 10 35 C5 55, 25 70, 55 60"
        fill="url(#wingL)" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.8">
        <animate attributeName="d" values="M65 55 C45 20, 15 10, 10 35 C5 55, 25 70, 55 60;M65 55 C43 18, 12 8, 7 32 C2 52, 22 67, 55 58;M65 55 C45 20, 15 10, 10 35 C5 55, 25 70, 55 60" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Right wing */}
      <path d="M75 55 C95 20, 125 10, 130 35 C135 55, 115 70, 85 60"
        fill="url(#wingR)" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.8">
        <animate attributeName="d" values="M75 55 C95 20, 125 10, 130 35 C135 55, 115 70, 85 60;M75 55 C97 18, 128 8, 133 32 C138 52, 118 67, 85 58;M75 55 C95 20, 125 10, 130 35 C135 55, 115 70, 85 60" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Lower left wing */}
      <path d="M60 58 C40 80, 18 95, 22 105 C28 112, 48 90, 60 70"
        fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="1" />
      {/* Lower right wing */}
      <path d="M80 58 C100 80, 122 95, 118 105 C112 112, 92 90, 80 70"
        fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="1" />
      {/* Body */}
      <ellipse cx="70" cy="58" rx="3" ry="20" fill="#FFD700" opacity="0.5" />
      {/* Antennae */}
      <path d="M70 38 C68 25, 55 15, 50 12" stroke="#FFD700" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M70 38 C72 25, 85 15, 90 12" stroke="#FFD700" strokeWidth="1" opacity="0.5" fill="none" />
      {/* Wing spots */}
      <circle cx="35" cy="35" r="3" fill="#FFD700" opacity="0.4" />
      <circle cx="105" cy="35" r="3" fill="#FFD700" opacity="0.4" />
      <circle cx="42" cy="50" r="2" fill="#FF2D95" opacity="0.3" />
      <circle cx="98" cy="50" r="2" fill="#FF2D95" opacity="0.3" />
    </svg>
  );
}

/** Leaf / Plant SVG */
function LeafPlant() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF2D95" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M60 120 C55 100, 55 80, 58 60 C60 50, 62 40, 60 30"
        stroke="#8B5CF6" strokeWidth="2" opacity="0.5" fill="none" />
      {/* Main leaf */}
      <path d="M60 30 C25 25, 10 50, 30 65 C45 75, 55 60, 60 45"
        fill="url(#leafGrad)" stroke="#FFD700" strokeWidth="1" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Right leaf */}
      <path d="M60 45 C80 40, 100 55, 95 70 C90 80, 70 70, 60 55"
        fill="url(#leafGrad)" stroke="#FF2D95" strokeWidth="1" opacity="0.5" />
      {/* Veins */}
      <path d="M60 30 C45 40, 35 50, 30 60" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" fill="none" />
      <path d="M60 40 C50 45, 40 55, 35 62" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" fill="none" />
      <path d="M60 45 C70 50, 80 58, 90 65" stroke="#FF2D95" strokeWidth="0.8" opacity="0.3" fill="none" />
      {/* Small buds */}
      <circle cx="25" cy="30" r="4" fill="#FF2D95" opacity="0.25">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="35" r="3" fill="#FFD700" opacity="0.2" />
    </svg>
  );
}

/** Prehistoric creature / dinosaur silhouette */
function Prehistoric() {
  return (
    <svg viewBox="0 0 140 100" className="w-full h-full" fill="none">
      <path d="M20 80 L30 40 L40 30 L50 30 L55 35 L60 30 L70 35 L75 50 L85 55 L95 55 L100 60 L95 70 L90 80 L85 70 L75 70 L70 80 L50 80 L45 70 L35 70 L30 80Z"
        fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="1.2">
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Eye */}
      <circle cx="45" cy="42" r="2.5" fill="#FF2D95" opacity="0.4" />
      {/* Spikes */}
      <line x1="55" y1="35" x2="58" y2="25" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.3" />
      <line x1="62" y1="32" x2="66" y2="22" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.3" />
      <line x1="70" y1="38" x2="74" y2="28" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.3" />
      {/* Tail */}
      <path d="M90 50 C100 45, 110 35, 120 30 C125 28, 130 30, 128 35"
        stroke="#FFD700" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* Ground */}
      <line x1="10" y1="82" x2="130" y2="82" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 3" />
    </svg>
  );
}

export const SAMPLE_SPECIMENS: SampleSpecimen[] = [
  {
    id: 'dna-helix',
    name: 'DNA Double Helix',
    subtitle: 'Homo sapiens — Base pair sequencing',
    type: 'photo',
    svg: <DnaHelix />,
    description: 'Analyze a human DNA sequence to explore genetic mutations and evolutionary divergence across deep time.',
  },
  {
    id: 'cell-microbe',
    name: 'Eukaryotic Cell',
    subtitle: 'Eukaryota — Cellular morphology',
    type: 'photo',
    svg: <CellStructure />,
    description: 'Upload a eukaryotic cell sample to trace organelle evolution and adaptive radiation pathways.',
  },
  {
    id: 'butterfly',
    name: 'Morpho Butterfly',
    subtitle: 'Lepidoptera — Wing pigmentation',
    type: 'photo',
    svg: <Butterfly />,
    description: 'Study wing pattern evolution and mimicry adaptations in response to environmental pressures.',
  },
  {
    id: 'leaf',
    name: 'Fern Leaf',
    subtitle: 'Polypodiopsida — Vascular plant',
    type: 'photo',
    svg: <LeafPlant />,
    description: 'Explore how ancient plant lineages adapted from aquatic to terrestrial environments.',
  },
  {
    id: 'trilobite',
    name: 'Trilobite Fossil',
    subtitle: 'Trilobita — Cambrian period',
    type: 'text',
    svg: <Prehistoric />,
    description: 'Describe a trilobite fossil from the Cambrian era and simulate its evolutionary descendants.',
  },
  // ── Dinosaurs & Prehistoric specimens ──
  ...DINOSAUR_SPECIMENS.map((d) => ({
    id: d.id,
    name: d.name,
    subtitle: d.subtitle,
    type: 'text' as const,
    svg: d.svg,
    description: d.description,
    era: d.era,
  })),
];

/** Get a random sample specimen */
export function getRandomSample(): SampleSpecimen {
  return SAMPLE_SPECIMENS[Math.floor(Math.random() * SAMPLE_SPECIMENS.length)];
}

/** Get specimen icon by id */
export function getSpecimenById(id: string): SampleSpecimen | undefined {
  return SAMPLE_SPECIMENS.find((s) => s.id === id);
}