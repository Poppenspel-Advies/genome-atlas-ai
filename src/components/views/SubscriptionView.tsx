import { CreditCard, Zap, Infinity, Check } from 'lucide-react';
import type { UserLevel } from '../../lib/userLevels';
import { LEVELS } from '../../lib/userLevels';

interface SubscriptionViewProps {
  currentLevel: UserLevel;
  onUpgrade: (level: 'researcher' | 'scientist') => void;
}

export function SubscriptionView({ currentLevel, onUpgrade }: SubscriptionViewProps) {
  const levels = [LEVELS.beginner, LEVELS.researcher, LEVELS.scientist];

  return (
    <div className="max-w-5xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-dim border border-gold/20 mb-4">
          <CreditCard className="w-7 h-7 text-gold" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Subscription Plans</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Choose the plan that matches your evolutionary biology research needs.</p>
      </div>

      {/* Current plan badge */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-dim border border-violet/20 text-[10px] text-violet">
          <Zap className="w-3 h-3" />
          Current plan: <strong>{LEVELS[currentLevel].label}</strong>
        </span>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {levels.map((level, i) => {
          const isCurrent = level.id === currentLevel;
          const isUpgrade = !isCurrent && (level.id === 'researcher' || level.id === 'scientist');
          return (
            <div key={i} className={`relative p-5 rounded-xl border transition-all duration-200 ${
              isCurrent
                ? 'bg-gradient-to-b from-violet-dim to-surface border-violet/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                : level.id === 'researcher'
                ? 'bg-surface/80 border-gold/30 hover:border-gold/60'
                : 'bg-surface/60 border-border hover:border-white/20'
            }`}>
              {/* Popular badge */}
              {level.id === 'researcher' && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-gold to-amber-500 text-[9px] font-semibold text-black">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-2xl mb-2">{level.icon}</div>
                <h3 className="text-sm font-heading font-bold text-foreground mb-1">{level.label}</h3>
                <p className="text-[10px] text-foreground-muted/70 min-h-[2.5em]">{level.description}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-2xl font-heading font-bold text-foreground">{level.price === 'Free' ? level.price : level.price.split('/')[0]}</span>
                {level.price !== 'Free' && <span className="text-xs text-foreground-muted">/mo</span>}
              </div>

              <ul className="space-y-2 mb-5">
                {level.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-[10px] text-foreground-muted/80">
                    <Check className={`w-3 h-3 mt-0.5 shrink-0 ${isCurrent ? 'text-violet' : 'text-gold'}`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2 rounded-lg bg-surface-elevated border border-border text-[10px] text-foreground-muted text-center">
                  Current Plan
                </div>
              ) : isUpgrade ? (
                <button
                  onClick={() => onUpgrade(level.id as 'researcher' | 'scientist')}
                  className={`w-full py-2 rounded-lg text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] ${
                    level.id === 'researcher'
                      ? 'bg-gradient-to-r from-gold to-amber-500 text-black hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                      : 'bg-gradient-to-r from-violet to-pink text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  }`}
                >
                  Upgrade to {level.label.split(' ')[0]}
                </button>
              ) : (
                <button className="w-full py-2 rounded-lg border border-border text-[10px] text-foreground-muted cursor-not-allowed">
                  Downgrade (contact support)
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature comparison */}
      <div className="p-5 rounded-xl bg-surface/60 border border-border mb-6">
        <h3 className="text-xs font-heading font-bold text-foreground mb-4 uppercase tracking-wider">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-foreground-muted font-medium">Feature</th>
                <th className="py-2 px-4 text-foreground-muted font-medium">Beginner</th>
                <th className="py-2 px-4 text-foreground-muted font-medium">Researcher</th>
                <th className="py-2 px-4 text-foreground-muted font-medium">Scientist</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feat: 'Monthly Analyses', b: '5', r: '50', s: 'Unlimited' },
                { feat: 'Guided Explanations', b: '✅', r: '✅', s: '✅' },
                { feat: 'Scientific Detail', b: 'Basic', r: 'Advanced', s: 'Full' },
                { feat: 'Genome Scanner', b: '—', r: 'Basic', s: 'Advanced' },
                { feat: 'Species Comparison', b: '—', r: '✅', s: '✅' },
                { feat: 'Evolution Simulator', b: '—', r: 'Limited', s: 'Full' },
                { feat: 'Data Export', b: '—', r: 'CSV', s: 'JSON + API' },
                { feat: 'Priority AI Chat', b: '—', r: '✅', s: '24/7 Priority' },
                { feat: 'Weekly Reports', b: '—', r: '✅', s: 'Custom' },
                { feat: 'Custom Parameters', b: '—', r: '—', s: '✅' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-foreground font-medium">{row.feat}</td>
                  <td className="py-2 px-4 text-foreground-muted">{row.b}</td>
                  <td className="py-2 px-4 text-foreground-muted">{row.r}</td>
                  <td className="py-2 px-4 text-foreground-muted">{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise note */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-gold-dim to-pink-dim border border-gold/20 flex items-start gap-3">
        <Infinity className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-1">🏢 Enterprise &amp; Education</h4>
          <p className="text-[10px] text-foreground-muted leading-relaxed">Contact us for custom pricing, classroom licenses, and institutional deployment options.</p>
        </div>
      </div>
    </div>
  );
}