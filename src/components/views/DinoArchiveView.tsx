import { BookOpen, Dna, Clock, MapPin, Ruler, Weight, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DINOSAURS = [
  { name: 'Tyrannosaurus Rex', period: 'Late Cretaceous', diet: 'Carnivore', length: '12.3m', weight: '8,400 kg', location: 'North America', desc: 'One of the largest land carnivores ever, with a massive skull and powerful jaws.', color: 'from-red-500/20 to-orange-500/20', iconColor: 'text-red-400' },
  { name: 'Triceratops', period: 'Late Cretaceous', diet: 'Herbivore', length: '9m', weight: '12,000 kg', location: 'North America', desc: 'Distinctive three-horned face and large bony frill used for defense and display.', color: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400' },
  { name: 'Stegosaurus', period: 'Late Jurassic', diet: 'Herbivore', length: '9m', weight: '5,000 kg', location: 'North America', desc: 'Known for its double row of kite-shaped plates along its back and spiked tail.', color: 'from-amber-500/20 to-yellow-500/20', iconColor: 'text-amber-400' },
  { name: 'Velociraptor', period: 'Late Cretaceous', diet: 'Carnivore', length: '2m', weight: '15 kg', location: 'Asia', desc: 'Small but intelligent predator with a large curved claw on each foot.', color: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet' },
  { name: 'Brachiosaurus', period: 'Late Jurassic', diet: 'Herbivore', length: '25m', weight: '56,000 kg', location: 'North America', desc: 'One of the tallest dinosaurs, with a long neck reaching heights of 16 meters.', color: 'from-green-500/20 to-lime-500/20', iconColor: 'text-green-400' },
  { name: 'Pteranodon', period: 'Late Cretaceous', diet: 'Carnivore', length: '6m wingspan', weight: '25 kg', location: 'North America', desc: 'A large flying reptile with a distinctive crest on its head.', color: 'from-cyan-500/20 to-blue-500/20', iconColor: 'text-cyan-400' },
  { name: 'Parasaurolophus', period: 'Late Cretaceous', diet: 'Herbivore', length: '9.5m', weight: '2,500 kg', location: 'North America', desc: 'Famous for its long, backward-curving crest that may have been used for communication.', color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink' },
  { name: 'Ankylosaurus', period: 'Late Cretaceous', diet: 'Herbivore', length: '8m', weight: '6,000 kg', location: 'North America', desc: 'Armored dinosaur with a massive tail club used for defense against predators.', color: 'from-stone-500/20 to-zinc-500/20', iconColor: 'text-stone-400' },
  { name: 'Diplodocus', period: 'Late Jurassic', diet: 'Herbivore', length: '27m', weight: '12,000 kg', location: 'North America', desc: 'Extremely long-necked sauropod with a whip-like tail that may have cracked at supersonic speeds.', color: 'from-teal-500/20 to-emerald-500/20', iconColor: 'text-teal-400' },
  { name: 'Allosaurus', period: 'Late Jurassic', diet: 'Carnivore', length: '8.5m', weight: '2,000 kg', location: 'North America', desc: 'The apex predator of the Jurassic with powerful claws and serrated teeth.', color: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400' },
  { name: 'Iguanodon', period: 'Early Cretaceous', diet: 'Herbivore', length: '10m', weight: '3,500 kg', location: 'Europe', desc: 'One of the first dinosaurs ever discovered, with a distinctive thumb spike.', color: 'from-lime-500/20 to-green-500/20', iconColor: 'text-lime-400' },
  { name: 'Spinosaurus', period: 'Late Cretaceous', diet: 'Carnivore', length: '15m', weight: '7,000 kg', location: 'Africa', desc: 'The largest known carnivorous dinosaur, with a crocodile-like snout and sail-like spine.', color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-400' },
];

export function DinoArchiveView() {
  const [selected, setSelected] = useState<string | null>(null);
  const dino = DINOSAURS.find((d) => d.name === selected);

  return (
    <div className="max-w-5xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
          <BookOpen className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Dino Archive</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Explore 12 prehistoric species with detailed analysis data. Click any species for more information.</p>
      </div>

      {selected && dino ? (
        <div className="animate-fade-in">
          <button onClick={() => setSelected(null)} className="mb-4 px-3 py-1.5 rounded-lg border border-border text-[11px] text-foreground-muted hover:text-foreground transition-all">&larr; Back to Archive</button>
          <div className={`p-6 rounded-xl bg-gradient-to-br ${dino.color} border border-white/5`}>
            <h3 className="text-lg font-heading font-bold text-foreground mb-3">{dino.name}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Clock, label: 'Period', value: dino.period },
                { icon: MapPin, label: 'Location', value: dino.location },
                { icon: Ruler, label: 'Length', value: dino.length },
                { icon: Weight, label: 'Weight', value: dino.weight },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-black/30">
                  <s.icon className={`w-3.5 h-3.5 ${dino.iconColor}`} />
                  <div>
                    <p className="text-[9px] text-foreground-muted">{s.label}</p>
                    <p className="text-xs font-medium text-foreground">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">{dino.desc}</p>
            <div className={`mt-4 px-3 py-1 rounded-full inline-flex items-center gap-1.5 text-[10px] ${dino.iconColor} bg-black/30 border border-white/5`}>
              <Dna className="w-3 h-3" />
              <span>{dino.diet}</span>
            </div>
          </div>
          {/* Subscription prompt */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet/10 to-pink/10 border border-violet/20 text-center">
            <p className="text-xs text-foreground-muted mb-2">🎯 <strong className="text-foreground">Researcher tier</strong> unlocks full fossil scans and comparative analysis</p>
            <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-[10px] font-semibold hover:opacity-90 transition-all">Upgrade for $12/mo</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DINOSAURS.map((d) => (
            <button key={d.name} onClick={() => setSelected(d.name)} className={`p-4 rounded-xl bg-gradient-to-br ${d.color} border border-white/5 text-left hover:scale-[1.02] transition-all duration-200 group`}>
              <div className="flex items-center gap-2 mb-2">
                <Dna className={`w-4 h-4 ${d.iconColor}`} />
                <h3 className="text-xs font-bold text-foreground group-hover:text-foreground transition-colors">{d.name}</h3>
              </div>
              <p className="text-[9px] text-foreground-muted/80 leading-relaxed line-clamp-2">{d.desc}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-black/30 text-foreground-muted">{d.period}</span>
                <span className="text-[8px] text-foreground-muted">{d.diet}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-foreground-muted/30 ml-auto mt-1 group-hover:text-foreground-muted transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}