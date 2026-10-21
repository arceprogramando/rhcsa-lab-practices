import { getUI, pageLocale, routePath } from "../lib/i18n";
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
  const note = document.getElementById("start-note");
  const running = activeRun();
  const ui = getUI(pageLocale());
  const locale = pageLocale();

  if (running && resume && resumeWrap) {
    resumeWrap.classList.remove("hidden");
    fixed?.classList.remove("btn-primary");
    fixed?.classList.add("btn-quiet");
    if (startLabel) startLabel.textContent = ui.startAnotherLabel;
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
    pausable.textContent = running ? ui.startPausableAnother : ui.startPausable;
    pausable.addEventListener("click", () => {
      if (running && !confirm(ui.confirmReplace)) return;
      startRun("pausable");
      location.href = routePath(locale, "practice");
    });
  }
  if (fixed) {
    fixed.textContent = running ? ui.startFixedAnother : ui.startFixed;
    fixed.addEventListener("click", () => {
      if (running && !confirm(ui.confirmReplace)) return;
      startRun("fixed");
      location.href = routePath(locale, "practice");
    });
  }

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
    const scored = countedLabs(last.labs);
    const done = scored.filter((lab) => lab.status === "done").length;
    const revisit = scored.filter((lab) => lab.status === "revisit").length;
    const passed = scored.filter((lab) => lab.status === "skipped").length;
    const asked = scored.filter((lab) => lab.usedHelp).length;
    const redo = scored.filter((lab) => lab.status === "done" && isHard(lab.difficulty)).length;
    const modeLabel = last.mode === "fixed" ? ui.seeStatsFixed : ui.seeStatsPausable;
    detail.textContent = `${modeLabel} · ${formatClock(wallSec(last))} · ${ui.tally({ done, revisit, redo, skipped: passed, help: asked })}`;
  }
}

function fillModeSummary(store: Store, mode: ExamMode, prefix: string): void {
  const scoped = filterRuns(store, mode);
  const comparable = scoped.runs
    .filter((run) => run.status === "completed" || run.status === "timed_out")
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const best = comparable.filter((run) => run.status === "completed").sort((a, b) => wallSec(a) - wallSec(b))[0];
  const help = scoped.runs.reduce((sum, run) => sum + countedLabs(run.labs).filter((lab) => lab.usedHelp).length, 0);
  const skipped = scoped.runs.reduce(
    (sum, run) => sum + countedLabs(run.labs).filter((lab) => lab.status === "skipped").length,
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
