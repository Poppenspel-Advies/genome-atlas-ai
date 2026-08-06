import { LayoutDashboard, Dna, BarChart3, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { getAnalysisRecords } from '../../lib/analysisStore';

interface WorkspaceViewProps {
  onStartAnalysis: () => void;
}

export function WorkspaceView({ onStartAnalysis }: WorkspaceViewProps) {
  const recent = getAnalysisRecords().slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <LayoutDashboard className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Your Workspace</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">
          Your command center for evolutionary analysis — recent activity, saved projects, and research tools.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Dna, label: 'Total Analyses', value: getAnalysisRecords().length.toString(), color: 'text-pink', bg: 'bg-pink-dim' },
          { icon: BarChart3, label: 'Species Discovered', value: [...new Set(getAnalysisRecords().map((r) => r.speciesName))].length.toString(), color: 'text-violet', bg: 'bg-violet-dim' },
          { icon: Clock, label: 'This Week', value: getAnalysisRecords().filter((r) => {
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            return r.timestamp > weekAgo;
          }).length.toString(), color: 'text-gold', bg: 'bg-gold-dim' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] text-foreground-muted uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className={`text-xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick start */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-violet-dim to-pink-dim border border-violet/20 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-violet" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-heading font-bold text-foreground mb-1">Ready to explore?</h3>
            <p className="text-[11px] text-foreground-muted mb-3">Upload a biological specimen and the AI will generate two alternate evolutionary futures showing quantum and natural selection pathways.</p>
            <button onClick={onStartAnalysis} className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-xs font-semibold hover:opacity-90 transition-all active:scale-[0.97] flex items-center gap-1.5">
              Start New Analysis <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-xs font-heading font-bold text-foreground mb-3 uppercase tracking-wider">Recent Activity</h3>
        {recent.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface/40 border border-border text-center">
            <Dna className="w-8 h-8 text-foreground-muted/30 mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">No analyses yet. Start your first exploration above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((rec) => (
              <div key={rec.id} className="p-3 rounded-lg bg-surface/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                    <Dna className="w-4 h-4 text-foreground-muted" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{rec.speciesName}</p>
                    <p className="text-[9px] text-foreground-muted">{new Date(rec.timestamp).toLocaleDateString()} · {Math.round(rec.confidence * 100)}% confidence</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${rec.selectedPath === 'quantum' ? 'bg-violet-dim text-violet border border-violet/20' : rec.selectedPath === 'natural-selection' ? 'bg-gold-dim text-gold border border-gold/20' : 'bg-surface-elevated text-foreground-muted border border-border'}`}>
                  {rec.selectedPath?.replace('-', ' ') ?? 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}