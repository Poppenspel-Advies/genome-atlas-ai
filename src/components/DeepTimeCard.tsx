import { useState } from 'react';
import { Clock, Layers, ChevronDown, ChevronRight, Globe, Sparkles, Dna } from 'lucide-react';

interface DeepTimeEra {
  name: string;
  range: string;
  mya: [number, number]; // start, end millions of years ago
  color: string;
  events: string[];
  speciesAdaptation: string;
  icon: 'volcano' | 'ice' | 'forest' | 'desert' | 'ocean';
}

const DEEP_TIME_LAYERS: DeepTimeEra[] = [
  {
    name: 'Present Day',
    range: '0 — 10,000 YA',
    mya: [0, 0.01],
    color: 'from-emerald-500/30 to-green-500/20',
    events: ['Anthropocene epoch begins', 'Human-driven extinction pressure', 'Climate change acceleration'],
    speciesAdaptation: 'Urban adaptation, behavioral flexibility, range shifts to higher latitudes',
    icon: 'forest',
  },
  {
    name: 'Pleistocene Ice Ages',
    range: '10,000 — 2.5 MYA',
    mya: [0.01, 2.5],
    color: 'from-cyan-500/30 to-blue-500/20',
    events: ['Repeated glaciation cycles', 'Mega-fauna extinction', 'Milankovitch orbital forcing'],
    speciesAdaptation: 'Thicker fur/feathers, larger body mass (Bergmann rule), fat storage adaptations',
    icon: 'ice',
  },
  {
    name: 'Pliocene Warm Period',
    range: '2.5 — 5.3 MYA',
    mya: [2.5, 5.3],
    color: 'from-amber-500/30 to-yellow-500/20',
    events: ['Formation of Isthmus of Panama', 'Mediterranean drying (Messinian salinity crisis)', 'Grassland expansion'],
    speciesAdaptation: 'Cursorial limb adaptations, hypsodont (high-crowned) teeth for grazing',
    icon: 'desert',
  },
  {
    name: 'Miocene Optimum',
    range: '5.3 — 23 MYA',
    mya: [5.3, 23],
    color: 'from-lime-500/30 to-emerald-500/20',
    events: ['Collision of India with Asia', 'Himalayan orogeny', 'C4 grass expansion', 'Highest mammal diversity'],
    speciesAdaptation: 'Enhanced herbivory adaptations, social herd behavior, increased brain-to-body ratio',
    icon: 'forest',
  },
  {
    name: 'Oligocene Transition',
    range: '23 — 34 MYA',
    mya: [23, 34],
    color: 'from-orange-500/30 to-amber-500/20',
    events: ['Antarctic ice sheet formation', 'Global cooling event', 'Eocene-Oligocene extinction'],
    speciesAdaptation: 'Endothermy refinement, digestive efficiency improvements, seasonal migration patterns',
    icon: 'ice',
  },
  {
    name: 'Eocene Climax',
    range: '34 — 56 MYA',
    mya: [34, 56],
    color: 'from-teal-500/30 to-cyan-500/20',
    events: ['PETM (Paleocene-Eocene Thermal Maximum)', 'First modern mammals appear', 'Tropical forests at poles'],
    speciesAdaptation: 'Small body size (Lilliput effect), rapid dental evolution, arboreal adaptations',
    icon: 'forest',
  },
  {
    name: 'Paleocene Recovery',
    range: '56 — 66 MYA',
    mya: [56, 66],
    color: 'from-violet-500/30 to-purple-500/20',
    events: ['K-Pg extinction aftermath', 'Mammalian radiation begins', 'Ecological vacuum fills'],
    speciesAdaptation: 'Generalist omnivory, nocturnal adaptations, rapid size increase across lineages',
    icon: 'volcano',
  },
  {
    name: 'Cretaceous',
    range: '66 — 145 MYA',
    mya: [66, 145],
    color: 'from-red-500/30 to-rose-500/20',
    events: ['K-Pg extinction event', 'Flowering plants dominate', 'Tyrannosaurs & Triceratops'],
    speciesAdaptation: 'Primitive mammalian nocodonty, insectivory, burrowing behavior as survival strategy',
    icon: 'volcano',
  },
  {
    name: 'Jurassic',
    range: '145 — 201 MYA',
    mya: [145, 201],
    color: 'from-stone-500/30 to-zinc-500/20',
    events: ['Supercontinent Pangea breaks up', 'First birds appear', 'Sauropod dominance'],
    speciesAdaptation: 'Basal mammalian nocturnal lifestyle, expanded auditory range, lactation evolution',
    icon: 'ocean',
  },
  {
    name: 'Triassic',
    range: '201 — 252 MYA',
    mya: [201, 252],
    color: 'from-amber-500/30 to-orange-500/20',
    events: ['End-Permian extinction recovery', 'First dinosaurs appear', 'Pangea supercontinent'],
    speciesAdaptation: 'Cynodont-to-mammal transition, warm-blooded metabolism origins, whisker/sensor evolution',
    icon: 'desert',
  },
];

