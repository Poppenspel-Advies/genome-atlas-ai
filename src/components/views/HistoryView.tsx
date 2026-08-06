import { History, Dna, Clock, BarChart3, FileText, Download, Trash2 } from 'lucide-react';
import { getAnalysisRecords, deleteAnalysisRecord, generateWeeklyReports } from '../../lib/analysisStore';
import { useState } from 'react';
import type { UserLevel } from '../../lib/userLevels';
import { getLevelGuidance } from '../../lib/userLevels';

interface HistoryViewProps {
  userLevel: UserLevel;
}

export function HistoryView({ userLevel }: HistoryViewProps) {
  const [records, setRecords] = useState(getAnalysisRecords());
  const reports = generateWeeklyReports();

  const handleDelete = (id: string) => {
    deleteAnalysisRecord(id);
    setRecords(getAnalysisRecords());
  };

  const handleExportReport = () => {
    const reportText = reports.map((r) =>
      `=== Weekly Report: ${r.weekStart} to ${r.weekEnd} ===\n` +
      `Species analyzed: ${r.species.join(', ')}\n` +
      `Total analyses: ${r.analysesCount}\n` +
      `Dominant pathway: ${r.topPath}\n` +
      `Summary: ${r.summary}\n` +
      `Predictions:\n${r.predictions.map((p) => `  - ${p}`).join('\n')}\n`
    ).join('\n');
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genomi-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const guidance = getLevelGuidance(userLevel, 'report');

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <History className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">History</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Your complete analysis history with weekly reports and data export.</p>
      </div>

      {/* Level guidance */}
      <div className="p-3 rounded-xl bg-violet-dim border border-violet/20 mb-6 text-[11px] text-foreground-muted leading-relaxed">
        {guidance}
      </div>

      {/* Report generation */}
      {reports.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gold" />
              Weekly Reports
            </h3>
            <button onClick={handleExportReport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[10px] text-foreground-muted hover:text-foreground hover:border-border-glow transition-all">
              <Download className="w-3 h-3" />
              Export All
            </button>
          </div>
          <div className="space-y-2">
            {reports.slice(0, 4).map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-surface/60 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                    <span className="text-xs font-medium text-foreground">{r.weekStart} — {r.weekEnd}</span>
                  </div>
                  <span className="text-[10px] text-foreground-muted">{r.analysesCount} analyses</span>
                </div>
                <p className="text-[10px] text-foreground-muted/70 mb-2">{r.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.species.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-[8px] text-foreground-muted">{s}</span>
                  ))}
                  <span className={`px-1.5 py-0.5 rounded text-[8px] border ${
                    r.topPath === 'quantum' ? 'bg-violet-dim border-violet/20 text-violet' :
                    r.topPath === 'natural-selection' ? 'bg-gold-dim border-gold/20 text-gold' :
                    'bg-surface-elevated border-border text-foreground-muted'
                  }`}>{r.topPath}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-foreground-muted" />
            All Analyses ({records.length})
          </h3>
        </div>
        {records.length === 0 ? (
          <div className="p-8 rounded-xl bg-surface/40 border border-border text-center">
            <Dna className="w-10 h-10 text-foreground-muted/30 mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">No analysis history yet. Analyze a specimen to get started!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {records.map((rec) => (
              <div key={rec.id} className="p-3 rounded-lg bg-surface/40 border border-border flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                    <Dna className="w-4 h-4 text-foreground-muted" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{rec.speciesName}</p>
                    <p className="text-[9px] text-foreground-muted">{new Date(rec.timestamp).toLocaleDateString()} · {new Date(rec.timestamp).toLocaleTimeString()} · {Math.round(rec.confidence * 100)}% confidence</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    rec.selectedPath === 'quantum' ? 'bg-violet-dim text-violet border border-violet/20' :
                    rec.selectedPath === 'natural-selection' ? 'bg-gold-dim text-gold border border-gold/20' :
                    'bg-surface-elevated text-foreground-muted border border-border'
                  }`}>{rec.selectedPath?.replace('-', ' ') ?? 'Pending'}</span>
                  <button onClick={() => handleDelete(rec.id)} className="p-1 rounded text-foreground-muted/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}