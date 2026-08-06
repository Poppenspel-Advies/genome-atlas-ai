import { Brain, Dna, Atom, BarChart3, Scan, Radio } from 'lucide-react';

export function AIToolsView() {
  const tools = [
    { icon: Brain, name: 'Specimen Analysis', desc: 'Core AI engine that identifies and analyzes biological specimens using Gemini 2.0 vision.', status: 'Active', color: 'text-violet', bg: 'bg-violet-dim' },
    { icon: Dna, name: 'Genome Scanner', desc: 'Deep genomic sequencing simulation that maps nucleotide patterns and identifies genetic markers.', status: 'Pro', color: 'text-pink', bg: 'bg-pink-dim' },
    { icon: Atom, name: 'Quantum Pathway Simulator', desc: 'Models radiation-induced mutations and quantum tunneling effects on evolutionary trajectories.', status: 'Pro', color: 'text-gold', bg: 'bg-gold-dim' },
    { icon: BarChart3, name: 'Comparative Analyzer', desc: 'Side-by-side species comparison with fitness landscape visualization.', status: 'Beta', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Scan, name: 'Evolution Predictor', desc: 'Monte Carlo simulation predicting phenotypic changes over 10,000+ generations.', status: 'Coming Soon', color: 'text-foreground-muted', bg: 'bg-surface-elevated' },
    { icon: Radio, name: 'Bioacoustic Analyzer', desc: 'Analyzes animal vocalizations to identify species and detect stress patterns.', status: 'Coming Soon', color: 'text-foreground-muted', bg: 'bg-surface-elevated' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-dim border border-pink/20 mb-4">
          <Brain className="w-7 h-7 text-pink" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">AI Tools</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Advanced AI-powered analysis tools for evolutionary biology research.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border hover:bg-surface-elevated transition-all group">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-foreground">{tool.name}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                    tool.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    tool.status === 'Pro' ? 'bg-gold-dim border-gold/20 text-gold' :
                    tool.status === 'Beta' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                    'bg-surface-elevated border-border text-foreground-muted'
                  }`}>{tool.status}</span>
                </div>
                <p className="text-[10px] text-foreground-muted/70 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gold-dim to-pink-dim border border-gold/20 text-center">
        <p className="text-xs text-foreground font-semibold mb-1">🚀 Unlock Pro Tools</p>
        <p className="text-[10px] text-foreground-muted mb-3">Genome Scanner, Quantum Pathway Simulator, and more with Researcher or Scientist plans.</p>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-amber-500 text-black text-xs font-semibold hover:opacity-90 transition-all">Upgrade Now</button>
      </div>
    </div>
  );
}