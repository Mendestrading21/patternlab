/**
 * @jest-environment jsdom
 *
 * Test d'INTÉGRATION du contrôleur réellement branché (hook + machine + timers), via react-dom.
 * Ne teste pas seulement des fonctions pures : il monte un composant, émet des événements dans
 * `act`, avance de vrais timers simulés et démonte pour prouver l'annulation. Aucune nouvelle
 * dépendance (react-dom est déjà présent pour le web ; le hook n'importe pas Reanimated).
 */
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createElement, useEffect, act } from 'react';
// @ts-expect-error — react-dom/client n'a pas de types dédiés ici (@types/react-dom absent) ; aucune dépendance ajoutée.
import { createRoot as createRootUntyped } from 'react-dom/client';
import { useMascotReactions, type MascotController } from './useMascotReactions';
import type { CharacterId } from './types';

type Root = { render(children: unknown): void; unmount(): void };
const createRoot = createRootUntyped as (container: Element | DocumentFragment) => Root;

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
// Dernier contrôleur rendu — capturé dans un effet (jamais réassigné pendant le rendu).
let ctrl: MascotController;

function Harness({ guide }: { guide?: CharacterId }) {
  const controller = useMascotReactions(guide);
  useEffect(() => {
    ctrl = controller;
  });
  return createElement('span', null, controller.reaction?.state ?? 'idle');
}

function mount(guide?: CharacterId) {
  act(() => {
    root = createRoot(container);
    root.render(createElement(Harness, { guide }));
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('useMascotReactions — contrôleur branché (intégration react-dom)', () => {
  it('emit(answer_correct) met à jour la réaction dominante + le texte pédagogique', () => {
    mount();
    act(() => ctrl.emit({ type: 'answer_correct' }, 'Bien vu !'));
    expect(ctrl.reaction?.state).toBe('celebrate-small');
    expect(ctrl.reaction?.character).toBe('toto');
    expect(ctrl.speech).toBe('Bien vu !');
  });

  it('revient réellement à idle après la durée de l’état (timer réel)', () => {
    mount();
    act(() => ctrl.emit({ type: 'answer_correct' })); // celebrate-small : 550 ms
    expect(ctrl.reaction?.state).toBe('celebrate-small');
    act(() => { jest.advanceTimersByTime(549); });
    expect(ctrl.reaction?.state).toBe('celebrate-small'); // pas encore
    act(() => { jest.advanceTimersByTime(1); });
    expect(ctrl.reaction).toBeNull(); // retour à idle
  });

  it('annule le timer de retour à idle au démontage (aucun timer orphelin)', () => {
    mount();
    act(() => ctrl.emit({ type: 'answer_correct' }));
    expect(jest.getTimerCount()).toBe(1);
    act(() => root.unmount());
    expect(jest.getTimerCount()).toBe(0); // cleanup a bien annulé le timer
    // re-monte pour que afterEach puisse démonter sans erreur
    mount();
  });

  it('offline écrase une réaction moins prioritaire (contrôleur, pas juste la fonction pure)', () => {
    mount();
    act(() => ctrl.emit({ type: 'answer_correct' }));
    act(() => ctrl.emit({ type: 'offline_detected' }, 'Hors ligne : tout est local.'));
    expect(ctrl.reaction?.state).toBe('offline');
    expect(ctrl.reaction?.character).toBe('bobo');
    expect(ctrl.speech).toBe('Hors ligne : tout est local.');
  });

  it('une réaction NON interruptible n’est pas remplacée par une moins prioritaire', () => {
    mount();
    act(() => ctrl.emit({ type: 'checkpoint_completed', passed: true })); // celebrate-big, non interruptible
    act(() => ctrl.emit({ type: 'answer_correct' })); // moindre priorité
    expect(ctrl.reaction?.state).toBe('celebrate-big');
  });

  it('le guide choisi porte un moment neutre (introduction)', () => {
    mount('bobo');
    act(() => ctrl.emit({ type: 'lesson_started' }, 'On commence.'));
    expect(ctrl.reaction?.state).toBe('welcome');
    expect(ctrl.reaction?.character).toBe('bobo'); // guide porté sur l'état neutre
  });

  it('la navigation n’est jamais bloquée : emit est synchrone et sans await', () => {
    mount();
    let threw = false;
    try {
      act(() => {
        for (let i = 0; i < 5; i++) ctrl.emit({ type: 'answer_correct' });
      });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(ctrl.reaction?.state).toBe('celebrate-small');
  });
});
