// engine.js — scene loader + effects
import { getState, setState } from "./gameState.js";

async function loadSceneDef(id) {
  const res = await fetch(`./content/${id}.json`);
  if (!res.ok) throw new Error(`Scene not found: ${id}`);
  return res.json();
}

function applyEffects(state, fx = {}) {
  const next = structuredClone(state);
  if (fx["redThread.inc"]) next.redThread += Number(fx["redThread.inc"]);
  if (fx["pulsewheel.set"]) next.pulsewheel = fx["pulsewheel.set"];
  if (fx["sigils.set"]) Object.assign(next.sigils, fx["sigils.set"]);
  if (fx["flags.set"]) Object.assign(next.flags, fx["flags.set"]);
  if (fx["loveIndex.inc"]) {
    for (const [k,v] of Object.entries(fx["loveIndex.inc"])) {
      next.loveIndex.max[k] = (next.loveIndex.max[k]||0) + Number(v);
    }
  }
  return next;
}

export const eidra = {
  async load_scene({sessionId, sceneId}) {
    const state = getState(sessionId);
    const id = sceneId || state.scene;
    const scene = await loadSceneDef(id);
    return { scene, state };
  },

  async choose({sessionId, choiceId}) {
    const st = getState(sessionId);
    const scene = await loadSceneDef(st.scene);
    const c = scene.choices.find(x => x.id === choiceId);
    if (!c) throw new Error("Choice not found: " + choiceId);
    const next = applyEffects(st, c.effects);
    next.scene = c.target;
    setState(sessionId, next);
    const nextScene = await loadSceneDef(next.scene);
    return { scene: nextScene, state: next };
  },

  async wait({sessionId}) {
    const st = getState(sessionId);
    const scene = await loadSceneDef(st.scene);
    if (!scene.wait) return { scene, state: st };
    const next = applyEffects(st, scene.wait.effects);
    next.scene = scene.wait.target;
    setState(sessionId, next);
    const nextScene = await loadSceneDef(next.scene);
    return { scene: nextScene, state: next };
  }
};
