/**
 * Free image generation via Pollinations.ai — no API key required.
 * Uses public endpoints that are free and unlimited.
 */
export const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt';

/**
 * Generate a free image URL from a text prompt using Pollinations.ai.
 * The image is generated on-the-fly when the URL is loaded in an <img> tag.
 *
 * @param prompt - Detailed description of the image to generate
 * @param width - Image width (default 512)
 * @param height - Image height (default 512)
 * @returns A URL string that loads the generated image
 */
export function getPollinationsUrl(
  prompt: string,
  width = 512,
  height = 512,
): string {
  const encoded = encodeURIComponent(prompt.trim().slice(0, 400));
  return `${POLLINATIONS_BASE}/${encoded}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 10000)}&nologo=true`;
}

/**
 * Generate a free image for an evolved species based on its imagePrompt.
 * Returns an object with the URL and a unique key for React.
 */
export function getSpecimenImageUrl(imagePrompt: string): {
  url: string;
  key: string;
} {
  const key = `specimen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    url: getPollinationsUrl(
      `Scientific illustration: ${imagePrompt}. Detailed, realistic, high quality, biology textbook style, evolutionary biology diagram.`,
      768,
      512,
    ),
    key,
  };
}