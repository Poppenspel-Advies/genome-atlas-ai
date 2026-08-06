import { FolderKanban, Dna, Clock, FileText, Plus, ChevronRight } from 'lucide-react';
import { getAnalysisRecords } from '../../lib/analysisStore';
import type { UserLevel } from '../../lib/userLevels';

interface ProjectsViewProps {
  userLevel: UserLevel;
  onStartAnalysis: () => void;
}

export function ProjectsView({ userLevel, onStartAnalysis }: ProjectsViewProps) {
  const records = getAnalysisRecords();

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <FolderKanban className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">My Projects</h2>
        <p className="text-xs text-foreground-muted max-w-md mx-auto">Save and organize your evolutionary analyses into projects.</p>
      </div>

      {/* Subscription prompt for non-scientist */}
      {userLevel !== 'scientist' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-gold-dim to-violet-dim border border-gold/20 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-dim border border-gold/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Organize with Projects</p>
              <p className="text-[10px] text-foreground-muted">Upgrade to Researcher to create named project folders</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold to-amber-500 text-black text-[10px] font-semibold">Upgrade</button>
        </div>
      )}

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Default project: All Analyses */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-dim flex items-center justify-center">
              <Dna className="w-4 h-4 text-violet" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-foreground">All Analyses</h3>
              <p className="text-[9px] text-foreground-muted">{records.length} analyses</p>
            </div>
          </div>
          <p className="text-[10px] text-foreground-muted/60 mb-3">Your complete analysis history across all sessions.</p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-foreground-muted">Last updated: {records.length > 0 ? new Date(records[0].timestamp).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>

        {/* Sample project cards */}
        {[
          { name: 'Cretaceous Predators', iconColor: 'text-amber-400', bg: 'bg-amber-500/10', count: 3, desc: 'Comparative analysis of theropod dinosaurs' },
          { name: 'Marine Evolution', iconColor: 'text-cyan-400', bg: 'bg-cyan-500/10', count: 2, desc: 'Deep sea adaptation pathways' },
        ].map((proj, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface/60 border border-border group cursor-pointer hover:bg-surface-elevated transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${proj.bg} flex items-center justify-center`}>
                <Dna className={`w-4 h-4 ${proj.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">{proj.name}</h3>
                <p className="text-[9px] text-foreground-muted">{proj.count} analyses</p>
              </div>
            </div>
            <p className="text-[10px] text-foreground-muted/60">{proj.desc}</p>
            <div className="mt-2 flex items-center gap-1 text-[9px] text-violet group-hover:gap-2 transition-all">
              <span>Open project</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}

        {/* New project card */}
        <button onClick={onStartAnalysis} className="p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-violet/30 text-center transition-all group">
          <Plus className="w-6 h-6 text-foreground-muted/30 mx-auto mb-2 group-hover:text-violet transition-colors" />
          <p className="text-xs font-medium text-foreground-muted group-hover:text-foreground transition-colors">New Analysis</p>
          <p className="text-[9px] text-foreground-muted/40">Start exploring a new species</p>
        </button>
      </div>

      {/* Recent projects note */}
      <div className="p-4 rounded-xl bg-surface/40 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3.5 h-3.5 text-foreground-muted" />
          <span className="text-[10px] text-foreground-muted font-semibold uppercase tracking-wider">Did you know?</span>
        </div>
        <p className="text-[10px] text-foreground-muted/70 leading-relaxed">
          Projects sync across devices when you sign in. Researcher and Scientist tiers get unlimited project storage with full export capabilities.
        </p>
      </div>
    </div>
  );
}