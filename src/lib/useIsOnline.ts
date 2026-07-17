import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Indique si l'appareil est en ligne.
 * - Web : `navigator.onLine` + événements online/offline.
 * - Natif : supposé en ligne (détection réseau native différée — aucune dépendance
 *   ajoutée ; @react-native-community/netinfo pourra la fournir dans un lot ultérieur).
 */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || typeof window === 'undefined') {
      return;
    }
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return online;
}
