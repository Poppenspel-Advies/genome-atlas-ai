/**
 * Free image generation via Pollinations.ai — no API key required.
 * Uses public endpoints that are free and unlimited.
 */
export const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt';

/**
 * Simple string hash to create a deterministic seed from a prompt.
 * Same prompt always → same seed → same URL → Pollinations cache hit.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic image URL from a text prompt using Pollinations.ai.
 * Uses a hash of the prompt as the seed so the same prompt always produces the
 * same URL — this lets Pollinations cache and serve the image faster on retries.
 */
export function getPollinationsUrl(
  prompt: string,
  width = 512,
  height = 512,
): string {
  const encoded = encodeURIComponent(prompt.trim().slice(0, 400));
  const seed = hashString(prompt.trim().slice(0, 200));
  return `${POLLINATIONS_BASE}/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

/**
 * Build a standard scientific-style prompt for a specimen image.
 */
export function buildSpecimenPrompt(imagePrompt: string): string {
  return `Scientific illustration: ${imagePrompt}. Detailed, realistic, high quality, biology textbook style, evolutionary biology diagram.`;
}

/**
 * Generate fallback prompts to try if the primary prompt fails to load.
 */
export function getFallbackPrompt(title: string, type: string, index: number): string {
  const fallbacks = [
    `${title} ${type === 'quantum' ? 'bioluminescent glowing' : type === 'deep-time' ? 'prehistoric geological' : 'evolved'} creature, wildlife illustration, scientific, detailed`,
    `Close-up of a ${title}, nature photography style, animal portrait, high detail`,
    `${title}, natural history museum diorama style, dramatic lighting`,
  ];
  return fallbacks[index % fallbacks.length];
}

/**
 * Generate a stable image URL for an evolved species based on its imagePrompt.
 * Returns an object with the URL and a deterministic key.
 */
export function getSpecimenImageUrl(imagePrompt: string): {
  url: string;
  key: string;
} {
  const prompt = buildSpecimenPrompt(imagePrompt);
  const url = getPollinationsUrl(prompt, 768, 512);
  const seed = hashString(imagePrompt.trim().slice(0, 200));
  return { url, key: `specimen-${seed}` };
}