import { Library } from 'lucide-react';

export function FossilLibraryView() {
  const fossils = [
    { name: 'Trilobite', era: 'Paleozoic (521 mya)', desc: 'One of the earliest known arthropods, with a hard exoskeleton and segmented body.', region: 'Global', type: 'Marine' },
    { name: 'Ammonite', era: 'Mesozoic (240 mya)', desc: 'Extinct cephalopod molluscs with spiral shells, related to today\'s nautilus.', region: 'Global oceans', type: 'Marine' },
    { name: 'Megafauna Sloth', era: 'Cenozoic (2 mya)', desc: 'Giant ground sloths that roamed South America, reaching sizes of up to 4 tons.', region: 'South America', type: 'Terrestrial' },
    { name: 'Dunkleosteus', era: 'Devonian (380 mya)', desc: 'A placoderm fish with armored head and jaw plates instead of teeth.', region: 'North America', type: 'Marine' },
    { name: 'Archaeopteryx', era: 'Jurassic (150 mya)', desc: 'Transitional fossil between dinosaurs and birds, with feathers and reptilian features.', region: 'Europe', type: 'Transitional' },
    { name: 'Megalodon', era: 'Cenozoic (23 mya)', desc: 'Giant prehistoric shark reaching lengths of up to 18 meters.', region: 'Global oceans', type: 'Marine' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <Library className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Fossil Library</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Preserved remains of ancient life — explore key fossils from the fossil record.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fossils.map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border hover:bg-surface-elevated transition-all group">
            <h3 className="text-xs font-bold text-foreground mb-1">{f.name}</h3>
            <p className="text-[9px] text-foreground-muted/60 mb-2">{f.era}</p>
            <p className="text-[10px] text-foreground-muted/70 leading-relaxed line-clamp-3">{f.desc}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-foreground-muted">{f.type}</span>
              <span className="text-[8px] text-foreground-muted/60">{f.region}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}