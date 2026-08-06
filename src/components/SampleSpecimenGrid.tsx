import { useState } from 'react';
import { SAMPLE_SPECIMENS, type SampleSpecimen } from './SampleSpecimens';
import { Sparkles, Dna, Bone, RotateCcw, Eye } from 'lucide-react';

interface SampleSpecimenGridProps {
  onSelectSample: (specimen: SampleSpecimen) => void;
}

type CategoryTab = 'modern' | 'prehistoric' | 'all';

export function SampleSpecimenGrid({ onSelectSample }: SampleSpecimenGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const filtered = (() => {
    const prehistoricIds = new Set(['trex','triceratops','stegosaurus','pterodactyl','velociraptor','mammoth','mosasaurus']);
    if (activeTab === 'prehistoric') return SAMPLE_SPECIMENS.filter(s => prehistoricIds.has(s.id));
    if (activeTab === 'modern') return SAMPLE_SPECIMENS.filter(s => !prehistoricIds.has(s.id));
    return SAMPLE_SPECIMENS;
  })();

  const tabs: { id: CategoryTab; label: string; icon: typeof Dna; count: number }[] = [
    { id: 'all', label: 'All', icon: Sparkles, count: SAMPLE_SPECIMENS.length },
    { id: 'modern', label: 'Modern', icon: Dna, count: SAMPLE_SPECIMENS.filter(s => !['trex','triceratops','stegosaurus','pterodactyl','velociraptor','mammoth','mosasaurus'].includes(s.id)).length },
    { id: 'prehistoric', label: 'Prehistoric', icon: Bone, count: SAMPLE_SPECIMENS.filter(s => ['trex','triceratops','stegosaurus','pterodactyl','velociraptor','mammoth','mosasaurus'].includes(s.id)).length },
  ];

  return (
    <div className="w-full mt-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <Sparkles className="w-3 h-3 text-foreground-muted/30" />
        <span className="text-[9px] text-foreground-muted/30 uppercase tracking-[0.15em] font-semibold">
          Sample Specimens
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-3 px-0.5">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveIndex(null); }}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet/20 to-pink/10 border border-violet/20 text-foreground shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]'
                  : 'text-foreground-muted/50 hover:text-foreground-muted hover:bg-surface-elevated/50 border border-transparent'
              }`}
            >
              <TabIcon className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
              <span>{tab.label}</span>
              <span className={`px-1 rounded text-[8px] ${
                isActive ? 'bg-violet/20 text-violet' : 'text-foreground-muted/30'
              }`}>
                {tab.count}
              </span>
              {isActive && (
                <div className="absolute -bottom-px left-2 right-2 h-px bg-gradient-to-r from-pink/40 via-violet/40 to-gold/40" />
              )}
            </button>
          );
        })}

        {/* Reset view */}
        <button
          onClick={() => setActiveIndex(null)}
          className="ml-auto p-1.5 rounded-lg text-foreground-muted/30 hover:text-foreground-muted hover:bg-surface-elevated/50 transition-all duration-200"
          title="Reset selection"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
        {filtered.map((specimen, i) => {
          const isActive = activeIndex === i;
          const globalIdx = SAMPLE_SPECIMENS.findIndex(s => s.id === specimen.id);
          const isDino = ['trex','triceratops','stegosaurus','pterodactyl','velociraptor','mammoth','mosasaurus'].includes(specimen.id);
          return (
            <button
              key={specimen.id}
              onClick={() => {
                setActiveIndex(i);
                setTimeout(() => onSelectSample(specimen), 400);
              }}
              className={`group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-300 cursor-pointer
                active:scale-[0.94]
                ${isActive
                  ? 'bg-gradient-to-b from-violet/15 to-pink/5 border border-violet/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                  : isDino
                    ? 'bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10'
                    : 'bg-surface-elevated/30 border border-white/5 hover:bg-surface-elevated hover:border-accent/30'
                }`}
              style={{
                animationDelay: `${globalIdx * 60}ms`,
                animation: 'fade-in 0.5s ease-out forwards',
                opacity: 0,
              }}
              aria-label={`Try ${specimen.name}`}
            >
              {/* Animated glow ring on hover */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                isDino ? 'bg-gradient-to-b from-amber-500/5 to-transparent' : 'bg-gradient-to-b from-accent/5 to-transparent'
              }`} />

              {/* Era badge for dinosaurs */}
              {isDino && specimen.era && (
                <div className="absolute -top-1 -right-1 z-10 px-1 py-[1px] rounded-full bg-amber-500/15 border border-amber-500/20">
                  <span className="text-[6px] text-amber-400/70 font-semibold whitespace-nowrap">{specimen.era}</span>
                </div>
              )}

              {/* Illustration */}
              <div className={`relative w-11 h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'scale-110' : ''
              }`}>
                {specimen.svg}
                {/* Pulsing ring on active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-violet/30 animate-ping-slow" />
                )}
                {/* Hover ring */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isDino
                    ? 'border border-amber-500/0 group-hover:border-amber-500/30 group-hover:scale-110'
                    : 'border border-accent/0 group-hover:border-accent/20 group-hover:scale-110'
                }`} />
              </div>

              {/* Label */}
              <span className={`text-[8px] font-medium text-center leading-tight transition-colors duration-200 line-clamp-2 ${
                isActive
                  ? 'text-foreground'
                  : isDino
                    ? 'text-amber-400/60 group-hover:text-amber-400/80'
                    : 'text-foreground-muted/60 group-hover:text-foreground-muted'
              }`}>
                {specimen.name}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gradient-to-br from-violet to-pink flex items-center justify-center shadow-lg">
                  <Eye className="w-2 h-2 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-6">
          <Bone className="w-6 h-6 text-foreground-muted/20 mx-auto mb-2" />
          <p className="text-[11px] text-foreground-muted/40">No specimens in this category</p>
        </div>
      )}

      {/* Info tooltip */}
      <p className="text-[8px] text-foreground-muted/20 text-center mt-2 tracking-wider">
        Click a specimen to analyze or upload your own above
      </p>
    </div>
  );
}