function getEraIcon(icon: DeepTimeEra['icon']) {
  switch (icon) {
    case 'volcano': return <Sparkles className="w-3 h-3" />;
    case 'ice': return <Clock className="w-3 h-3" />;
    case 'forest': return <Dna className="w-3 h-3" />;
    case 'desert': return <Globe className="w-3 h-3" />;
    case 'ocean': return <Layers className="w-3 h-3" />;
  }
}

export function DeepTimeCard({ speciesName = 'this species' }: { speciesName?: string }) {
  const [expandedEra, setExpandedEra] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-gradient-to-b from-stone-900/80 to-black/80 border border-amber-500/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-heading font-bold text-foreground">Deep Time Analysis</h3>
            <p className="text-[10px] text-foreground-muted/70">Geological timescale adaptation mapping</p>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Intro */}
          <div className="mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <p className="text-[10px] text-foreground-muted leading-relaxed">
              This pyramid maps how <strong className="text-amber-300">{speciesName}</strong> would have evolved across <strong className="text-amber-300">252 million years</strong> of geological time — from the Triassic to the present day. Each layer represents a geological era with its unique selection pressures.
            </p>
          </div>

          {/* Pyramid Visualization */}
          <div className="relative mb-4">
            {/* Timeline axis */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

            {DEEP_TIME_LAYERS.map((era, i) => {
              const isExpanded = expandedEra === i;
              const pyramidWidth = 100 - (i * 5); // narrower at bottom
              const marginLeft = (100 - pyramidWidth) / 2;

              return (
                <div key={era.name} className="relative mb-1.5 last:mb-0">
                  <button
                    onClick={() => setExpandedEra(isExpanded ? null : i)}
                    className="w-full relative group"
                  >
                    <div
                      className="relative rounded-lg p-3 border border-white/5 transition-all duration-200 hover:border-white/10"
                      style={{
                        marginLeft: `${marginLeft}%`,
                        width: `${pyramidWidth}%`,
                        background: `linear-gradient(135deg, rgba(var(--color-amber), ${0.12 - i * 0.008}), transparent)`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br ${era.color} text-foreground-muted`}>
                            {getEraIcon(era.icon)}
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-foreground tracking-wide">{era.name}</span>
                            <span className="ml-2 text-[8px] text-foreground-muted/60">{era.range}</span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-3 h-3 text-foreground-muted/40 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div
                      className="mt-1 rounded-lg bg-black/40 border border-white/5 p-3 animate-fade-in"
                      style={{ marginLeft: `${marginLeft + 5}%`, width: `${pyramidWidth - 10}%` }}
                    >
                      {/* Key events */}
                      <div className="mb-2">
                        <p className="text-[8px] text-foreground-muted/60 uppercase tracking-wider mb-1.5">Key Events</p>
                        <div className="flex flex-wrap gap-1">
                          {era.events.map((evt, j) => (
                            <span key={j} className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 text-amber-300/80 border border-amber-500/10">
                              {evt}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Adaptation */}
                      <div>
                        <p className="text-[8px] text-foreground-muted/60 uppercase tracking-wider mb-1">Species Adaptation</p>
                        <p className="text-[9px] text-foreground-muted leading-relaxed">{era.speciesAdaptation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Time Span', value: '252 MYA', sub: 'Triassic to Present' },
              { label: 'Eras Covered', value: '10', sub: 'Geological periods' },
              { label: 'Adaptations', value: '30+', sub: 'Evolutionary traits' },
            ].map((stat, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] text-foreground-muted/60">{stat.label}</p>
                <p className="text-xs font-bold text-amber-300 mt-0.5">{stat.value}</p>
                <p className="text-[7px] text-foreground-muted/40">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}