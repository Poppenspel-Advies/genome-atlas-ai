import { useState, useCallback, useEffect } from 'react';
import { Dna, Atom, Leaf, RotateCcw, Sparkles, Zap, Volume2, VolumeX } from 'lucide-react';

interface NarrationPlayerProps {
  title: string;
  type: 'quantum' | 'natural-selection';
  description: string;
  scientificDetail: string;
  imageUrl?: string;
  speciesName: string;
  onReset: () => void;
}

export function NarrationPlayer({
  title,
  type,
  description,
  scientificDetail,
  imageUrl,
  speciesName,
  onReset,
}: NarrationPlayerProps) {
  const isQuantum = type === 'quantum';
  const accentColor = isQuantum ? '#8B5CF6' : '#FFD700';
  const accentLabel = isQuantum ? 'Quantum' : 'Natural Selection';

  // TTS state
  const [ttsPlaying, setTtsPlaying] = useState(false);

  // Full narration text combining description + scientific detail
  const narrationText = [
    `The ${speciesName}.`,
    description,
    scientificDetail,
    `This evolutionary path was projected by Genomi Atlas AI.`,
  ].join(' ');

  // "Animal voice" intro — a guttural creature call to set the tone
  const creatureCallText = `*deep resonant vocalization of the ${speciesName}*`;

  const stopTts = useCallback(() => {
    window.speechSynthesis.cancel();
    setTtsPlaying(false);
  }, []);

  const startTts = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setTtsPlaying(false);

    // Utterance 1: Creature call (very deep, slow — animal voice effect)
    const callUtterance = new SpeechSynthesisUtterance(creatureCallText);
    callUtterance.lang = 'en-US';
    callUtterance.pitch = 0.25;
    callUtterance.rate = 0.6;
    callUtterance.volume = 0.8;

    // Utterance 2: Full narration (deep, resonant naturalist voice)
    const narrationUtterance = new SpeechSynthesisUtterance(narrationText);
    narrationUtterance.lang = 'en-US';
    narrationUtterance.pitch = 0.4;
    narrationUtterance.rate = 0.8;
    narrationUtterance.volume = 1;

    narrationUtterance.onend = () => {
      setTtsPlaying(false);
    };

    narrationUtterance.onerror = () => {
      setTtsPlaying(false);
    };

    // Play creature call first, then narration
    callUtterance.onend = () => {
      window.speechSynthesis.speak(narrationUtterance);
    };

    window.speechSynthesis.speak(callUtterance);
    setTtsPlaying(true);
  }, [narrationText, creatureCallText, stopTts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-3 orb-float">
          <Zap className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">
          Evolutionary Time Machine
        </h2>
        <p className="text-xs text-foreground-muted max-w-sm mx-auto leading-relaxed">
          The chosen evolutionary path for <span className="text-foreground font-semibold">{speciesName}</span> displayed across
          six dimensions in a rotating space-time cube.
        </p>
      </div>

      {/* ===== 3D CUBE ===== */}
      <div className="cube-scene mx-auto mb-8">
        <div className="cube">
          {/* Front face — Species + Title */}
          <div className="cube-face front">
            <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
              style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
            >
              <Dna className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted/60 mb-1">{speciesName}</p>
            <h3 className="text-sm font-heading font-bold text-foreground leading-tight">{title}</h3>
            <div className="mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}
            >
              {accentLabel}
            </div>
          </div>

          {/* Back face — Full Description */}
          <div className="cube-face back">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold text-foreground">Evolutionary Path</span>
            </div>
            <p className="text-[10px] text-foreground-muted leading-relaxed line-clamp-6">
              {description}
            </p>
          </div>

          {/* Right face — Scientific Detail */}
          <div className="cube-face right">
            <div className="flex items-center gap-2 mb-3">
              <Atom className="w-4 h-4 text-pink" />
              <span className="text-xs font-semibold text-foreground">Scientific Analysis</span>
            </div>
            <p className="text-[10px] text-foreground-muted leading-relaxed line-clamp-6 whitespace-pre-line">
              {scientificDetail}
            </p>
          </div>

          {/* Left face — Image */}
          <div className="cube-face left p-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Dna className="w-8 h-8 text-foreground-muted/30" />
                <p className="text-[10px] text-foreground-muted/40">No illustration available</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
              <p className="text-[10px] text-white/60">{title} — {speciesName}</p>
            </div>
          </div>

          {/* Top face — Time Machine Branding */}
          <div className="cube-face top">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full mb-3"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <Zap className="w-6 h-6 text-violet" />
              <div className="absolute inset-0 rounded-full bg-violet-glow blur-md animate-pulse-glow" />
            </div>
            <p className="text-xs font-heading font-bold text-foreground tracking-wide">
              Genomi Atlas
            </p>
            <p className="text-[10px] text-foreground-muted/60 mt-1">Time Machine Cube</p>
          </div>

          {/* Bottom face — Confidence Stats */}
          <div className="cube-face bottom">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold text-foreground">Projection Complete</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
              <div className="flex justify-between text-[10px]">
                <span className="text-foreground-muted">Pathway</span>
                <span className="text-foreground font-medium">{accentLabel}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-foreground-muted">Species</span>
                <span className="text-foreground font-medium">{speciesName}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-foreground-muted">Status</span>
                <span className="text-gold font-medium">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive hint */}
      <p className="text-[10px] text-foreground-muted/40 mb-6 animate-pulse-glow">
        Hover to pause rotation · 6 dimensions of evolutionary data
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* TTS Button */}
          <button
            onClick={ttsPlaying ? stopTts : startTts}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-[0.97] ${
              ttsPlaying
                ? 'bg-pink/20 border border-pink/30 text-pink'
                : 'bg-surface-elevated border border-border text-foreground-muted hover:text-foreground hover:border-border-glow'
            }`}
            title={ttsPlaying ? 'Stop narration' : 'Hear the evolutionary path read aloud'}
          >
            {ttsPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                Stop Narration
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Listen (Voice)
              </>
            )}
          </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-xs font-semibold hover:opacity-90 transition-all duration-200 active:scale-[0.97] shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        >
          <RotateCcw className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Speaking indicator */}
      {ttsPlaying && (
        <div className="flex items-center gap-2 mt-4 animate-fade-in">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 rounded-full bg-pink animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-4 rounded-full bg-violet animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 h-2 rounded-full bg-pink animate-pulse" style={{ animationDelay: '400ms' }} />
            <div className="w-1 h-5 rounded-full bg-violet animate-pulse" style={{ animationDelay: '600ms' }} />
            <div className="w-1 h-3 rounded-full bg-pink animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[10px] text-foreground-muted/60">Narrating evolutionary path...</span>
        </div>
      )}
    </div>
  );
}