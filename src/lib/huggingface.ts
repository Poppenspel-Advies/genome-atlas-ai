/**
 * Free image generation via Hugging Face Inference API — no API key required.
 * Uses publicly accessible models with rate limiting.
 * Falls back to Pollinations.ai if HF is unavailable.
 */

const HF_INFERENCE_BASE = 'https://api-inference.huggingface.co/models';

/** Models that work without auth token (rate-limited) */
export const HF_FREE_MODELS = {
  FLUX: 'black-forest-labs/FLUX.1-dev',
  SDXL: 'stabilityai/stable-diffusion-xl-base-1.0',
  SD3: 'stabilityai/stable-diffusion-3.5-large-turbo',
} as const;

/**
 * Generate an image using Hugging Face's free inference API (no API key).
 * Falls back to Pollinations if HF fails.
 */
export async function generateImageHF(
  prompt: string,
  model: keyof typeof HF_FREE_MODELS = 'FLUX',
  options?: { width?: number; height?: number },
): Promise<{ url: string; source: 'huggingface' | 'pollinations'; error?: string }> {
  const modelId = HF_FREE_MODELS[model];
  const { width = 512, height = 512 } = options ?? {};

  try {
    const response = await fetch(`${HF_INFERENCE_BASE}/${modelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown HF error');
      // Fallback to Pollinations
      const fallbackUrl = getPollinationsFallback(prompt, width, height);
      return {
        url: fallbackUrl,
        source: 'pollinations',
        error: `HF (${response.status}): ${errorText.slice(0, 100)}`,
      };
    }

    // HF returns image blob directly
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, source: 'huggingface' };
  } catch (err) {
    const fallbackUrl = getPollinationsFallback(prompt, width, height);
    return {
      url: fallbackUrl,
      source: 'pollinations',
      error: err instanceof Error ? err.message : 'HF request failed',
    };
  }
}

/**
 * Get a direct image URL for displaying generated content.
 * Since HF returns blobs (not public URLs), we use this for the view.
 */
function getPollinationsFallback(prompt: string, width: number, height: number): string {
  const encoded = encodeURIComponent(prompt.trim().slice(0, 400));
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 10000)}&nologo=true`;
}

/**
 * Generate an evolved species illustration using HF (free) with Pollinations fallback.
 */
export async function generateSpecimenImage(
  imagePrompt: string,
): Promise<{ url: string; key: string; source: string }> {
  const key = `specimen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fullPrompt = `Scientific illustration: ${imagePrompt}. Detailed, realistic, high quality, biology textbook style, evolutionary biology diagram.`;

  const result = await generateImageHF(fullPrompt, 'FLUX', { width: 768, height: 512 });
  return { url: result.url, key, source: result.source };
}