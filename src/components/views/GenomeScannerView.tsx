import { Scan, Dna } from 'lucide-react';

export function GenomeScannerView() {
  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-dim border border-pink/20 mb-4">
          <Scan className="w-7 h-7 text-pink" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Genome Scanner</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Deep genomic sequencing — map nucleotide patterns and identify genetic markers in any species.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Base Pairs Scanned', value: '2.3B', sub: 'Across 147 species', color: 'text-violet' },
          { label: 'Markers Identified', value: '8,421', sub: 'SNP & epigenetic', color: 'text-pink' },
          { label: 'Match Accuracy', value: '99.7%', sub: 'vs. reference genomes', color: 'text-gold' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border text-center">
            <p className={`text-2xl font-heading font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs font-medium text-foreground">{s.label}</p>
            <p className="text-[9px] text-foreground-muted/60">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-xl bg-gradient-to-br from-pink-dim to-violet-dim border border-pink/20 text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-pink/20 flex items-center justify-center mx-auto mb-3">
          <Dna className="w-6 h-6 text-pink" />
        </div>
        <h3 className="text-sm font-heading font-bold text-foreground mb-2">🧬 Full Genome Scanning</h3>
        <p className="text-xs text-foreground-muted max-w-md mx-auto mb-4">Upload a specimen and run a complete genomic analysis. Our AI maps over 3 billion base pairs and identifies key evolutionary markers within seconds.</p>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink to-violet text-white text-xs font-semibold hover:opacity-90 transition-all">Available on Scientist Plan</button>
      </div>
      <div className="p-4 rounded-xl bg-surface/40 border border-border">
        <h4 className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-3">Sample Genome Map</h4>
        <div className="space-y-1">
          {['ATGCGTACGATCGTAGCTAGCTAGCTGATCGTAGCT', 'TACGCATGCTAGCATCGATCGATCGATCGATCGATC', 'GCTAGCTAGCATGCATCGATCGATCGTAGCTAGCTA', 'ATCGATCGATCGATCGTAGCTAGCTAGCATGCTAGC', 'CGATCGATCGTAGCTAGCATGCTAGCATCGATCGT', 'TAGCTAGCATGCTAGCATCGATCGATCGATCGTAGC'].map((seq, i) => (
            <div key={i} className="font-mono text-[8px] tracking-wider" style={{ color: `hsl(${280 + i * 20}, 70%, ${70 - i * 5}%)` }}>
              {seq}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}