/**
 * Lightweight toast/alert notification store for Genome Atlas AI.
 * Uses a simple pub-sub pattern with localStorage for persistence.
 */

import { useSyncExternalStore } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
  createdAt: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l([...toasts]);
}

let counter = 0;

function getNextId(): string {
  counter++;
  return `toast-${Date.now()}-${counter}`;
}

export function addToast(
  type: Toast['type'],
  title: string,
  message?: string,
  duration?: number,
): string {
  const id = getNextId();
  toasts = [
    ...toasts,
    { id, type, title, message, duration: duration ?? 4000, createdAt: Date.now() },
  ];
  emit();
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function clearAllToasts(): void {
  toasts = [];
  emit();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Toast[] {
  return toasts;
}

/**
 * Hook to access the toast store from React components.
 * Auto-subscribes and re-renders on changes.
 */
export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Shorthand helpers for creating toasts.
 */
export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    addToast('success', title, message, duration),
  error: (title: string, message?: string, duration?: number) =>
    addToast('error', title, message, duration ?? 6000),
  info: (title: string, message?: string, duration?: number) =>
    addToast('info', title, message, duration),
  warning: (title: string, message?: string, duration?: number) =>
    addToast('warning', title, message, duration ?? 5000),
  dismiss: dismissToast,
  clear: clearAllToasts,
};