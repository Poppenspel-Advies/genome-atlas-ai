/**
 * Gemini Analysis Client
 *
 * Frontend module for calling the gemini-analyze Supabase Edge Function.
 * The Edge Function runs Gemini AI with a local fallback evolution engine
 * when the API key is unavailable or rate-limited.
 */

import { supabase } from './supabase';

// ── Types ──

export interface AnalysisInput {
  /** Base64-encoded image data (optional — send the image for visual analysis) */
  imageBase64?: string | null;
  /** MIME type of the image, e.g. 'image/jpeg' (required if imageBase64 is set) */
  mimeType?: string | null;
  /** Audio/video transcription text (optional, from Speechmatics) */
  transcription?: string | null;
  /** User-typed text description (optional) */
  textDescription?: string | null;
}

export interface EvolutionaryOutcome {
  title: string;
  type: 'quantum' | 'natural-selection';
  description: string;
  scientificDetail: string;
  imagePrompt: string;
}

export interface AnalysisResult {
  speciesName: string;
  confidence: number;
  outcomes: EvolutionaryOutcome[];
  error?: string;
}

// ── Client ──

const EDGE_FUNCTION = 'gemini-analyze';

/**
 * Analyze a biological specimen by sending text and/or an image to the
 * gemini-analyze Edge Function.
 *
 * The function tries Gemini AI first (with 429 retry), then falls back to a
 * local keyword-driven evolution engine — so it always returns outcomes.
 *
 * @param input - The specimen analysis input (text, image, or both)
 * @returns An AnalysisResult containing species ID and evolutionary outcomes
 */
export async function analyzeSpecimen(input: AnalysisInput): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION, {
    body: {
      imageBase64: input.imageBase64 ?? null,
      mimeType: input.mimeType ?? null,
      transcription: input.transcription ?? null,
      textDescription: input.textDescription ?? null,
    },
  });

  if (error) {
    return {
      speciesName: 'Unknown',
      confidence: 0,
      outcomes: [],
      error: `Analysis failed: ${error.message}`,
    };
  }

  return data as AnalysisResult;
}

/**
 * Upload a specimen image to Supabase Storage and return the public URL.
 * Useful when you need a persistent URL for history or sharing.
 */
export async function uploadSpecimenImage(file: File): Promise<string | null> {
  const fileName = `specimens/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('specimens')
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    console.error('Upload failed:', uploadError.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('specimens')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}