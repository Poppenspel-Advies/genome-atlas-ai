import { Infinity, Dna, Clock, BarChart3, Calendar, Download, Sparkles } from 'lucide-react';
import { getAnalysisMapData, generateWeeklyReports } from '../../lib/analysisStore';
import type { UserLevel } from '../../lib/userLevels';
import { getLevelGuidance } from '../../lib/userLevels';

interface TimeMachineViewProps {
  userLevel: UserLevel;
}

export function TimeMachineView({ userLevel }: TimeMachineViewProps) {
  const data = getAnalysisMapData();
  const reports = generateWeeklyReports();
  const guidance = getLevelGuidance(userLevel, 'time-machine');

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <Infinity className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Time Machine</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Your evolutionary analysis projected across time — weekly trends, reports, and future predictions.</p>
      </div>

      {/* Level guidance */}
      <div className="p-3 rounded-xl bg-violet-dim border border-violet/20 mb-6 text-[11px] text-foreground-muted leading-relaxed">
        {guidance}
      </div>

      {/* Analysis Map — Weekly Trend */}
      <div className="mb-8">
        <h3 className="text-xs font-heading font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-gold" />
          Analysis Map — Weekly Trend
        </h3>
        {data.weeklyTrend.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface/40 border border-border text-center">
            <Dna className="w-8 h-8 text-foreground-muted/30 mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">No analysis data yet. Start analyzing species to see your trend map.</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-end gap-1.5 h-24">
              {data.weeklyTrend.map((w, i) => {
                const maxCount = Math.max(...data.weeklyTrend.map((x) => x.count), 1);
                const height = (w.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] text-foreground-muted">{w.count}</span>
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-violet to-pink transition-all duration-500 hover:opacity-80"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      title={`${w.week}: ${w.count} analyses`}
                    />
                    <span className="text-[6px] text-foreground-muted/40 rotate-45 origin-left whitespace-nowrap">
                      {w.week.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Weekly Reports Timeline */}
      <div className="mb-8">
        <h3 className="text-xs font-heading font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-pink" />
          Time Projections
        </h3>
        {reports.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface/40 border border-border text-center">
            <Clock className="w-8 h-8 text-foreground-muted/30 mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">Your first weekly report will be generated after 7 days of analysis activity.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-pink/40 via-violet/40 to-gold/40" />
            <div className="space-y-4">
              {reports.slice(0, 8).map((r, i) => {
                const weekNum = reports.length - i;
                return (
                  <div key={r.id} className="relative flex items-start gap-4">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-pink-dim to-violet-dim border border-violet/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-violet">W{weekNum}</span>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-surface/60 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-foreground">{r.weekStart} — {r.weekEnd}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-foreground-muted">{r.analysesCount} analyses</span>
                          <button className="p-1 rounded text-foreground-muted/30 hover:text-foreground transition-colors" title="Export this report">
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-foreground-muted/70 leading-relaxed mb-2">{r.summary}</p>
                      {r.predictions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[9px] font-semibold text-gold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Predictions
                          </p>
                          {r.predictions.map((p, j) => (
                            <p key={j} className="text-[9px] text-foreground-muted/60 pl-3 border-l border-gold/30">{p}</p>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.species.map((s, j) => (
                          <span key={j} className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-[7px] text-foreground-muted">{s}</span>
                        ))}
                        <span className={`px-1.5 py-0.5 rounded text-[7px] border ${
                          r.topPath === 'quantum' ? 'bg-violet-dim border-violet/20 text-violet' :
                          r.topPath === 'natural-selection' ? 'bg-gold-dim border-gold/20 text-gold' :
                          'bg-surface-elevated border-border text-foreground-muted'
                        }`}>{r.topPath}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Future projections */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-dim to-pink-dim border border-violet/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-1">🔮 Next Week's Projection</h4>
            <p className="text-[10px] text-foreground-muted leading-relaxed">
              {reports.length > 0
                ? `Based on your analysis of ${reports[0].species.join(', ')}, we predict continued interest in ${reports[0].topPath === 'quantum' ? 'quantum-influenced' : 'natural selection'} pathways. Try analyzing a contrasting species to broaden your evolutionary dataset.`
                : 'Start analyzing specimens this week and the Time Machine will project your evolutionary interests for next week.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}