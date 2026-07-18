import { describe, it, expect } from '@jest/globals';
import { ConnectivityStore, bindPlatformSource } from './connectivity';

describe('ConnectivityStore', () => {
  it('expose l’état initial', () => {
    expect(new ConnectivityStore().get()).toBe(true);
    expect(new ConnectivityStore(false).get()).toBe(false);
  });

  it('notifie les abonnés sur un changement réel', () => {
    const store = new ConnectivityStore(true);
    const seen: boolean[] = [];
    store.subscribe((o) => seen.push(o));
    store.set(false);
    store.set(true);
    expect(seen).toEqual([false, true]);
    expect(store.get()).toBe(true);
  });

  it('ne notifie pas si l’état ne change pas', () => {
    const store = new ConnectivityStore(true);
    let calls = 0;
    store.subscribe(() => {
      calls += 1;
    });
    store.set(true); // identique
    store.set(true);
    expect(calls).toBe(0);
  });

  it('le désabonnement stoppe les notifications', () => {
    const store = new ConnectivityStore(true);
    let calls = 0;
    const unsub = store.subscribe(() => {
      calls += 1;
    });
    store.set(false);
    unsub();
    store.set(true);
    expect(calls).toBe(1);
  });

  it('bindPlatformSource sur natif suppose en ligne et rend une fonction d’arrêt', () => {
    // En environnement de test (Platform.OS non-web), la source suppose « en ligne ».
    const store = new ConnectivityStore(false);
    const stop = bindPlatformSource(store);
    expect(store.get()).toBe(true);
    expect(typeof stop).toBe('function');
    expect(() => stop()).not.toThrow();
  });
});
