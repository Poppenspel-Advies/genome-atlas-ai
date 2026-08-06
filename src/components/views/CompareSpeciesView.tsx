import { GitBranch, Dna } from 'lucide-react';

export function CompareSpeciesView() {
  const comparisons = [
    { species1: 'Human (H. sapiens)', species2: 'Chimpanzee (P. troglodytes)', similarity: '98.8%', diff: '~35M SNPs', intrigue: 'FOXP2 gene drives language capability' },
    { species1: 'Mouse (M. musculus)', species2: 'Human (H. sapiens)', similarity: '85%', diff: '~2,500 genes', intrigue: 'Shared mammalian immune response pathways' },
    { species1: 'Fruit Fly (D. melanogaster)', species2: 'Human (H. sapiens)', similarity: '60%', diff: '~7,000 genes', intrigue: 'Conserved developmental Hox gene clusters' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <GitBranch className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Compare Species</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Side-by-side genomic and phenotypic comparison across species.</p>
      </div>
      <div className="space-y-3 mb-6">
        {comparisons.map((c, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-dim flex items-center justify-center">
                  <Dna className="w-4 h-4 text-violet" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{c.species1}</p>
                  <p className="text-[9px] text-foreground-muted">vs {c.species2}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-heading font-bold text-gold">{c.similarity}</p>
                <p className="text-[9px] text-foreground-muted">Genome similarity</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground-muted/70">
              <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border">{c.diff}</span>
              <span>·</span>
              <span>{c.intrigue}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-dim to-pink-dim border border-violet/20 text-center">
        <p className="text-xs text-foreground-muted mb-2">🔬 Run your own comparisons with the <strong className="text-foreground">Researcher</strong> plan</p>
        <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-[10px] font-semibold">Upgrade to Researcher — $12/mo</button>
      </div>
    </div>
  );
}