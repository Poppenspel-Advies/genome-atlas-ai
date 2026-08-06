import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageIcon, Loader2, Sparkles, Atom, Leaf, Check, Trophy, RefreshCw } from 'lucide-react';
import { getSpecimenImageUrl, getPollinationsUrl } from '../lib/imageGeneration';

interface OutcomeCardProps {
  title: string;
  type: 'quantum' | 'natural-selection';
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  const MAX_RETRIES = 5;
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Build a fallback prompt if the original fails repeatedly
  const getFallbackVariation = useCallback((attempt: number): string => {
    const fallbacks: string[] = [
      imagePrompt || `${title} specimen, scientific illustration`,
      `${title} ${type === 'quantum' ? 'bioluminescent glowing' : 'evolved'} creature, wildlife illustration`,
      `Close-up of a ${title}, nature photography style, animal portrait`,
    ];
    return fallbacks[attempt % fallbacks.length];
  }, [imagePrompt, title, type]);

  // Generate a fresh URL — tries original prompt first, then fallback variations
  const generateFreshUrl = useCallback((attempt: number) => {
    if (attempt < 3 && imagePrompt) {
      // First 3 attempts: original prompt with a new seed
      const { url } = getSpecimenImageUrl(imagePrompt);
      return url;
    }
    // After 3 failures: try fallback prompts
    const fallbackPrompt = getFallbackVariation(attempt);
    return getPollinationsUrl(
      `Scientific illustration of ${fallbackPrompt}. Detailed, realistic, high quality, biology textbook style.`,
      768,
      512,
    );
  }, [imagePrompt, getFallbackVariation]);

  // Sync currentImageUrl when prop changes
  useEffect(() => {
    setCurrentImageUrl(initialImageUrl);
    setImageLoading(true);
    setImageError(false);
    setRetryCount(0);
  }, [initialImageUrl]);

  // Retry handler — always uses the latest retryCount via ref to avoid stale closures
  const retryCountRef = useRef(retryCount);
  retryCountRef.current = retryCount;

  const handleImageError = useCallback(() => {
    const currentRetry = retryCountRef.current;
    if (currentRetry < MAX_RETRIES) {
      // Generate a fresh URL — different prompt variation if original keeps failing
      const newUrl = generateFreshUrl(currentRetry);
      setCurrentImageUrl(newUrl);
      setRetryCount((prev) => prev + 1);
      setImageLoading(true);
      setImageError(false);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  }, [generateFreshUrl]);

  // Also handle error for the fallback URL update
  useEffect(() => {
    if (imageLoading && currentImageUrl) {
      // Force browser to re-attempt the image when URL changes by creating a temp image
      const tempImg = new Image();
      tempImg.onload = () => {
        // The real img will load through React rendering
      };
      tempImg.src = currentImageUrl;
    }
  }, [currentImageUrl, imageLoading]);

  // Cleanup retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const isQuantum = type === 'quantum';
  const accentColor = isQuantum ? '#8B5CF6' : '#FFD700';
  const borderGlowClass = isQuantum
    ? 'shadow-[0_0_30px_rgba(139,92,246,0.15)]'
    : 'shadow-[0_0_30px_rgba(255,215,0,0.15)]';

  return (
    <button
      type="button"
      onClick={selectable ? onSelect : undefined}
      disabled={!selectable}
      className={`
        relative w-full text-left outline-none transition-all duration-500 animate-slide-up
        ${selectable ? 'cursor-pointer' : 'cursor-default'}
        ${selected ? 'scale-[1.02]' : 'hover:scale-[1.015]'}
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg
      `}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Pyramid outer shell */}
      <div className={`
        pyramid-card relative overflow-hidden
        ${borderGlowClass}
        ${selected
          ? 'ring-2 ring-offset-2 ring-offset-bg'
          : ''
        }
        ${selected && isQuantum ? 'ring-violet' : ''}
        ${selected && !isQuantum ? 'ring-gold' : ''}
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
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${accentColor}25, transparent 70%)`,
            }}
          />
        )}

        {/* ===== APEX — Title & Badge (narrow top) ===== */}
        <div className="relative pt-6 pb-2 px-6 text-center">
          {/* Type badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              color: accentColor,
            }}
          >
            {isQuantum ? <Atom className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
            {isQuantum ? 'Quantum Evolution' : 'Natural Selection'}
          </div>

          {/* Title */}
          <h3 className="text-base font-heading font-bold tracking-wide mb-1"
            style={{ color: accentColor }}
          >
            {title}
          </h3>

          {/* Trohpy for selected */}
          {selected && (
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gold/20 border border-gold/30">
              <Trophy className="w-3 h-3 text-gold" />
              <span className="text-[9px] font-semibold text-gold uppercase tracking-wider">Selected Path</span>
            </div>
          )}
        </div>

        {/* ===== BODY — Description (expanding middle) ===== */}
        <div className="relative px-5 py-3">
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4">
            {description}
          </p>
        </div>

        {/* Scientific detail toggle */}
        <div className="relative px-5 pb-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center gap-1 text-[10px] text-foreground-muted/60 hover:text-foreground-muted transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            {expanded ? 'Less detail' : 'Scientific detail'}
          </button>

          {expanded && (
            <div className="mt-2 p-2.5 rounded-lg bg-black/30 border border-white/5 animate-fade-in">
              <p className="text-[10px] text-foreground-muted leading-relaxed whitespace-pre-line">
                {scientificDetail}
              </p>
            </div>
          )}
        </div>

        {/* ===== BASE — Image (widest part) ===== */}
        <div className="relative mt-2 mx-0">
          <div className="h-44 overflow-hidden">
            {currentImageUrl && !imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 text-foreground-muted animate-spin" />
                  </div>
                )}
                <img
                  ref={imgRef}
                  src={currentImageUrl}
                  alt={title}
                  key={`${currentImageUrl}-${retryCount}`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-surface-elevated">
                {retryCount >= MAX_RETRIES ? (
                  <>
                    <ImageIcon className="w-8 h-8 text-foreground-muted/20" />
                    <span className="text-[10px] text-foreground-muted/30">Illustration unavailable</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (imagePrompt) {
                          const { url } = getSpecimenImageUrl(imagePrompt);
                          setCurrentImageUrl(url);
                          setRetryCount(0);
                          setImageError(false);
                          setImageLoading(true);
                        }
                      }}
                      className="flex items-center gap-1 text-[9px] text-foreground-muted/40 hover:text-pink transition-colors"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Retry
                    </button>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 text-foreground-muted animate-spin" />
                    <span className="text-[10px] text-foreground-muted/40">Generating image...</span>
                  </>
                )}
              </div>
            )}
            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg/60 to-transparent" />
          </div>
        </div>

        {/* Selected checkmark */}
        {selectable && !selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-white/0 transition-all" />
          </div>
        )}
        {selectable && selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}