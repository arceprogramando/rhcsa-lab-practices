import { LABS, isOffEdition, type Edition } from "./labs";
import { EXAM_LIMIT_SEC } from "./time";

export const STORAGE_KEY = "arceprog:rhcsa-exam:v1";

export type LabStatus = "pending" | "done" | "revisit" | "skipped" | "redo";
export type RunStatus = "in_progress" | "completed" | "timed_out" | "abandoned";
export type ExtrasChoice = "pending" | "continue" | "stop";
export type Difficulty = "very_low" | "low" | "normal" | "high" | "very_high";
export type ExamMode = "pausable" | "fixed";

export function isHard(value: Difficulty | null | undefined): boolean {
  return value === "high" || value === "very_high";
}

export interface LabRecord {
  labId: string;
  startedAt: string | null;
  finishedAt: string | null;
  durationSec: number | null;
  status: LabStatus;
  usedHelp: boolean;
  attempts: number;
  difficulty: Difficulty | null;
}

export interface Run {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  globalLimitSec: number;
  mode: ExamMode;
  /** v10 = Flatpak in the main list. Missing on older runs means v9. */
  edition?: Edition;
  pausedAt: string | null;
  pausedSec: number;
  status: RunStatus;
  currentIndex: number;
  extrasChoice: ExtrasChoice;
  labs: LabRecord[];
}

export interface Store {
  runs: Run[];
}

export function loadStore(): Store {
  if (typeof localStorage === "undefined") return { runs: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { runs: [] };
    const data = JSON.parse(raw) as Store;
    if (!data || !Array.isArray(data.runs)) return { runs: [] };
    for (const run of data.runs) alignRun(run);
    return data;
  } catch {
    return { runs: [] };
  }
}

