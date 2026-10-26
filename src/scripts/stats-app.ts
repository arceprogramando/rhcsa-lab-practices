import { difficultyLabel, getUI, pageLocale, routePath, type RouteId } from "../lib/i18n";
import { labById } from "../lib/labs";
import {
  aggregates,
  clearStore,
  countedLabs,
  deleteRun,
  filterRuns,
  isHard,
  loadStore,
  wallSec,
  type ExamMode,
  type Run,
} from "../lib/storage";
import { deltaLabel, formatClock, formatDelta, formatShort, formatWhen } from "../lib/time";

function copy() {
  return getUI(pageLocale());
}

function to(route: RouteId): string {
  return routePath(pageLocale(), route);
}

function readMode(): ExamMode {
  const raw = new URLSearchParams(location.search).get("mode");
  return raw === "pausable" ? "pausable" : "fixed";
}

function modeHref(mode: ExamMode): string {
  return `${to("stats")}?mode=${mode}`;
}

export function mountStats(host: HTMLElement): void {
  host.replaceChildren(view());
}

function view(): HTMLElement {
  const mode = readMode();
  const store = filterRuns(loadStore(), mode);
  const page = el("div", "flex flex-col gap-6 pb-12");
  page.append(modeTabs(mode));

  if (store.runs.length === 0) {
    page.append(empty(mode));
    return page;
  }

  const comparable = store.runs
    .filter((run) => run.status === "completed" || run.status === "timed_out")
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const latest = comparable.at(-1);
  const previous = comparable.at(-2);
  const delta = latest && previous ? wallSec(latest) - wallSec(previous) : null;

  const runs = store.runs.slice().sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  page.append(headline(delta, latest, previous, mode), totals(store.runs), labTable(mode), history(runs), tools());
  return page;
}

function modeTabs(mode: ExamMode): HTMLElement {
  const ui = copy();
  const row = el("div", "flex flex-col gap-2 sm:flex-row sm:flex-wrap");
  row.append(
    link(
      modeHref("fixed"),
      ui.statsModeFixed,
      mode === "fixed" ? "btn btn-primary" : "btn btn-quiet",
    ),
    link(
      modeHref("pausable"),
      ui.statsModePausable,
      mode === "pausable" ? "btn btn-primary" : "btn btn-quiet",
    ),
  );
  return row;
}

function headline(
  delta: number | null,
  latest: Run | undefined,
  previous: Run | undefined,
  mode: ExamMode,
): HTMLElement {
  const card = el(
    "section",
    mode === "fixed"
      ? "rounded-3xl border-2 border-ink bg-card p-6 sm:p-8"
      : "rounded-3xl border border-line bg-card p-6 sm:p-8",
  );
  const ui = copy();
  const locale = pageLocale();
  card.append(
    el(
      "p",
      "text-xs font-semibold tracking-[0.16em] text-muted uppercase",
      mode === "fixed" ? ui.improvementFixed : ui.statsModePausable,
    ),
  );
  if (!latest) {
    card.append(
      el("h1", "mt-2 text-3xl font-semibold tracking-tight", ui.noClosed),
      el("p", "mt-3 text-muted", ui.noClosedBody),
    );
    return card;
  }
  if (delta == null || !previous) {
    card.append(
      el("h1", "stat-value mt-2 text-4xl font-semibold", formatClock(wallSec(latest))),
      el("p", "mt-3 text-lg", ui.firstExam),
    );
    return card;
  }
  const faster = delta < -5;
  card.append(
    el(
      "h1",
      `stat-value mt-2 text-4xl font-semibold ${faster ? "text-good" : delta > 5 ? "text-bad" : "text-ink"}`,
      formatDelta(delta, locale),
    ),
    el("p", "mt-3 text-lg", `${deltaLabel(delta, locale)} ${ui.fasterThan(formatWhen(previous.startedAt, locale))}`),
    el("p", "mt-2 text-sm text-muted", ui.lastVsPrev(formatClock(wallSec(latest)), formatClock(wallSec(previous)))),
  );
  return card;
}

function totals(runs: Run[]): HTMLElement {
  const help = runs.reduce((sum, run) => sum + countedLabs(run.labs, run.edition).filter((lab) => lab.usedHelp).length, 0);
  const skipped = runs.reduce((sum, run) => sum + countedLabs(run.labs, run.edition).filter((lab) => lab.status === "skipped").length, 0);
  const done = runs.reduce((sum, run) => sum + countedLabs(run.labs, run.edition).filter((lab) => lab.status === "done").length, 0);
  const finished = runs.filter((run) => run.status === "completed" || run.status === "timed_out");
  const best = finished.filter((run) => run.status === "completed").sort((a, b) => wallSec(a) - wallSec(b))[0];
  const grid = el("section", "grid gap-3 sm:grid-cols-2 lg:grid-cols-5");
  grid.append(
    tile(copy().simulacros, String(runs.length)),
    tile(copy().best, best ? formatClock(wallSec(best)) : "—"),
    tile(copy().labsDone, String(done)),
    tile(copy().withHelp, String(help)),
    tile(copy().passed, String(skipped)),
  );
  return grid;
}

function tile(label: string, value: string): HTMLElement {
  const card = el("article", "rounded-3xl border border-line bg-card px-4 py-4");
  card.append(el("p", "text-sm text-muted", label), el("p", "stat-value mt-1 text-2xl font-semibold", value));
  return card;
}

