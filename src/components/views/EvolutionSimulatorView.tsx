import { Radio } from 'lucide-react';

export function EvolutionSimulatorView() {
  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-dim border border-pink/20 mb-4">
          <Radio className="w-7 h-7 text-pink" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Evolve Simulator</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Run evolutionary simulations across thousands of generations with adjustable parameters.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { param: 'Population Size', value: '10,000', range: '100 – 1M' },
          { param: 'Mutation Rate', value: '2.5e-8', range: '1e-10 – 1e-5' },
          { param: 'Generations', value: '1,000', range: '10 – 10M' },
          { param: 'Selection Pressure', value: '0.15', range: '0 – 1.0' },
        ].map((p, i) => (
          <div key={i} className="p-3 rounded-xl bg-surface/60 border border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-foreground-muted">{p.param}</span>
              <span className="text-xs font-bold text-foreground">{p.value}</span>
            </div>
            <p className="text-[8px] text-foreground-muted/50">Range: {p.range}</p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-pink to-violet" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-xl bg-gradient-to-br from-pink-dim to-violet-dim border border-pink/20 text-center">
        <h3 className="text-sm font-heading font-bold text-foreground mb-2">🧪 Run Your Own Simulation</h3>
        <p className="text-xs text-foreground-muted max-w-sm mx-auto mb-4">The full Evolution Simulator with adjustable parameters, fitness landscapes, and real-time visualization is available on the Scientist plan.</p>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink to-violet text-white text-xs font-semibold hover:opacity-90 transition-all">Available on Scientist Plan</button>
      </div>
    </div>
  );
}