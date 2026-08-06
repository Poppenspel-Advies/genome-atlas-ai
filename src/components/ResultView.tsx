import { RotateCcw, Sparkles, Dna } from 'lucide-react';
import { OutcomeCard } from './OutcomeCard';
import type { AnalysisResult } from '../lib/api';

interface ResultViewProps {
  result: AnalysisResult;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onReset: () => void;
}

export function ResultView({ result, selectedIndex, onSelect, onReset }: ResultViewProps) {
  const { speciesName, confidence, outcomes, error } = result;

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
        <div className="p-8 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-medium mb-2">Analysis Error</p>
          <p className="text-sm text-foreground-muted mb-6">{error}</p>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated border border-white/10 text-sm text-foreground hover:bg-white/5 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Species header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-dim border border-violet/20 mb-3">
          <Dna className="w-6 h-6 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">
          {speciesName}
        </h2>
        <p className="text-xs text-foreground-muted">
          Confidence: {Math.round(confidence * 100)}%
        </p>
      </div>

      {/* Choose prompt */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-dim border border-pink/20">
          <Sparkles className="w-3.5 h-3.5 text-pink" />
          <span className="text-xs font-semibold text-pink tracking-wide">
            Choose an Evolutionary Path
          </span>
        </div>
        <p className="text-[11px] text-foreground-muted mt-2 max-w-md mx-auto leading-relaxed">
          Genome Atlas AI has generated two possible evolutionary futures for this
          specimen. Select the path you want to explore in the Time Machine.
        </p>
      </div>

      {/* Two pyramid cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {outcomes.slice(0, 2).map((outcome, i) => (
          <OutcomeCard
            key={outcome.type}
            title={outcome.title}
            type={outcome.type}
            description={outcome.description}
            scientificDetail={outcome.scientificDetail}
            imageUrl={outcome.imageUrl}
            imagePrompt={outcome.imagePrompt}
            narrationUrl={outcome.narrationUrl}
            index={i}
            selectable={selectedIndex === null}
            selected={selectedIndex === i}
            onSelect={() => onSelect(i)}
          />
        ))}
      </div>

      {/* Footer action */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-elevated border border-border text-xs text-foreground-muted hover:text-foreground hover:border-border-glow transition-all duration-200 active:scale-[0.97]"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze another specimen
        </button>
      </div>
    </div>
  );
}