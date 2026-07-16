import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Renvoie true si l'utilisateur a activé « réduire les animations » au niveau système.
 * Toutes les animations de PatternLab doivent respecter ce réglage (règle kit + accessibilité).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setReduced(value);
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
