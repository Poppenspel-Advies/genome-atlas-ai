import { Link2 } from 'lucide-react';

export function IntegrationsView() {
  const services = [
    { name: 'Google Gemini', desc: 'Core AI analysis engine for species identification and evolutionary outcome generation.', status: 'Connected', iconColor: 'text-violet', bg: 'bg-violet-dim' },
    { name: 'Supabase', desc: 'Backend database, authentication, and Edge Function hosting for secure API proxying.', status: 'Connected', iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Speechmatics', desc: 'Real-time speech-to-text for voice note transcription and video narration processing.', status: 'Ready', iconColor: 'text-pink', bg: 'bg-pink-dim' },
    { name: 'Bright Data', desc: 'Web scraping proxy for enriching analysis with reference data from biology databases.', status: 'Ready', iconColor: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Pollinations.ai', desc: 'Free AI image generation for scientific illustrations of evolutionary outcomes.', status: 'Active', iconColor: 'text-gold', bg: 'bg-gold-dim' },
    { name: 'Hugging Face', desc: 'Open-source model inference for community-driven evolutionary models and custom analysis.', status: 'Available', iconColor: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <Link2 className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Integrations</h2>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto">Connected services powering the Genome Atlas AI platform.</p>
      </div>
      <div className="space-y-2 mb-6">
        {services.map((svc, i) => (
          <div key={i} className="p-3 rounded-xl bg-surface/60 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${svc.bg} flex items-center justify-center`}>
                <span className={`text-sm ${svc.iconColor}`}>⚡</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{svc.name}</p>
                <p className="text-[9px] text-foreground-muted/70">{svc.desc}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              svc.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              svc.status === 'Active' ? 'bg-gold-dim text-gold border border-gold/20' :
              'bg-surface-elevated text-foreground-muted border border-border'
            }`}>{svc.status}</span>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-dim to-pink-dim border border-violet/20">
        <h3 className="text-xs font-semibold text-foreground mb-2">🔐 Security Note</h3>
        <p className="text-[10px] text-foreground-muted leading-relaxed">
          All API keys are stored securely in Supabase Edge Function secrets. No credentials ever reach your browser.
          Each integration is proxied through a dedicated Edge Function, ensuring zero client-side exposure.
        </p>
      </div>
    </div>
  );
}