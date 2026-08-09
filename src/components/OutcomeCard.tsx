import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageIcon, Loader2, Sparkles, Atom, Leaf, Check, Trophy, RefreshCw, Clock } from 'lucide-react';
import { getSpecimenImageUrl, getPollinationsUrl, getFallbackPrompt } from '../lib/imageGeneration';

interface OutcomeCardProps {
  title: string;
  type: 'quantum' | 'natural-selection' | 'deep-time';
  description: string;
  scientificDetail: string;
  imageUrl?: string;
  imagePrompt?: string;
  narrationUrl?: string;
  index: number;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const MAX_RETRIES_PER_URL = 6;   // retry same URL up to 6 times
const MAX_PROMPT_GENERATIONS = 3; // try up to 3 different prompt variations
const RETRY_DELAYS = [1500, 2500, 3500, 5000, 7000, 10000]; // ms delays for retries

export function OutcomeCard({
  title,
  type,
  description,
  scientificDetail,
  imageUrl: initialImageUrl,
  imagePrompt,
  index,
  selectable,
  selected,
  onSelect,
}: OutcomeCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Image loading state machine:
  //   "loading"  → retrying with backoff
  //   "loaded"   → image successfully loaded
  //   "failed"   → all retries and fallback prompts exhausted
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'failed'>('loading');

  // Current URL being attempted (changes on retry for cache-busting)
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Which prompt variant we're on (0 = original imagePrompt, 1+ = fallbacks)
  const [promptGen, setPromptGen] = useState(0);

  // How many times we've retried the current URL
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Stable callback to build a URL for a given prompt generation ──
  const buildUrlForGen = useCallback((generation: number, cacheBust?: number): string => {
    let rawUrl: string;
    if (generation === 0 && imagePrompt) {
      rawUrl = getSpecimenImageUrl(imagePrompt).url;
    } else if (generation === 0 && initialImageUrl) {
      rawUrl = initialImageUrl;
    } else {
      const fallbackPrompt = getFallbackPrompt(title, type, generation - 1);
      rawUrl = getPollinationsUrl(
        `Scientific illustration of ${fallbackPrompt}. Detailed, realistic, high quality, biology textbook style.`,
        768, 512,
      );
    }
    // Add cache-busting so the browser doesn't serve a cached error response
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}_cb=${cacheBust ?? Date.now()}`;
  }, [imagePrompt, initialImageUrl, title, type]);

  // ── Load the image via the <img> tag — errors drive retries ──
  // We manage this by bumping a ref counter to force the img src to change
  const [, setTick] = useState(0);
  const triggerRetry = useCallback(() => setTick(t => t + 1), []);

  // Init: build initial URL
  useEffect(() => {
    const url = buildUrlForGen(0, Date.now());
    setCurrentUrl(url);
    setImageState('loading');
    setPromptGen(0);
    retryCountRef.current = 0;
  }, [initialImageUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle image load success ──
  const handleLoad = useCallback(() => {
    if (!mountedRef.current) return;
    setImageState('loaded');
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // ── Handle image load error — retry with backoff, then fallback prompt, then fail ──
  const handleError = useCallback(() => {
    if (!mountedRef.current || imageState === 'loaded') return;

    const retriesLeft = MAX_RETRIES_PER_URL - retryCountRef.current - 1;

    if (retriesLeft > 0) {
      // Retry the same URL with cache-busting and exponential backoff
      retryCountRef.current += 1;
      const delay = RETRY_DELAYS[Math.min(retryCountRef.current - 1, RETRY_DELAYS.length - 1)];

      retryTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        // Bump the cache-bust parameter so the browser does a fresh fetch
        const url = buildUrlForGen(promptGen, Date.now());
        setCurrentUrl(url);
        triggerRetry();
      }, delay);
    } else if (promptGen + 1 < MAX_PROMPT_GENERATIONS) {
      // Try next prompt generation
      const nextGen = promptGen + 1;
      setPromptGen(nextGen);
      retryCountRef.current = 0;
      const url = buildUrlForGen(nextGen, Date.now());
      setCurrentUrl(url);
      triggerRetry();
    } else {
      // All exhausted
      setImageState('failed');
    }
  }, [imageState, promptGen, buildUrlForGen, triggerRetry]);

  // ── Manual retry from failed state ──
  const handleManualRetry = useCallback(() => {
    retryCountRef.current = 0;
    setPromptGen(0);
    setImageState('loading');
    const url = buildUrlForGen(0, Date.now());
    setCurrentUrl(url);
    triggerRetry();
  }, [buildUrlForGen, triggerRetry]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // **CARD IS ONLY SELECTABLE WHEN IMAGE IS LOADED OR ALL ATTEMPTS EXHAUSTED**
  const actuallySelectable = selectable && (imageState === 'loaded' || imageState === 'failed');

  const isQuantum = type === 'quantum';
  const isDeepTime = type === 'deep-time';
  const accentColor = isQuantum ? '#8B5CF6' : isDeepTime ? '#14B8A6' : '#FFD700';

  const borderGlowClass = isQuantum
    ? 'shadow-[0_0_30px_rgba(139,92,246,0.15)]'
    : isDeepTime
    ? 'shadow-[0_0_30px_rgba(20,184,166,0.15)]'
    : 'shadow-[0_0_30px_rgba(255,215,0,0.15)]';

  // Subtitle for loading state
  const loadingMessage = promptGen > 0
    ? `Generating illustration (variant ${promptGen + 1})...`
    : 'Generating evolutionary illustration...';

  return (
    <button
      type="button"
      onClick={actuallySelectable ? onSelect : undefined}
      disabled={!actuallySelectable}
      className={`
        relative w-full text-left outline-none transition-all duration-500 animate-slide-up
        ${actuallySelectable ? 'cursor-pointer' : 'cursor-default'}
        ${imageState === 'loading' ? 'opacity-70' : ''}
        ${selected ? 'scale-[1.02]' : actuallySelectable ? 'hover:scale-[1.015]' : ''}
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg
      `}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Pyramid outer shell */}
      <div className={`
        pyramid-card relative overflow-hidden
        ${borderGlowClass}
        ${selected ? 'ring-2 ring-offset-2 ring-offset-bg' : ''}
        ${selected && isQuantum ? 'ring-violet' : ''}
        ${selected && !isQuantum && !isDeepTime ? 'ring-gold' : ''}
        ${selected && isDeepTime ? 'ring-teal' : ''}
      `}
        style={{
          border: `1px solid ${selected ? accentColor : 'rgba(255,255,255,0.08)'}`,
          background: selected
            ? `linear-gradient(180deg, ${accentColor}15 0%, rgba(10,10,15,0.95) 100%)`
            : 'linear-gradient(180deg, rgba(20,20,32,0.8) 0%, rgba(10,10,15,0.6) 100%)',
        }}
      >
        {/* Animated glow overlay when selected */}
        {selected && (
          <div
            className="absolute inset-0 pointer-events-none animate-pulse-glow"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}25, transparent 70%)` }}
          />
        )}

        {/* ===== APEX — Title & Badge ===== */}
        <div className="relative pt-6 pb-2 px-6 text-center">
          {/* Type badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
          >
            {isQuantum ? <Atom className="w-3 h-3" /> : isDeepTime ? <Clock className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
            {isQuantum ? 'Quantum Evolution' : isDeepTime ? 'Deep Time Analysis' : 'Natural Selection'}
          </div>

          {/* Title */}
          <h3 className="text-base font-heading font-bold tracking-wide mb-1" style={{ color: accentColor }}>
            {title}
          </h3>

          {/* Trophy for selected */}
          {selected && (
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gold/20 border border-gold/30">
              <Trophy className="w-3 h-3 text-gold" />
              <span className="text-[9px] font-semibold text-gold uppercase tracking-wider">Selected Path</span>
            </div>
          )}

          {/* Loading indicator while image not ready */}
          {imageState === 'loading' && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3 h-3 text-foreground-muted animate-spin" />
              <span className="text-[9px] text-foreground-muted/50">{loadingMessage}</span>
            </div>
          )}
        </div>

        {/* ===== BODY — Description ===== */}
        <div className="relative px-5 py-3">
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4">{description}</p>
        </div>

        {/* Scientific detail toggle */}
        <div className="relative px-5 pb-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="flex items-center gap-1 text-[10px] text-foreground-muted/60 hover:text-foreground-muted transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            {expanded ? 'Less detail' : 'Scientific detail'}
          </button>

          {expanded && (
            <div className="mt-2 p-2.5 rounded-lg bg-black/30 border border-white/5 animate-fade-in">
              <p className="text-[10px] text-foreground-muted leading-relaxed whitespace-pre-line">{scientificDetail}</p>
            </div>
          )}
        </div>

        {/* ===== BASE — Image (widest part) ===== */}
        <div className="relative mt-2 mx-0">
          <div className="h-44 overflow-hidden">
            {imageState !== 'failed' ? (
              <>
                {!currentUrl && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 text-foreground-muted animate-spin" />
                  </div>
                )}
                <img
                  key={currentUrl}
                  src={currentUrl}
                  alt={title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleLoad}
                  onError={handleError}
                />
                {/* Loading spinner overlay */}
                {imageState === 'loading' && currentUrl && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 text-foreground-muted animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-surface-elevated">
                <ImageIcon className="w-8 h-8 text-foreground-muted/20" />
                <span className="text-[10px] text-foreground-muted/30">Illustration unavailable</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleManualRetry(); }}
                  className="flex items-center gap-1 text-[9px] text-foreground-muted/40 hover:text-pink transition-colors"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Retry
                </button>
              </div>
            )}
            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg/60 to-transparent" />
          </div>
        </div>

        {/* Selected checkmark */}
        {actuallySelectable && !selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-white/0 transition-all" />
          </div>
        )}
        {actuallySelectable && selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}