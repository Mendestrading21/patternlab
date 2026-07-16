/**
 * Persistance locale abstraite (repository interfaces).
 * P0.1 : AsyncStorage. Migration possible vers Expo SQLite plus tard sans changer les appelants (ADR-003).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SkillProgress } from '../engines/learning';

export interface ProgressState {
  onboarded: boolean;
  level: number;
  totalXp: number;
  streakDays: number;
  coins: number;
  skills: Record<string, SkillProgress>;
  schemaVersion: number;
}

export const PROGRESS_SCHEMA_VERSION = 1;

export interface ProgressRepository {
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  reset(): Promise<void>;
}

const STORAGE_KEY = 'patternlab.progress.v1';

export class AsyncStorageProgressRepository implements ProgressRepository {
  async load(): Promise<ProgressState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ProgressState;
      if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) return null; // migration future
      return parsed;
    } catch {
      return null;
    }
  }

  async save(state: ProgressState): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

/** Implémentation mémoire (tests / fallback). */
export class InMemoryProgressRepository implements ProgressRepository {
  private state: ProgressState | null = null;
  async load(): Promise<ProgressState | null> {
    return this.state;
  }
  async save(state: ProgressState): Promise<void> {
    this.state = state;
  }
  async reset(): Promise<void> {
    this.state = null;
  }
}

export const progressRepository: ProgressRepository = new AsyncStorageProgressRepository();
