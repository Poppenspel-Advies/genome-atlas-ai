import { supabase } from './supabase';

export interface AnalysisInput {
  imageBase64?: string | null;
  transcription?: string | null;
  textDescription?: string | null;
}

export interface EvolutionaryOutcome {
  title: string;
  type: 'quantum' | 'natural-selection' | 'deep-time';
  description: string;
  scientificDetail: string;
  imagePrompt: string;
  imageUrl?: string;
  narrationUrl?: string;
}

export interface AnalysisResult {
  speciesName: string;
  confidence: number;
  outcomes: EvolutionaryOutcome[];
  error?: string;
}

/**
 * Upload a specimen image to Supabase Storage and get a public URL.
 */
export async function uploadSpecimenImage(
  file: File,
): Promise<string | null> {
  const fileName = `specimens/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from('specimens')
    .upload(fileName, file, { upsert: false });

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('specimens')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * Get a Speechmatics WebSocket JWT from the edge function.
 */
export async function getSpeechmaticsToken(): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('speechmatics-token', {
    method: 'GET',
  });

  if (error) {
    console.error('Failed to get Speechmatics token:', error.message);
    return null;
  }

  return data?.token ?? null;
}

/**
 * Scrape reference data from a URL using Bright Data.
 */
export async function scrapeBiologyReference(
  speciesName: string,
): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke(
    'brightdata-scrape',
    {
      body: { speciesName },
    },
  );

  if (error) {
    console.error('Bright Data scrape failed:', error.message);
    return null;
  }

  return data?.scrapedContent ?? null;
}

/**
 * Analyze a biological specimen using the Gemini edge function.
 */
export async function analyzeSpecimen(
  input: AnalysisInput,
): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke('gemini-analyze', {
    body: input,
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