import { Activity } from 'lucide-react';
import { Dna } from 'lucide-react';

export function MutationMapView() {
  const mutations = [
    { gene: 'BRCA1', effect: 'Increased cancer risk', rate: '1 in 500', type: 'Missense', chromo: '17q21' },
    { gene: 'FOXP2', effect: 'Language development', rate: '1 in 10M', type: 'Regulatory', chromo: '7q31' },
    { gene: 'MC1R', effect: 'Red hair phenotype', rate: '1 in 100', type: 'Nonsynonymous', chromo: '16q24' },
    { gene: 'HBB', effect: 'Sickle cell trait', rate: '1 in 300', type: 'Missense', chromo: '11p15' },
    { gene: 'LCT', effect: 'Lactose tolerance', rate: '1 in 3', type: 'Regulatory', chromo: '2q21' },
    { gene: 'EDAR', effect: 'Hair thickness', rate: '1 in 10', type: 'Missense', chromo: '2q13' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-dim border border-gold/20 mb-4">
          <Activity className="w-7 h-7 text-gold" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Mutation Map</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Explore known mutations — their genetic origins, phenotypic effects, and evolutionary significance.</p>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-3 text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Gene</th>
              <th className="py-2 px-3 text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Effect</th>
              <th className="py-2 px-3 text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Type</th>
              <th className="py-2 px-3 text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Frequency</th>
              <th className="py-2 px-3 text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody>
            {mutations.map((m, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors">
                <td className="py-2.5 px-3 font-mono text-xs font-bold text-pink">{m.gene}</td>
                <td className="py-2.5 px-3 text-foreground-muted">{m.effect}</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-[9px]">{m.type}</span></td>
                <td className="py-2.5 px-3 text-foreground-muted">{m.rate}</td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-foreground-muted/60">{m.chromo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-r from-gold-dim to-amber-500/10 border border-gold/20">
        <div className="flex items-start gap-3">
          <Dna className="w-5 h-5 text-gold mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1">🔬 Interactive Mutation Map</h3>
            <p className="text-[10px] text-foreground-muted leading-relaxed">The full interactive mutation map with phylogenetic tracing, allele frequency tracking, and CRISPR simulation is available on the Scientist plan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}