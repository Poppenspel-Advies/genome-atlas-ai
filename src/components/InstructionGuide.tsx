import { X, Dna, Upload, Search, Users, Infinity, ChevronRight, HelpCircle } from 'lucide-react';

const GUIDE_STEPS = [
  {
    icon: Upload,
    title: '1. Upload a Specimen',
    desc: 'Drop a photo, video, voice note, or type a description of any biological specimen — a plant, animal, fossil, or microbe.',
  },
  {
    icon: Search,
    title: '2. AI Analyzes It',
    desc: 'Our genome AI identifies the species and traces its evolutionary lineage through deep time using genomic + fossil data.',
  },
  {
    icon: Users,
    title: '3. Choose a Path',
    desc: 'Two distinct evolutionary futures are generated — one driven by quantum effects, one by natural selection. Pick one.',
  },
  {
    icon: Infinity,
    title: '4. Explore the Time Machine',
    desc: 'View your chosen species in a rotating 3D space-time cube with full scientific detail, illustrations, and evolutionary data.',
  },
];

const TIPS = [
  'Try uploading a clear photo of an animal or plant for best results',
  'Use the dinosaur samples below to see instant prehistoric analysis',
  'Click "Analyze Species" anytime to start a new session',
  'The sidebar menu lets you browse the Dino Archive, Fossil Library, and more',
];

interface InstructionGuideProps {
  open: boolean;
  onClose: () => void;
}

export function InstructionGuide({ open, onClose }: InstructionGuideProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-violet" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-foreground">How Genomi Atlas Works</h3>
              <p className="text-[10px] text-foreground-muted">Your guide to evolutionary exploration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-foreground-muted/50 hover:text-foreground hover:bg-surface-elevated transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Steps</p>
          {GUIDE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-violet" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">{step.title}</p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-3">Pro Tips</p>
          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-foreground-muted">
                <ChevronRight className="w-3 h-3 text-pink shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Dna className="w-3 h-3 text-pink" />
            <span className="text-[9px] text-foreground-muted">Genomi Atlas AI v1.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-[10px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}