/**
 * Local storage-based analysis history store.
 * Tracks all analyses, weekly reports, and time-machine projection data.
 */

import type { AnalysisResult } from './api';

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  speciesName: string;
  confidence: number;
  mode: string;
  selectedPath: 'quantum' | 'natural-selection' | null;
  result: AnalysisResult;
  reportGenerated?: string; // ISO date of last report
}

export interface WeeklyReport {
  id: string;
  weekStart: string; // ISO date
  weekEnd: string;
  analysesCount: number;
  species: string[];
  topPath: 'quantum' | 'natural-selection' | 'even';
  summary: string;
  predictions: string[];
}

export interface AnalysisMapData {
  records: AnalysisRecord[];
  reports: WeeklyReport[];
  weeklyTrend: { week: string; count: number }[];
}

const STORAGE_KEY = 'genomi_atlas_analyses';

function loadAll(): AnalysisRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(records: AnalysisRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** Add a completed analysis to the history store. */
export function addAnalysisRecord(record: Omit<AnalysisRecord, 'id' | 'timestamp'>): AnalysisRecord {
  const records = loadAll();
  const newRecord: AnalysisRecord = {
    ...record,
    id: `ana-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };
  records.unshift(newRecord);
  saveAll(records);
  return newRecord;
}

/** Get all analysis records. */
export function getAnalysisRecords(): AnalysisRecord[] {
  return loadAll();
}

/** Get a single record by ID. */
export function getAnalysisRecord(id: string): AnalysisRecord | undefined {
  return loadAll().find((r) => r.id === id);
}

/** Delete a record. */
export function deleteAnalysisRecord(id: string): void {
  saveAll(loadAll().filter((r) => r.id !== id));
}

/** Generate weekly reports from stored analyses. */
export function generateWeeklyReports(): WeeklyReport[] {
  const records = loadAll();
  const weeks = new Map<string, AnalysisRecord[]>();

  // Group by ISO week
  for (const rec of records) {
    const d = new Date(rec.timestamp);
    const weekStart = getWeekStart(d);
    if (!weeks.has(weekStart)) weeks.set(weekStart, []);
    weeks.get(weekStart)!.push(rec);
  }

  const reports: WeeklyReport[] = [];
  for (const [weekStart, weekRecords] of weeks) {
    const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const species = [...new Set(weekRecords.map((r) => r.speciesName))];
    const quantumCount = weekRecords.filter((r) => r.selectedPath === 'quantum').length;
    const naturalCount = weekRecords.filter((r) => r.selectedPath === 'natural-selection').length;
    const topPath: 'quantum' | 'natural-selection' | 'even' =
      quantumCount > naturalCount ? 'quantum' : naturalCount > quantumCount ? 'natural-selection' : 'even';

    reports.push({
      id: `report-${weekStart}`,
      weekStart,
      weekEnd,
      analysesCount: weekRecords.length,
      species,
      topPath,
      summary: generateSummary(weekRecords, topPath),
      predictions: generatePredictions(weekRecords, species),
    });
  }

  return reports.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

/** Get weekly trend data for the analysis map. */
export function getWeeklyTrend(): { week: string; count: number }[] {
  const records = loadAll();
  const weeks = new Map<string, number>();
  for (const rec of records) {
    const ws = getWeekStart(new Date(rec.timestamp));
    weeks.set(ws, (weeks.get(ws) ?? 0) + 1);
  }
  return [...weeks.entries()]
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

/** Get the full analysis map data. */
export function getAnalysisMapData(): AnalysisMapData {
  return {
    records: loadAll(),
    reports: generateWeeklyReports(),
    weeklyTrend: getWeeklyTrend(),
  };
}

// ── Helpers ──

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

function generateSummary(records: AnalysisRecord[], topPath: string): string {
  const species = [...new Set(records.map((r) => r.speciesName))];
  const pathLabel = topPath === 'quantum' ? 'Quantum evolution' : topPath === 'natural-selection' ? 'Natural selection' : 'a balanced mix';
  return `This week you analyzed ${records.length} specimen(s): ${species.join(', ')}. Your dominant evolutionary path was ${pathLabel}.`;
}

function generatePredictions(records: AnalysisRecord[], species: string[]): string[] {
  const preds: string[] = [];
  if (species.length > 0) {
    preds.push(`Based on your interest in ${species[0]}, explore convergent evolution patterns in similar ecological niches.`);
  }
  if (records.some((r) => r.selectedPath === 'quantum')) {
    preds.push('Your quantum pathway selections suggest an interest in radiation-driven mutation — try analyzing extremophiles next.');
  }
  if (records.some((r) => r.selectedPath === 'natural-selection')) {
    preds.push('Natural selection seems to fascinate you — consider comparing island vs. mainland species for adaptive radiation insights.');
  }
  if (preds.length === 0) {
    preds.push('Start analyzing species to receive AI-powered predictions about your evolutionary interests.');
  }
  return preds;
}

/** Check if a new weekly report should be generated. Returns report if due. */
export function checkWeeklyReportDue(): WeeklyReport | null {
  const reports = generateWeeklyReports();
  if (reports.length === 0) return null;
  const latest = reports[0];
  const weekStartDate = new Date(latest.weekStart);
  const now = new Date();
  // If the latest report is from this week, no new report needed
  const thisWeekStart = getWeekStart(now);
  if (latest.weekStart === thisWeekStart) return null;
  // Otherwise check if there are analyses since the last report
  const records = loadAll();
  const newRecords = records.filter((r) => new Date(r.timestamp) > weekStartDate);
  if (newRecords.length === 0) return null;
  // Generate a new report
  return generateWeeklyReports()[0];
}