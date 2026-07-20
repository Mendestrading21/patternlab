/**
 * Carte de parcours immersive — logique pure et testable.
 * Construit les nœuds d'un monde : compétences ordonnées + un checkpoint de fin de
 * module. Statuts dérivés de la progression réelle (terminé / courant / dû / verrouillé).
 */
import type { ProgressState } from './repositories';
import type { Skill } from '../engines/learning';
import { isDue } from '../engines/learning';
import { CHECKPOINT_ID, CHECKPOINT_TITLE } from './seed';

export type NodeStatus = 'done' | 'current' | 'due' | 'locked';
export type NodeKind = 'skill' | 'checkpoint';

export interface MapNode {
  id: string;
  kind: NodeKind;
  title: string;
  index: number;
  status: NodeStatus;
}

export interface WorldMap {
  worldTitle: string;
  moduleTitle: string;
  nodes: MapNode[];
  completed: number;
  total: number;
}

/**
 * Construit la carte.
 * - une compétence terminée est `due` si sa révision est échue, sinon `done` ;
 * - la première compétence non terminée est `current`, les suivantes `locked` ;
 * - le checkpoint est `locked` tant que toutes les compétences ne sont pas terminées,
 *   puis `current`, puis `done` une fois réalisé.
 */
export function buildWorldMap(
  state: ProgressState,
  skills: Skill[],
  moduleTitle: string,
  now: number,
): WorldMap {
  const firstIncomplete = skills.findIndex((s) => !state.completedSkills.includes(s.id));

  const nodes: MapNode[] = skills.map((s, i) => {
    let status: NodeStatus;
    if (state.completedSkills.includes(s.id)) {
      status = state.skills[s.id] && isDue(state.skills[s.id].review, now) ? 'due' : 'done';
    } else if (firstIncomplete === i) {
      status = 'current';
    } else {
      status = 'locked';
    }
    return { id: s.id, kind: 'skill', title: s.name, index: i, status };
  });

  const allSkillsDone = skills.length > 0 && skills.every((s) => state.completedSkills.includes(s.id));
  const checkpointDone = state.completedSkills.includes(CHECKPOINT_ID);
  const checkpointStatus: NodeStatus = checkpointDone ? 'done' : allSkillsDone ? 'current' : 'locked';
  nodes.push({
    id: CHECKPOINT_ID,
    kind: 'checkpoint',
    title: CHECKPOINT_TITLE,
    index: skills.length,
    status: checkpointStatus,
  });

  const completed = nodes.filter((n) => n.status === 'done' || n.status === 'due').length;
  return { worldTitle: 'Monde 1 · Fondations', moduleTitle, nodes, completed, total: nodes.length };
}
