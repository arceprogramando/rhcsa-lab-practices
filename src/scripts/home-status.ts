import { getUI, pageLocale, routePath } from "../lib/i18n";
import { loadEdition, saveEdition, type Edition } from "../lib/labs";
import {
  activeRun,
  closedRuns,
  countedLabs,
  filterRuns,
  isHard,
  loadStore,
  startRun,
  wallSec,
  type ExamMode,
  type Store,
} from "../lib/storage";
import { deltaLabel, formatClock, formatDelta, formatWhen } from "../lib/time";

export function mountHome(): void {
  const pausable = document.getElementById("start-pausable");
  const fixed = document.getElementById("start-fixed");
  const resume = document.getElementById("resume-exam");
  const resumeWrap = document.getElementById("resume-wrap");
  const startLabel = document.getElementById("start-modes-label");
  const startHints = document.getElementById("start-hints");
  const editionNext = document.getElementById("edition-next");
  const note = document.getElementById("start-note");
  const running = activeRun();
  const ui = getUI(pageLocale());
  const locale = pageLocale();

  if (running && resume && resumeWrap) {
    resumeWrap.classList.remove("hidden");
    if (startLabel) startLabel.hidden = true;
    if (startHints) startHints.hidden = true;
    if (editionNext) editionNext.classList.remove("hidden");
    resume.addEventListener("click", () => {
      location.href = routePath(pageLocale(), "practice");
    });
    if (note) {
      const when = formatWhen(running.startedAt, locale);
      note.textContent = running.pausedAt
        ? ui.startedPausedNote(when)
        : running.mode === "fixed"
          ? ui.startedNote(when)
          : ui.startedPausableNote(when);
    }
  }
  if (pausable) {
    pausable.hidden = Boolean(running);
    pausable.textContent = ui.startPausable;
    pausable.addEventListener("click", () => {
      if (activeRun()) return;
      startRun("pausable", loadEdition());
      location.href = routePath(locale, "practice");
    });
  }
  if (fixed) {
    fixed.hidden = Boolean(running);
    fixed.textContent = ui.startFixed;
    fixed.addEventListener("click", () => {
      if (activeRun()) return;
      startRun("fixed", loadEdition());
      location.href = routePath(locale, "practice");
    });
  }

  paintEdition(loadEdition());

  const store = loadStore();
  fillModeSummary(store, "fixed", "stat-fixed");
  fillModeSummary(store, "pausable", "stat-pausable");
  fillDelta(store, "fixed", "stat-delta-fixed");
  fillDelta(store, "pausable", "stat-delta-pausable");

  const last = closedRuns(store)[0];
  const lastBox = document.getElementById("last-run");
  if (!lastBox || !last) return;
  lastBox.classList.remove("hidden");
  const when = lastBox.querySelector("[data-when]");
  const detail = lastBox.querySelector("[data-detail]");
  if (when) when.textContent = formatWhen(last.startedAt, locale);
  if (detail) {
    const scored = countedLabs(last.labs, last.edition);
    const done = scored.filter((lab) => lab.status === "done").length;
    const revisit = scored.filter((lab) => lab.status === "revisit").length;
    const passed = scored.filter((lab) => lab.status === "skipped").length;
    const asked = scored.filter((lab) => lab.usedHelp).length;
    const redo = scored.filter((lab) => lab.status === "done" && isHard(lab.difficulty)).length;
    const modeLabel = last.mode === "fixed" ? ui.seeStatsFixed : ui.seeStatsPausable;
    detail.textContent = `${modeLabel} · ${formatClock(wallSec(last))} · ${ui.tally({ done, revisit, redo, skipped: passed, help: asked })}`;
  }
}

function paintEdition(edition: Edition): void {
  for (const id of ["v10", "v9"] as const) {
    const button = document.getElementById(`edition-${id}`);
    if (!button) continue;
    const on = edition === id;
    button.classList.toggle("is-on", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
    button.onclick = () => {
      saveEdition(id);
      paintEdition(id);
    };
  }
}

function fillModeSummary(store: Store, mode: ExamMode, prefix: string): void {
  const scoped = filterRuns(store, mode);
  const comparable = scoped.runs
    .filter((run) => run.status === "completed" || run.status === "timed_out")
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const best = comparable.filter((run) => run.status === "completed").sort((a, b) => wallSec(a) - wallSec(b))[0];
  const help = scoped.runs.reduce((sum, run) => sum + countedLabs(run.labs, run.edition).filter((lab) => lab.usedHelp).length, 0);
  const skipped = scoped.runs.reduce(
    (sum, run) => sum + countedLabs(run.labs, run.edition).filter((lab) => lab.status === "skipped").length,
    0,
  );

  setText(`${prefix}-runs`, String(scoped.runs.length));
  setText(`${prefix}-best`, best ? formatClock(wallSec(best)) : "—");
  setText(`${prefix}-help`, String(help));
  setText(`${prefix}-skip`, String(skipped));
}

function fillDelta(store: Store, mode: ExamMode, id: string): void {
  const ui = getUI(pageLocale());
  const locale = pageLocale();
  const scoped = filterRuns(store, mode);
  const comparable = scoped.runs
    .filter((run) => run.status === "completed" || run.status === "timed_out")
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const latest = comparable.at(-1);
  const previous = comparable.at(-2);
  const delta = document.getElementById(id);
  if (!delta) return;
  if (latest && previous) {
    const diff = wallSec(latest) - wallSec(previous);
    delta.textContent = ui.deltaLine(formatDelta(diff, locale), deltaLabel(diff, locale));
  } else if (latest) {
    delta.textContent = ui.firstClose(formatClock(wallSec(latest)));
  } else if (scoped.runs.length > 0) {
    delta.textContent = ui.openRun;
  } else {
    delta.textContent = ui.noCloseYet;
  }
}

function setText(id: string, value: string): void {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}