export function saveStore(store: Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

const SETUP_IDS = new Set(LABS.filter((lab) => lab.track === "setup").map((lab) => lab.id));

export function countedLabs(labs: LabRecord[], edition?: Edition): LabRecord[] {
  return labs.filter((lab) => !SETUP_IDS.has(lab.labId) && !(edition && isOffEdition(lab.labId, edition)));
}

export function activeRun(store: Store = loadStore()): Run | undefined {
  return store.runs.find((run) => run.status === "in_progress");
}

function activeSec(run: Run, now: number): number {
  const pausedAt = run.pausedAt ? Date.parse(run.pausedAt) : null;
  const end = run.finishedAt ? Date.parse(run.finishedAt) : (pausedAt ?? now);
  const elapsed = (end - Date.parse(run.startedAt)) / 1000 - (run.pausedSec ?? 0);
  return Math.max(0, elapsed);
}

export function remainingSec(run: Run, now = Date.now()): number {
  return Math.max(0, run.globalLimitSec - activeSec(run, now));
}

export function wallSec(run: Run, now = Date.now()): number {
  return Math.min(run.globalLimitSec, activeSec(run, now));
}

function alignRun(run: Run): void {
  if (run.mode !== "fixed" && run.mode !== "pausable") run.mode = "pausable";
  if (run.edition !== "v10" && run.edition !== "v9") run.edition = "v9";
  if (typeof run.pausedSec !== "number") run.pausedSec = 0;
  if (!run.pausedAt) run.pausedAt = null;
  if (!Array.isArray(run.labs)) {
    run.labs = LABS.map((lab) => blankLab(lab.id));
    run.currentIndex = 0;
    return;
  }
  const currentId = run.labs[run.currentIndex]?.labId ?? null;
  const byId = new Map(run.labs.map((lab) => [lab.labId, lab]));
  run.labs = LABS.map((lab) => byId.get(lab.id) ?? blankLab(lab.id));
  if (!currentId) return;
  const next = run.labs.findIndex((lab) => lab.labId === currentId);
  if (next >= 0) run.currentIndex = next;
}

function blankLab(labId: string): LabRecord {
  return {
    labId,
    startedAt: null,
    finishedAt: null,
    durationSec: null,
    status: "pending",
    usedHelp: false,
    attempts: 0,
    difficulty: null,
  };
}

export function startRun(mode: ExamMode = "fixed", edition: Edition = "v10"): Run {
  const store = loadStore();
  const nowIso = new Date().toISOString();
  for (const run of store.runs) {
    if (run.status === "in_progress") {
      if (run.pausedAt) {
        run.pausedSec += Math.max(0, (Date.parse(nowIso) - Date.parse(run.pausedAt)) / 1000);
        run.pausedAt = null;
      }
      run.status = "abandoned";
      run.finishedAt = nowIso;
    }
  }
  const run: Run = {
    id: crypto.randomUUID(),
    startedAt: nowIso,
    finishedAt: null,
    globalLimitSec: EXAM_LIMIT_SEC,
    mode,
    edition,
    pausedAt: null,
    pausedSec: 0,
    status: "in_progress",
    currentIndex: 0,
    extrasChoice: "pending",
    labs: LABS.map((lab) => blankLab(lab.id)),
  };
  store.runs.push(run);
  saveStore(store);
  return run;
}

/** Puts an abandoned run back in progress. Another open run goes to the history. Time spent abandoned does not count on the clock. */
export function reopenRun(id: string): void {
  const store = loadStore();
  const target = store.runs.find((run) => run.id === id);
  if (!target || target.status !== "abandoned") return;
  const nowIso = new Date().toISOString();
  for (const run of store.runs) {
    if (run.id === id || run.status !== "in_progress") continue;
    if (run.pausedAt) {
      run.pausedSec += Math.max(0, (Date.parse(nowIso) - Date.parse(run.pausedAt)) / 1000);
      run.pausedAt = null;
    }
    run.status = "abandoned";
    run.finishedAt = nowIso;
  }
  if (target.finishedAt) {
    target.pausedSec += Math.max(0, (Date.parse(nowIso) - Date.parse(target.finishedAt)) / 1000);
  }
  target.status = "in_progress";
  target.finishedAt = null;
  saveStore(store);
}

export function replaceRun(next: Run): void {
  const store = loadStore();
  const index = store.runs.findIndex((run) => run.id === next.id);
  if (index === -1) store.runs.push(next);
  else store.runs[index] = next;
  saveStore(store);
}

export function clearStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteRun(id: string): void {
  const store = loadStore();
  store.runs = store.runs.filter((run) => run.id !== id);
  saveStore(store);
}

export interface LabAggregate {
  labId: string;
  samples: number;
  done: number;
  skipped: number;
  help: number;
  avgSec: number | null;
  bestSec: number | null;
  lastSec: number | null;
  prevSec: number | null;
  lastDifficulty: Difficulty | null;
}

export function filterRuns(store: Store, mode?: ExamMode): Store {
  if (!mode) return store;
  return { runs: store.runs.filter((run) => run.mode === mode) };
}

export function finishedSamples(store: Store, labId: string): LabRecord[] {
  return store.runs
    .slice()
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt))
    .flatMap((run) => run.labs)
    .filter(
      (lab) =>
        lab.labId === labId &&
        lab.durationSec != null &&
        (lab.status === "done" || lab.status === "skipped"),
    );
}

export function aggregates(store: Store, mode?: ExamMode): LabAggregate[] {
  const scoped = filterRuns(store, mode);
  return LABS.filter((lab) => lab.track !== "setup").map((lab) => {
    const samples = finishedSamples(scoped, lab.id);
    const durations = samples.map((sample) => sample.durationSec ?? 0);
    const last = samples.at(-1);
    const prev = samples.at(-2);
    const lastDone = [...samples].reverse().find((sample) => sample.status === "done");
    const sum = durations.reduce((acc, n) => acc + n, 0);
    return {
      labId: lab.id,
      samples: samples.length,
      done: samples.filter((sample) => sample.status === "done").length,
      skipped: samples.filter((sample) => sample.status === "skipped").length,
      help: samples.filter((sample) => sample.usedHelp).length,
      avgSec: durations.length ? sum / durations.length : null,
      bestSec: durations.length ? Math.min(...durations) : null,
      lastSec: last?.durationSec ?? null,
      prevSec: prev?.durationSec ?? null,
      lastDifficulty: lastDone?.difficulty ?? null,
    };
  });
}

export function closedRuns(store: Store): Run[] {
  return store.runs
    .filter((run) => run.status !== "in_progress")
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
}
