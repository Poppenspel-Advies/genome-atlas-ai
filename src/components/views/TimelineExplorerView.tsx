import { Clock } from 'lucide-react';

export function TimelineExplorerView() {
  const eras = [
    { name: 'Hadean', period: '4.6–4.0 bya', desc: 'Earth\'s formation, molten surface, no life yet', color: 'from-red-500/30', dot: 'bg-red-400' },
    { name: 'Archean', period: '4.0–2.5 bya', desc: 'First life emerges — single-celled prokaryotes', color: 'from-orange-500/30', dot: 'bg-orange-400' },
    { name: 'Proterozoic', period: '2.5 bya–541 mya', desc: 'Oxygen buildup, first eukaryotes and multicellular life', color: 'from-amber-500/30', dot: 'bg-amber-400' },
    { name: 'Cambrian', period: '541–485 mya', desc: 'Cambrian Explosion — rapid diversification of complex life', color: 'from-yellow-500/30', dot: 'bg-yellow-400' },
    { name: 'Paleozoic', period: '541–252 mya', desc: 'Fish, plants, amphibians, and the first land animals', color: 'from-emerald-500/30', dot: 'bg-emerald-400' },
    { name: 'Mesozoic', period: '252–66 mya', desc: 'Age of Dinosaurs — reptiles dominate, first mammals appear', color: 'from-teal-500/30', dot: 'bg-teal-400' },
    { name: 'Cenozoic', period: '66 mya–present', desc: 'Age of Mammals — primates evolve, humans emerge', color: 'from-violet-500/30', dot: 'bg-violet' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-dim border border-gold/20 mb-4">
          <Clock className="w-7 h-7 text-gold" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Timeline Explorer</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Journey through Earth\'s 4.6 billion year history — from its formation to the present day.</p>
      </div>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/30 via-violet/30 to-gold/30" />
        <div className="space-y-4">
          {eras.map((era, i) => (
            <div key={i} className="relative flex items-start gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-surface border border-border shrink-0">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${era.color} to-transparent flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${era.dot}`} />
                </div>
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-heading font-bold text-foreground">{era.name}</h3>
                  <span className="text-[10px] text-foreground-muted font-medium">{era.period}</span>
                </div>
                <p className="text-[11px] text-foreground-muted leading-relaxed">{era.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}