import { domainCoverage, overallPercent, type CoverageKind, type DomainScore } from "../lib/coverage";
import { difficultyLabel, getUI, pageLocale, routePath, type Locale, type RouteId } from "../lib/i18n";
import { labById, loadEdition } from "../lib/labs";
import {
  aggregates,
  clearStore,
  countedLabs,
  deleteRun,
  filterRuns,
  isHard,
  activeRun,
  loadStore,
  PAUSABLE_ENABLED,
  reopenRun,
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
  page.append(modeTabs(mode), coverageCard(store.runs));

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
  const row = el("div", "choice");
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", ui.statsHeading);
  const fixed = link(
    modeHref("fixed"),
    ui.statsModeFixed,
    mode === "fixed" ? "choice-option is-on" : "choice-option",
  );
  const pausable = link(
    modeHref("pausable"),
    ui.statsModePausable,
    mode === "pausable" ? "choice-option is-on" : "choice-option",
  );
  (mode === "fixed" ? fixed : pausable).setAttribute("aria-current", "page");
  row.append(fixed, pausable);
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

function coverageCard(runs: Run[]): HTMLElement {
  const ui = copy();
  const locale = pageLocale();
  const domains = domainCoverage(runs, loadEdition());
  const overall = overallPercent(domains);
  const section = el("section", "rounded-3xl border border-line bg-card p-5 sm:p-6");
  section.append(
    el("h2", "text-lg font-semibold", ui.coverageTitle),
    el("p", "mt-2 max-w-2xl text-sm text-muted", ui.coverageLead),
    el("p", "mt-2 text-sm font-medium", gapLine(domains, locale)),
  );
  const layout = el("div", "mt-5 grid items-center gap-6 lg:grid-cols-[minmax(260px,380px)_1fr]");
  layout.append(radialBars(domains, overall), domainList(domains));
  section.append(layout, el("p", "mt-5 text-sm text-muted", ui.coverageNote));
  return section;
}

function gapLine(domains: DomainScore[], locale: Locale): string {
  const ui = copy();
  const order = new Map(domains.map((domain, index) => [domain.id, index]));
  const sorted = domains.slice().sort((a, b) => a.percent - b.percent || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  if (sorted.every((domain) => domain.percent >= 100)) return ui.coverageSolid;
  if (sorted.every((domain) => domain.percent === 0)) return ui.coverageNone;
  const floor = sorted[0]?.percent ?? 0;
  const names = sorted
    .filter((domain) => domain.percent === floor)
    .slice(0, 3)
    .map((domain) => ui.domainName[domain.id] ?? domain.id);
  return ui.coverageGap(joinNames(names, locale));
}

function joinNames(names: string[], locale: Locale): string {
  if (names.length <= 1) return names[0] ?? "";
  const and = locale === "en" ? " and " : " y ";
  if (names.length === 2) return names.join(and);
  return `${names.slice(0, -1).join(", ")}${and}${names.at(-1)}`;
}

function radialBars(domains: DomainScore[], overall: number): SVGSVGElement {
  const ui = copy();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 560 560");
  svg.setAttribute("role", "img");
  svg.classList.add("mx-auto", "w-full", "max-w-[420px]");
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = `${ui.coverageTitle}. ${overall}%`;
  svg.append(title);

  const cx = 280;
  const cy = 280;
  const inner = 78;
  const outer = 168;
  const sweep = (Math.PI * 2) / domains.length;
  const bar = sweep * 0.72;

  domains.forEach((domain, index) => {
    const mid = -Math.PI / 2 + index * sweep;
    const a0 = mid - bar / 2;
    const a1 = mid + bar / 2;
    const track = document.createElementNS("http://www.w3.org/2000/svg", "path");
    track.setAttribute("d", ring(cx, cy, inner, outer, a0, a1));
    track.setAttribute("fill", "#e4e0d6");
    svg.append(track);
    if (domain.percent > 0) {
      const reach = inner + ((outer - inner) * domain.percent) / 100;
      const fill = document.createElementNS("http://www.w3.org/2000/svg", "path");
      fill.setAttribute("d", ring(cx, cy, inner, reach, a0, a1));
      fill.setAttribute("fill", tone(domain.percent));
      svg.append(fill);
    }
    const labelR = 214;
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(cx + labelR * Math.cos(mid)));
    text.setAttribute("y", String(cy + labelR * Math.sin(mid)));
    text.setAttribute("text-anchor", anchor(mid));
    text.setAttribute("fill", "#121a2b");
    text.setAttribute("font-size", "15");
    text.setAttribute("font-family", "Figtree, Segoe UI, sans-serif");
    text.setAttribute("font-weight", "600");
    text.textContent = ui.domainShort[domain.id] ?? domain.id;
    const dy = Math.sin(mid) > 0.45 ? "0.85em" : Math.sin(mid) < -0.45 ? "-0.15em" : "0.35em";
    text.setAttribute("dy", dy);
    svg.append(text);
  });

  const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
  value.setAttribute("x", String(cx));
  value.setAttribute("y", String(cy - 4));
  value.setAttribute("text-anchor", "middle");
  value.setAttribute("fill", tone(overall));
  value.setAttribute("font-size", "32");
  value.setAttribute("font-family", "IBM Plex Mono, ui-monospace, monospace");
  value.setAttribute("font-weight", "600");
  value.textContent = `${overall}%`;
  const caption = document.createElementNS("http://www.w3.org/2000/svg", "text");
  caption.setAttribute("x", String(cx));
  caption.setAttribute("y", String(cy + 18));
  caption.setAttribute("text-anchor", "middle");
  caption.setAttribute("fill", "#5c6570");
  caption.setAttribute("font-size", "12");
  caption.setAttribute("font-family", "Figtree, Segoe UI, sans-serif");
  caption.setAttribute("letter-spacing", "0.08em");
  caption.textContent = ui.coverageCenter.toUpperCase();
  svg.append(value, caption);
  return svg;
}

function ring(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const point = (radius: number, angle: number) =>
    `${cx + radius * Math.cos(angle)} ${cy + radius * Math.sin(angle)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${point(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${point(r1, a1)} L ${point(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${point(r0, a0)} Z`;
}

function anchor(angle: number): "start" | "middle" | "end" {
  const cos = Math.cos(angle);
  if (cos > 0.4) return "start";
  if (cos < -0.4) return "end";
  return "middle";
}

function tone(percent: number): string {
  if (percent >= 80) return "#1c6b45";
  if (percent >= 40) return "#8a5a00";
  return "#8e2a2a";
}

function domainList(domains: DomainScore[]): HTMLElement {
  const ui = copy();
  const order = new Map(domains.map((domain, index) => [domain.id, index]));
  const sorted = domains
    .slice()
    .sort((a, b) => a.percent - b.percent || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  const floor = sorted[0]?.percent ?? 0;
  let opened = 0;
  const list = el("div", "flex flex-col gap-2");
  for (const domain of sorted) {
    const open = domain.percent === floor && opened < 3 && domain.percent < 100;
    if (open) opened += 1;
    const details = document.createElement("details");
    details.className = "coverage-domain rounded-2xl border border-line bg-paper px-3 py-2";
    details.open = open;
    const summary = document.createElement("summary");
    summary.className = "flex cursor-pointer items-center justify-between gap-3";
    const name = el("span", "font-medium", ui.domainName[domain.id] ?? domain.id);
    const percent = el("span", "stat-value text-sm font-semibold", `${domain.percent}%`);
    percent.style.color = domain.percent === 0 ? "#8e2a2a" : tone(domain.percent);
    summary.append(name, percent);
    const meter = el("div", "coverage-meter mt-2");
    const fill = document.createElement("span");
    fill.style.width = `${domain.percent}%`;
    fill.style.background = domain.percent === 0 ? "transparent" : tone(domain.percent);
    meter.append(fill);
    const labs = el("ul", "mt-2 mb-1 flex flex-col gap-1");
    for (const lab of domain.labs) {
      const title = labById(lab.labId, pageLocale())?.title ?? lab.labId;
      const li = el("li", "flex items-baseline justify-between gap-3 text-sm");
      li.append(el("span", "", title), el("span", "shrink-0 text-muted", kindLabel(lab.kind)));
      labs.append(li);
    }
    details.append(summary, meter, labs);
    list.append(details);
  }
  return list;
}

function kindLabel(kind: CoverageKind): string {
  const ui = copy();
  if (kind === "done") return ui.coverageDone;
  if (kind === "help") return ui.coverageHelp;
  if (kind === "revisit") return ui.coverageRevisit;
  return ui.coverageMissing;
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
    const actions = el("div", "flex flex-wrap gap-2");
    if (run.status === "abandoned") {
      const resume = button(copy().resumeAbandoned, "btn btn-primary");
      resume.addEventListener("click", () => {
        const running = activeRun();
        if (running && !confirm(copy().confirmResumeOther)) return;
        reopenRun(run.id);
        location.href = to("practice");
      });
      actions.append(resume);
    }
    const remove = button(copy().delete, "btn btn-quiet");
    remove.addEventListener("click", () => {
      const which = run.status === "in_progress" ? copy().thisRunning : copy().thisSaved;
      if (!confirm(copy().confirmDeleteNamed(which))) return;
      deleteRun(run.id);
      const host = document.getElementById("stats-root");
      if (host) mountStats(host);
    });
    actions.append(remove);
    li.append(text, actions);
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
