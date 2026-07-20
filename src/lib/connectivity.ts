import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Connectivité — magasin observable, indépendant de la source.
 *
 * PatternLab est local-first : contenu embarqué + progression AsyncStorage, aucune
 * dépendance réseau pour la boucle d'apprentissage. Ce module fournit une détection
 * de connectivité **branchable** (web maintenant, natif via NetInfo plus tard sans
 * changer les appelants) pour les états hors-ligne et les rares actions qui, à l'avenir,
 * nécessiteront le réseau (ex. un achat réel).
 */

export type ConnectivityListener = (online: boolean) => void;

/** Magasin d'état de connectivité — pur et testable (aucune I/O). */
export class ConnectivityStore {
  private online: boolean;
  private readonly listeners = new Set<ConnectivityListener>();

  constructor(initial = true) {
    this.online = initial;
  }

  get(): boolean {
    return this.online;
  }

  /** Met à jour l'état ; ne notifie que sur un changement réel. */
  set(online: boolean): void {
    if (online === this.online) return;
    this.online = online;
    for (const listener of this.listeners) listener(online);
  }

  subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

/**
 * Branche une source de connectivité sur un magasin. Retourne une fonction d'arrêt.
 * - Web : `navigator.onLine` + événements online/offline.
 * - Natif : supposé en ligne (détection native différée ; `@react-native-community/netinfo`
 *   pourra fournir une source sans changer les appelants).
 */
export function bindPlatformSource(store: ConnectivityStore): () => void {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined' || typeof window === 'undefined') {
    store.set(true);
    return () => {};
  }
  const update = () => store.set(navigator.onLine);
  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}

/** Singleton applicatif. */
export const connectivity = new ConnectivityStore(true);

let bound = false;
function ensureBound(): void {
  if (bound) return;
  bound = true;
  bindPlatformSource(connectivity); // durée de vie de l'app (singleton)
}

/** Hook React : état de connectivité courant, branché sur le magasin singleton. */
export function useConnectivity(): boolean {
  const [online, setOnline] = useState(() => connectivity.get());
  useEffect(() => {
    ensureBound();
    setOnline(connectivity.get());
    return connectivity.subscribe(setOnline);
  }, []);
  return online;
}
