import { getUI, localePath, pageLocale } from "../lib/i18n";
import { activeRun, closedRuns, countedLabs, isHard, loadStore, startRun, wallSec } from "../lib/storage";
import { deltaLabel, formatClock, formatDelta, formatWhen } from "../lib/time";

export function mountHome(): void {
  const pausable = document.getElementById("start-pausable");
  const fixed = document.getElementById("start-fixed");
  const resume = document.getElementById("resume-exam");
  const note = document.getElementById("start-note");
  const running = activeRun();
  const ui = getUI(pageLocale());
  const locale = pageLocale();

  if (running && resume) {
    resume.classList.remove("hidden");
    resume.classList.remove("btn-quiet");
    resume.classList.add("btn-primary");
    pausable?.classList.remove("btn-primary");
    pausable?.classList.add("btn-quiet");
    resume.addEventListener("click", () => {
      location.href = localePath(pageLocale(), "/simulacro/");
    });
  }
  if (pausable) {
    pausable.textContent = running ? ui.startPausableAnother : ui.startPausable;
    pausable.addEventListener("click", () => {
      if (running && !confirm(ui.confirmReplace)) return;
      startRun("pausable");
      location.href = localePath(locale, "/simulacro/");
    });
  }
  if (fixed) {
    fixed.textContent = running ? ui.startFixedAnother : ui.startFixed;
    fixed.addEventListener("click", () => {
      if (running && !confirm(ui.confirmReplace)) return;
      startRun("fixed");
      location.href = localePath(locale, "/simulacro/");
    });
  }
  if (note && running) {
    const when = formatWhen(running.startedAt, locale);
    note.textContent = running.pausedAt
      ? ui.startedPausedNote(when)
      : running.mode === "fixed"
        ? ui.startedNote(when)
        : ui.startedPausableNote(when);
  }

  const store = loadStore();
  const comparable = store.runs
    .filter((run) => run.status === "completed" || run.status === "timed_out")
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const latest = comparable.at(-1);
  const previous = comparable.at(-2);
  const best = comparable.filter((run) => run.status === "completed").sort((a, b) => wallSec(a) - wallSec(b))[0];
  const help = store.runs.reduce((sum, run) => sum + countedLabs(run.labs).filter((lab) => lab.usedHelp).length, 0);
  const skipped = store.runs.reduce((sum, run) => sum + countedLabs(run.labs).filter((lab) => lab.status === "skipped").length, 0);

  setText("stat-runs", String(store.runs.length));
  setText("stat-best", best ? formatClock(wallSec(best)) : "—");
  setText("stat-help", String(help));
  setText("stat-skip", String(skipped));

  const delta = document.getElementById("stat-delta");
  if (!delta) return;
  if (latest && previous) {
    const diff = wallSec(latest) - wallSec(previous);
    delta.textContent = ui.deltaLine(formatDelta(diff, locale), deltaLabel(diff, locale));
  } else if (latest) {
    delta.textContent = ui.firstClose(formatClock(wallSec(latest)));
  } else if (store.runs.length > 0) {
    delta.textContent = ui.openRun;
  } else {
    delta.textContent = ui.noCloseYet;
  }

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
    detail.textContent = `${formatClock(wallSec(last))} · ${ui.tally({ done, revisit, redo, skipped: passed, help: asked })}`;
  }
}

function setText(id: string, value: string): void {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}