function labTable(mode: ExamMode): HTMLElement {
  const rows = aggregates(loadStore(), mode);
  const section = el("section", "overflow-hidden rounded-3xl border border-line bg-card");
  section.append(el("h2", "px-5 pt-5 text-lg font-semibold", copy().byLab));
  const table = document.createElement("div");
  table.className = "mt-3 overflow-x-auto";
  const grid = document.createElement("table");
  grid.className = "w-full min-w-[720px] border-collapse text-left text-sm";
  const head = document.createElement("thead");
  const hr = document.createElement("tr");
  for (const label of copy().cols) {
    const th = document.createElement("th");
    th.className = "border-b border-line px-4 py-2 font-medium text-muted";
    th.textContent = label;
    hr.append(th);
  }
  head.append(hr);
  const body = document.createElement("tbody");
  for (const row of rows) {
    const locale = pageLocale();
    const lab = labById(row.labId, locale);
    const tr = document.createElement("tr");
    const delta = row.lastSec != null && row.prevSec != null ? row.lastSec - row.prevSec : null;
    const level = difficultyLabel(row.lastDifficulty, locale);
    const cells = [
      lab?.title ?? row.labId,
      row.lastSec == null ? "—" : formatShort(row.lastSec, locale),
      row.avgSec == null ? "—" : formatShort(row.avgSec, locale),
      row.bestSec == null ? "—" : formatShort(row.bestSec, locale),
      delta == null ? "—" : `${formatDelta(delta, locale)} · ${deltaLabel(delta, locale)}`,
      level ? (isHard(row.lastDifficulty) ? `${level}, ${copy().redoCell}` : level) : "—",
      row.samples ? `${row.help}/${row.samples}` : "—",
    ];
    cells.forEach((text, index) => {
      const td = document.createElement("td");
      td.className = `border-b border-line px-4 py-3 ${index === 0 ? "font-medium" : index === 5 ? "" : "stat-value"} ${
        index === 4 && delta != null && delta < -5 ? "text-good" : index === 4 && delta != null && delta > 5 ? "text-bad" : ""
      } ${index === 5 && isHard(row.lastDifficulty) ? "font-medium text-warn" : ""}`;
      td.textContent = text;
      tr.append(td);
    });
    const note = document.createElement("td");
    note.className = "hidden";
    if (row.skipped) note.textContent = `${row.skipped} ${copy().passed.toLowerCase()}`;
    tr.append(note);
    body.append(tr);
  }
  grid.append(head, body);
  table.append(grid);
  const note = el("p", "px-5 py-4 text-sm text-muted", copy().statsNote);
  section.append(table, note);
  return section;
}

function history(runs: Run[]): HTMLElement {
  const section = el("section", "rounded-3xl border border-line bg-card p-5");
  section.append(el("h2", "text-lg font-semibold", copy().history));
  if (runs.length === 0) {
    section.append(el("p", "mt-2 text-sm text-muted", copy().historyEmpty));
    return section;
  }
  const list = el("ul", "mt-3 divide-y divide-line");
  for (const run of runs) {
    const scored = countedLabs(run.labs, run.edition);
    const done = scored.filter((lab) => lab.status === "done").length;
    const revisit = scored.filter((lab) => lab.status === "revisit").length;
    const redo = scored.filter((lab) => lab.status === "done" && isHard(lab.difficulty)).length;
    const skipped = scored.filter((lab) => lab.status === "skipped").length;
    const help = scored.filter((lab) => lab.usedHelp).length;
    const li = el("li", "flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between");
    const text = el("div");
    text.append(
      el("p", "font-medium", `${formatWhen(run.startedAt, pageLocale())} · ${statusLabel(run.status)}`),
      el(
        "p",
        "stat-value text-sm text-muted",
        `${formatClock(wallSec(run))} · ${copy().tally({ done, revisit, redo, skipped, help })}`,
      ),
    );
    const remove = button(copy().delete, "btn btn-quiet");
    remove.addEventListener("click", () => {
      const which = run.status === "in_progress" ? copy().thisRunning : copy().thisSaved;
      if (!confirm(copy().confirmDeleteNamed(which))) return;
      deleteRun(run.id);
      const host = document.getElementById("stats-root");
      if (host) mountStats(host);
    });
    li.append(text, remove);
    list.append(li);
  }
  section.append(list);
  return section;
}

function tools(): HTMLElement {
  const row = el("div", "flex flex-col gap-3 sm:flex-row");
  const download = button(copy().download, "btn btn-quiet");
  download.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(loadStore(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rhcsa-practica-arceprog.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  const wipe = button(copy().wipe, "btn btn-quiet");
  wipe.addEventListener("click", () => {
    if (!confirm(copy().confirmWipe)) return;
    clearStore();
    const host = document.getElementById("stats-root");
    if (host) mountStats(host);
  });
  row.append(download, wipe);
  return row;
}

function empty(mode: ExamMode): HTMLElement {
  const card = el("section", "rounded-3xl border border-line bg-card p-6 sm:p-8");
  const ui = copy();
  card.append(
    el("h1", "text-3xl font-semibold tracking-tight", ui.noTimes),
    el(
      "p",
      "mt-3 text-muted",
      mode === "fixed" ? `${ui.noTimesBody} ${ui.startFixedHint}` : ui.noTimesBody,
    ),
    link(to("home"), ui.goHome, "btn btn-primary mt-6"),
  );
  return card;
}

function statusLabel(status: Run["status"]): string {
  const ui = copy();
  if (status === "completed") return ui.closed;
  if (status === "timed_out") return ui.timedOut;
  if (status === "abandoned") return ui.abandoned;
  return ui.inProgress;
}

function el(tag: string, className = "", text = ""): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(text: string, className: string): HTMLButtonElement {
  const node = document.createElement("button");
  node.type = "button";
  node.className = className;
  node.textContent = text;
  return node;
}

function link(href: string, text: string, className = ""): HTMLAnchorElement {
  const node = document.createElement("a");
  node.href = href;
  node.className = className;
  node.textContent = text;
  return node;
}
