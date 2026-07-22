import { useSyncExternalStore } from 'react';

const REFRESH_INTERVAL_MS = 60_000;
type ClockListener = () => void;

const listeners = new Set<ClockListener>();
let snapshot = Date.now();
let interval: ReturnType<typeof setInterval> | null = null;

function refresh(): void {
  const next = Date.now();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: ClockListener): () => void {
  listeners.add(listener);
  if (interval == null) {
    refresh();
    interval = setInterval(refresh, REFRESH_INTERVAL_MS);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && interval != null) {
      clearInterval(interval);
      interval = null;
    }
  };
}

function getSnapshot(): number {
  return snapshot;
}

/** Horloge partagée, stable pendant un rendu et rafraîchie une fois par minute. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
