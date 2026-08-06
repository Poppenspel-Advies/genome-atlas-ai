
/** Tyrannosaurus Rex SVG */
function TyrannosaurusRex() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="trex-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF2D95" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Ambient particles */}
      {[1,2,3,4,5,6].map(i => (
        <circle key={i} cx={5+Math.random()*90} cy={5+Math.random()*90} r={1+Math.random()*2}
          fill={['#FF2D95','#8B5CF6','#FFD700'][i%3]} opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur={`${2+Math.random()*3}s`}
            begin={`${Math.random()*5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Tail */}
      <path d="M140 75 C155 65,155 45,145 35 C135 25,125 30,120 45 C115 55,112 65,110 70"
        stroke="#8B5CF6" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M148 40 L155 35 M150 50 L158 48 M145 58 L153 58"
        stroke="#FF2D95" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Body */}
      <path d="M110 70 C105 45,85 30,65 30 C50 30,35 35,25 45 C15 55,12 68,15 75 C18 82,30 78,40 72 C50 66,65 62,80 62 C95 62,105 65,110 70Z"
        fill="url(#trex-body)" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.85" />
      <path d="M35 55 C28 58,22 56,18 54" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <path d="M35 58 C28 61,22 59,18 57" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {/* Head */}
      <path d="M25 18 C20 15,10 12,5 15 C0 18,2 25,8 28 C12 30,18 28,22 25 C26 22,28 20,25 18Z"
        fill="#8B5CF6" opacity="0.5" stroke="#FF2D95" strokeWidth="1" />
      <path d="M7 20 L9 23 L11 20 M13 21 L15 24 L17 21" stroke="#FFF" strokeWidth="1" opacity="0.3" />
      <circle cx="18" cy="16" r="2.5" stroke="#FFD700" strokeWidth="1" fill="#FFD700" opacity="0.6">
        <animate attributeName="r" values="2;2.8;2" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Legs */}
      <path d="M55 65 C52 75,48 85,42 95 L38 100 M42 95 L48 100" stroke="#8B5CF6" strokeWidth="3" opacity="0.6" fill="none" strokeLinecap="round" />
      <path d="M75 62 C73 72,70 84,65 95 L62 100 M65 95 L70 100" stroke="#8B5CF6" strokeWidth="3" opacity="0.6" fill="none" strokeLinecap="round" />
      {/* Claws */}
      <path d="M38 100 L34 103 M38 100 L40 104 M62 100 L58 103 M62 100 L64 104" stroke="#FFD700" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <ellipse cx="70" cy="102" rx="50" ry="3" fill="#8B5CF6" opacity="0.15" />
      {/* Roar */}
      <path d="M2 12 C0 8,3 4,8 6" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" fill="none">
        <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/** Triceratops SVG */
function Triceratops() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="tri-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {[1,2,3,4].map(i => (
        <circle key={i} cx={10+Math.random()*80} cy={10+Math.random()*80} r={1+Math.random()*2}
          fill="#00E5FF" opacity="0">
          <animate attributeName="opacity" values="0;0.3;0" dur={`${2+Math.random()*3}s`}
            begin={`${Math.random()*4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Frill */}
      <path d="M20 28 C10 15,30 5,55 8 C75 10,85 18,80 28 C78 32,70 35,60 32 C50 30,35 30,20 28Z"
        fill="#8B5CF6" opacity="0.25" stroke="#00E5FF" strokeWidth="1.5" />
      {[22,30,42,56,68].map((x,i) => (
        <circle key={i} cx={x} cy={[20,12,8,9,14][i]} r="3" stroke="#00E5FF" strokeWidth="0.8" fill="none" opacity="0.4" />
      ))}
      {/* Body */}
      <path d="M70 35 C80 35,100 40,115 50 C130 60,135 72,130 80 C125 85,110 82,95 78 C80 74,70 70,65 68 C60 65,55 55,60 45 C62 38,65 35,70 35Z"
        fill="url(#tri-body)" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.8" />
      {/* Horns */}
      <path d="M35 25 C30 15,15 5,8 10" stroke="#FFD700" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      <path d="M45 22 C48 12,55 2,58 5" stroke="#FFD700" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      <path d="M28 30 C18 28,10 30,5 35" stroke="#FFD700" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <circle cx="40" cy="24" r="2" fill="#FFD700" opacity="0.7">
        <animate attributeName="r" values="2;2.5;2" dur="4s" repeatCount="indefinite" />
      </circle>
      <path d="M80 75 C78 85,75 92,72 98 L68 102" stroke="#8B5CF6" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M105 78 C104 88,100 94,96 100 L92 104" stroke="#8B5CF6" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="104" rx="55" ry="3" fill="#00E5FF" opacity="0.12" />
    </svg>
  );
}

/** Stegosaurus SVG */
function Stegosaurus() {
  return (
    <svg viewBox="0 0 170 110" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="stego-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFA500" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FF2D95" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path d="M30 55 C25 40,35 30,55 28 C75 26,95 28,115 32 C135 36,145 44,140 55 C135 65,120 68,100 70 C80 72,55 72,40 70 C30 68,32 60,30 55Z"
        fill="url(#stego-body)" stroke="#FFA500" strokeWidth="1.5" opacity="0.8" />
      {/* Plates */}
      {[
        {d:"M50 28 L48 12 L55 5 L62 12 L60 28Z",c:"#FF2D95",del:"0s",dur:"2s"},
        {d:"M70 26 L68 8 L75 0 L82 8 L80 26Z",c:"#FFA500",del:"0.3s",dur:"2.5s"},
        {d:"M90 28 L88 10 L95 3 L102 10 L100 28Z",c:"#8B5CF6",del:"0.6s",dur:"2.8s"},
      ].map((p,i) => (
        <path key={i} d={p.d} fill={p.c} opacity="0.35" stroke="#FFD700" strokeWidth="0.8">
          <animate attributeName="opacity" values="0.25;0.55;0.25" dur={p.dur} begin={p.del} repeatCount="indefinite" />
        </path>
      ))}
      <circle cx="18" cy="38" r="1.8" fill="#FFD700" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M140 55 C152 58,160 60,165 58" stroke="#FFA500" strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M165 58 L170 52 M165 58 L170 64" stroke="#FFD700" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d="M55 70 C52 80,50 88,48 92" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.5" fill="none" />
      <path d="M105 70 C104 80,102 88,100 92" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.5" fill="none" />
      <ellipse cx="90" cy="94" rx="60" ry="3" fill="#FFA500" opacity="0.1" />
    </svg>
  );
}

/** Pterodactyl SVG */
function Pterodactyl() {
  return (
    <svg viewBox="0 0 180 100" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="ptera-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M85 35 C70 25,50 15,30 10 C15 8,5 12,0 15 C5 18,15 20,30 18 C50 15,70 22,82 32"
        fill="url(#ptera-wing)" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7">
        <animate attributeName="d" values="M85 35 C70 25,50 15,30 10 C15 8,5 12,0 15 C5 18,15 20,30 18 C50 15,70 22,82 32;M85 35 C72 28,55 22,35 18 C20 16,10 18,5 20 C10 22,20 24,35 22 C55 20,72 28,82 34;M85 35 C70 25,50 15,30 10 C15 8,5 12,0 15 C5 18,15 20,30 18 C50 15,70 22,82 32" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M85 35 C100 25,120 15,140 10 C155 8,165 12,170 15 C165 18,155 20,140 18 C120 15,100 22,88 32"
        fill="url(#ptera-wing)" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7">
        <animate attributeName="d" values="M85 35 C100 25,120 15,140 10 C155 8,165 12,170 15 C165 18,155 20,140 18 C120 15,100 22,88 32;M85 35 C98 28,115 22,135 18 C150 16,160 18,165 20 C160 22,150 24,135 22 C115 20,98 28,88 34;M85 35 C100 25,120 15,140 10 C155 8,165 12,170 15 C165 18,155 20,140 18 C120 15,100 22,88 32" dur="1.2s" repeatCount="indefinite" />
      </path>
      <ellipse cx="85" cy="38" rx="8" ry="14" fill="#8B5CF6" opacity="0.5" stroke="#00E5FF" strokeWidth="1" />
      <ellipse cx="85" cy="22" rx="6" ry="7" fill="#8B5CF6" opacity="0.6" stroke="#00E5FF" strokeWidth="0.8" />
      <path d="M80 20 C75 15,72 10,75 6 C78 4,82 8,85 15" stroke="#FFD700" strokeWidth="1.2" opacity="0.5" fill="none" />
      <circle cx="86" cy="20" r="1.5" fill="#FF2D95" opacity="0.7">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/** Velociraptor SVG */
function Velociraptor() {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="raptor-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF2D95" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M120 42 C135 40,145 38,155 35 C158 34,160 33,158 36 C155 40,145 42,135 44"
        stroke="#FF2D95" strokeWidth="2" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M115 42 C110 35,95 28,80 26 C65 24,50 28,40 35 C30 42,28 50,32 55 C36 60,50 58,65 54 C80 50,95 46,110 44 C115 43,118 43,115 42Z"
        fill="url(#raptor-body)" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.85" />
      <path d="M42 42 C35 40,28 38,22 36" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <path d="M22 36 L18 34 M22 36 L20 32" stroke="#FFD700" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M18 15 C14 12,8 10,4 12 C0 14,2 18,6 20 C10 22,14 20,18 18Z"
        fill="#8B5CF6" opacity="0.6" stroke="#FF2D95" strokeWidth="1" />
      <path d="M5 16 L6 18 L8 16 M9 17 L10 19 L12 17" stroke="#FFF" strokeWidth="0.8" opacity="0.25" />
      <ellipse cx="12" cy="14" rx="1.8" ry="1.5" fill="#FFD700" opacity="0.8">
        <animate attributeName="rx" values="1.5;2;1.5" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <path d="M55 55 C50 65,48 70,45 75" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M45 75 L42 80 M45 75 L47 80" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M75 50 C73 60,70 68,68 74 L65 78" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.5" fill="none" />
      <ellipse cx="75" cy="80" rx="35" ry="3" fill="#8B5CF6" opacity="0.12" />
    </svg>
  );
}

/** Mammoth SVG */
function Mammoth() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="mam-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M130 55 C135 42,125 30,105 28 C85 26,65 28,50 35 C35 42,30 52,32 62 C34 72,45 78,60 80 C80 82,100 80,115 75 C125 70,130 62,130 55Z"
        fill="url(#mam-body)" stroke="#00E5FF" strokeWidth="1.5" opacity="0.8" />
      <path d="M35 50 C25 55,15 65,10 75 C8 80,10 85,15 82" stroke="#FFD700" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" fill="none" />
      <path d="M38 48 C30 52,22 60,18 68 C16 72,18 76,22 74" stroke="#FFD700" strokeWidth="2" opacity="0.4" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="38" r="2" fill="#FF2D95" opacity="0.6">
        <animate attributeName="r" values="2;2.3;2" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M70 28 C75 18,90 16,100 20 C105 22,108 26,105 28" stroke="#00E5FF" strokeWidth="1.2" opacity="0.3" fill="none" />
      <ellipse cx="80" cy="104" rx="60" ry="3" fill="#00E5FF" opacity="0.1" />
    </svg>
  );
}

/** Mosasaurus — Marine reptile */
function Mosasaurus() {
  return (
    <svg viewBox="0 0 180 80" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="mosa-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 40 C30 30,50 25,70 28 C90 32,110 38,130 40 C145 42,155 44,160 45 C165 46,168 48,170 48"
        stroke="#00E5FF" strokeWidth="2.5" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M20 40 C15 38,10 35,8 32 C5 28,5 25,8 22 C12 18,18 20,22 25 C25 30,25 35,20 40Z"
        fill="url(#mosa-body)" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7" />
      <circle cx="14" cy="28" r="1.5" fill="#FF2D95" opacity="0.7">
        <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M8 24 L4 22 M8 26 L3 25" stroke="#FFF" strokeWidth="0.8" opacity="0.3" />
      {/* Flippers */}
      <path d="M40 42 C35 50,28 55,25 52" stroke="#00E5FF" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M60 46 C58 54,52 58,48 56" stroke="#00E5FF" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      {/* Tail fin */}
      <path d="M170 48 L175 42 M170 48 L175 54" stroke="#00E5FF" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Water ripples */}
      <path d="M30 52 C50 50,70 52,90 50" stroke="#00E5FF" strokeWidth="0.5" opacity="0.15" fill="none">
        <animate attributeName="d" values="M30 52 C50 50,70 52,90 50;M30 54 C50 52,70 54,90 52;M30 52 C50 50,70 52,90 50" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M80 56 C100 54,120 56,140 54" stroke="#00E5FF" strokeWidth="0.5" opacity="0.15" fill="none">
        <animate attributeName="d" values="M80 56 C100 54,120 56,140 54;M80 58 C100 56,120 58,140 56;M80 56 C100 54,120 56,140 54" dur="4s" begin="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export interface PrehistoricSpecimen {
  id: string;
  name: string;
  subtitle: string;
  era: string;
  svg: React.ReactNode;
  description: string;
}

export const DINOSAUR_SPECIMENS: PrehistoricSpecimen[] = [
  {
    id: 'trex',
    name: 'Tyrannosaurus Rex',
    subtitle: 'Tyrannosauridae — Late Cretaceous',
    era: '68-66 MYA',
    svg: <TyrannosaurusRex />,
    description: 'Analyze the apex predator of the Cretaceous. Explore its bone-crushing bite force, tiny arms evolution, and dominance across Laramidia.',
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    subtitle: 'Ceratopsidae — Late Cretaceous',
    era: '68-66 MYA',
    svg: <Triceratops />,
    description: 'Study the three-horned herbivore of the Hell Creek Formation. Simulate its frill display evolution and defense adaptations against T-Rex.',
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    subtitle: 'Stegosauridae — Late Jurassic',
    era: '155-150 MYA',
    svg: <Stegosaurus />,
    description: 'Explore the plated dinosaur of the Morrison Formation. Investigate thermal regulation in its iconic back plates and thagomizer tail defense.',
  },
  {
    id: 'pterodactyl',
    name: 'Pterodactyl',
    subtitle: 'Pterosauria — Late Jurassic',
    era: '150-148 MYA',
    svg: <Pterodactyl />,
    description: 'Analyze the flying reptile that ruled Jurassic skies. Simulate wing adaptation, crested display evolution, and piscivorous hunting strategies.',
  },
  {
    id: 'velociraptor',
    name: 'Velociraptor',
    subtitle: 'Dromaeosauridae — Late Cretaceous',
    era: '75-71 MYA',
    svg: <Velociraptor />,
    description: 'Study the swift, feathered predator of the Gobi Desert. Explore pack hunting behavior, sickle claw evolution, and proto-feather development.',
  },
  {
    id: 'mammoth',
    name: 'Woolly Mammoth',
    subtitle: 'Elephantidae — Pleistocene',
    era: '0.4-0.01 MYA',
    svg: <Mammoth />,
    description: 'Explore the ice age giant. Simulate cold-climate adaptations, tusk evolution, and the ongoing de-extinction research using ancient DNA.',
  },
  {
    id: 'mosasaurus',
    name: 'Mosasaurus',
    subtitle: 'Mosasauridae — Late Cretaceous',
    era: '70-66 MYA',
    svg: <Mosasaurus />,
    description: 'Dive into the apex marine predator of the Western Interior Seaway. Analyze its transition from land to sea and powerful jaw evolution.',
  },
];