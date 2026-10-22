import { difficultyLabel, getUI, pageLocale, routePath, type RouteId } from "../lib/i18n";
import { labsFor, REDHAT_EXAM_VIDEO, type Lab, type LabCommand } from "../lib/labs";
import {
  countedLabs,
  isHard,
  loadStore,
  remainingSec,
  deleteRun,
  replaceRun,
  wallSec,
  type Difficulty,
  type LabRecord,
  type Run,
} from "../lib/storage";
import { formatClock, formatShort } from "../lib/time";
import { createCopyButton } from "./copy-btn";

function copy() {
  return getUI(pageLocale());
}

function labs(): Lab[] {
  return labsFor(pageLocale());
}

function to(route: RouteId): string {
  return routePath(pageLocale(), route);
}

let root: HTMLElement;
let runId = "";
let undoSnapshot: Run | null = null;
let undoTimer = 0;
let tickTimer = 0;
let globalClock: HTMLElement | null = null;
let labClock: HTMLElement | null = null;
let floatRoot: HTMLElement | null = null;
let floatPauseBtn: HTMLButtonElement | null = null;
let floatLabel: HTMLElement | null = null;
let expiredOnce = false;
let screen: "board" | "lab" = "board";
let visitStart: number | null = null;
let focusDifficultyIndex: number | null = null;
/** Panel de ayuda visible en la pantalla del lab. */
let helpVisible = false;
let floatX: number | null = null;
let floatY: number | null = null;

const UI_KEY = "arceprog:rhcsa-exam-ui";

function saveUi(): void {
  if (!runId || typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(
    UI_KEY,
    JSON.stringify({ runId, screen, helpVisible, floatX, floatY }),
  );
}

function loadUi(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const raw = sessionStorage.getItem(UI_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as {
      runId?: string;
      screen?: string;
      helpVisible?: boolean;
      floatX?: number | null;
      floatY?: number | null;
    };
    if (data.runId !== runId) return;
    if (data.screen === "lab" || data.screen === "board") screen = data.screen;
    helpVisible = Boolean(data.helpVisible);
    if (typeof data.floatX === "number") floatX = data.floatX;
    if (typeof data.floatY === "number") floatY = data.floatY;
  } catch {
    /* ignore */
  }
}

export function mountExam(host: HTMLElement): void {
  root = host;
  const run = loadStore().runs.find((item) => item.status === "in_progress");
  if (!run) {
    renderEmpty();
    return;
  }
  runId = run.id;
  loadUi();
  if (screen === "lab" && !run.pausedAt) visitStart = Date.now();
  expireIfNeeded();
  render();
  if (current()?.status === "in_progress") tickTimer = window.setInterval(tick, 250);
}

function current(): Run | undefined {
  return loadStore().runs.find((item) => item.id === runId);
}

function commit(next: Run): void {
  replaceRun(next);
}

function snapshot(run = current()): void {
  if (!run || run.status !== "in_progress") return;
  undoSnapshot = structuredClone(run);
  window.clearTimeout(undoTimer);
  undoTimer = window.setTimeout(() => {
    undoSnapshot = null;
    const bar = root.querySelector("[data-undo]");
    bar?.remove();
  }, 10000);
}

function expireIfNeeded(): void {
  const run = current();
  if (!run || run.status !== "in_progress" || run.pausedAt || remainingSec(run) > 0) return;
  const finishedAt = new Date(Date.parse(run.startedAt) + (run.globalLimitSec + run.pausedSec) * 1000).toISOString();
  run.status = "timed_out";
  run.finishedAt = finishedAt;
  const open = run.labs[run.currentIndex];
  if (open?.startedAt && !open.finishedAt) {
    open.durationSec = Math.max(0, (Date.parse(finishedAt) - Date.parse(open.startedAt)) / 1000);
  }
  undoSnapshot = null;
  commit(run);
}

function tick(): void {
  const run = current();
  if (!run) return;
  if (run.pausedAt) return;
  if (run.status === "in_progress" && remainingSec(run) <= 0) {
    if (expiredOnce) return;
    expiredOnce = true;
    window.clearInterval(tickTimer);
    expireIfNeeded();
    render();
    return;
  }
  if (globalClock) {
    const left = remainingSec(run);
    globalClock.textContent = formatClock(left);
    globalClock.className = `stat-value text-2xl font-semibold sm:text-3xl ${tone(left)}`;
  }
  if (labClock) {
    const record = run.labs[run.currentIndex];
    labClock.textContent = formatClock(liveLabSec(record, run.currentIndex));
  }
}

function tone(left: number): string {
  if (left <= 5 * 60) return "text-bad";
  if (left <= 30 * 60) return "text-warn";
  return "text-ink";
}

function liveLabSec(record: LabRecord | undefined, index: number): number {
  if (!record) return 0;
  const visiting = screen === "lab" && visitStart != null && current()?.currentIndex === index;
  if (visiting && visitStart != null) {
    return (record.durationSec ?? 0) + Math.max(0, (Date.now() - visitStart) / 1000);
  }
  if (record.durationSec != null) return record.durationSec;
  if (record.startedAt && !record.finishedAt) {
    return Math.max(0, (Date.now() - Date.parse(record.startedAt)) / 1000);
  }
  return 0;
}

function flushVisit(record: LabRecord | undefined): void {
  if (!record || visitStart == null) return;
  record.durationSec = (record.durationSec ?? 0) + Math.max(0, (Date.now() - visitStart) / 1000);
  visitStart = null;
}

function render(): void {
  const run = current();
  if (!run) {
    removeFloat();
    renderEmpty();
    return;
  }
  if (run.status !== "in_progress") {
    removeFloat();
    root.replaceChildren(summaryView(run));
    globalClock = null;
    labClock = null;
    return;
  }
  if (screen === "lab" && labs()[run.currentIndex]) {
    root.replaceChildren(examView(run));
    labClock = root.querySelector("[data-lab-clock]");
    syncFloat(run);
    return;
  }
  screen = "board";
  root.replaceChildren(boardView(run));
  labClock = null;
  syncFloat(run);
  if (focusDifficultyIndex != null) {
    const line = root.querySelector(`[data-difficulty="${focusDifficultyIndex}"]`);
    line?.scrollIntoView({ block: "nearest" });
    focusDifficultyIndex = null;
  }
}

function renderEmpty(): void {
  removeFloat();
  const box = el("section", "mx-auto max-w-xl py-16 text-center");
  box.append(
    el("h1", "text-3xl font-semibold tracking-tight", copy().emptyTitle),
    el("p", "mt-3 text-muted", copy().emptyBody),
    link(to("home"), copy().emptyHome, "btn btn-primary mt-6"),
  );
  root.replaceChildren(box);
}

function examView(run: Run): HTMLElement {
  const lab = labs()[run.currentIndex];
  const record = run.labs[run.currentIndex];
  const page = el("div", "flex flex-col gap-6");
  const back = button(copy().backToList, "btn btn-quiet w-fit");
  back.addEventListener("click", () => backToBoard());
  page.append(clockBar(run, true), back, labCard(lab, record), actions(run));
  if (undoSnapshot) page.append(undoBar());
  return page;
}

function boardView(run: Run): HTMLElement {
  const page = el("div", "flex flex-col gap-6 pb-12");
  page.append(clockBar(run, false), strategyNote(), taskList(run));
  const actionsRow = el("div", "flex flex-col gap-3 sm:flex-row");
  const close = button(copy().closeRun, "btn btn-quiet w-fit");
  close.addEventListener("click", () => closeRun());
  const remove = button(copy().deleteRun, "btn btn-quiet w-fit");
  remove.addEventListener("click", () => deleteCurrent());
  actionsRow.append(close, remove);
  page.append(actionsRow);
  if (undoSnapshot) page.append(undoBar());
  return page;
}

function strategyNote(): HTMLElement {
  const note = el("section", "rounded-3xl border border-line bg-card p-5 sm:p-6");
  note.append(
    el("h1", "text-2xl font-semibold tracking-tight", copy().strategyTitle),
    el("p", "mt-2 text-muted", copy().strategyBody),
    el("p", "mt-2 text-sm text-muted", copy().enterHint),
  );
  const credit = el("p", "mt-3 text-sm");
  credit.append(copy().listCreditBefore);
  credit.append(anchor(REDHAT_EXAM_VIDEO, copy().videoTitle));
  credit.append(".");
  note.append(credit);
  return note;
}

function taskList(run: Run): HTMLElement {
  const wrap = el("div", "flex flex-col gap-6");
  const indexed = labs().map((lab, index) => ({ lab, index }));
  wrap.append(machineGroup(indexed.filter((item) => item.lab.track === "setup")));
  const pdf = indexed.filter((item) => item.lab.track === "pdf");
  wrap.append(taskGroup(run, copy().groupClient, pdf.filter((item) => machineOf(item.lab) === "client")));
  wrap.append(taskGroup(run, copy().groupServer, pdf.filter((item) => machineOf(item.lab) === "server")));
  wrap.append(taskGroup(run, copy().groupBoth, pdf.filter((item) => machineOf(item.lab) === "both")));
  const extras = labs().map((lab, index) => ({ lab, index })).filter((item) => item.lab.track === "extra");
  wrap.append(taskGroup(run, copy().groupExtras, extras));
  return wrap;
}

function machineOf(lab: Lab): "client" | "server" | "both" {
  const where = lab.where.toLowerCase();
  const client = where.includes("client");
  const server = where.includes("server");
  if (client && server) return "both";
  if (server) return "server";
  return "client";
}

function machineGroup(items: { lab: Lab; index: number }[]): HTMLElement {
  const section = el("section", "overflow-hidden rounded-3xl border border-line bg-card");
  const head = el("div", "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3 sm:px-5");
  head.append(el("h2", "font-semibold", copy().groupMachine));
  head.append(el("p", "text-right text-xs font-semibold text-muted", copy().setupAside));
  section.append(head, kitNote());
  for (const item of items) section.append(setupBlock(item.lab));
  return section;
}

function setupBlock(lab: Lab): HTMLElement {
  const block = el("div", "border-t border-line px-4 py-4 sm:px-5");
  block.append(
    el("h3", "font-semibold", lab.title),
    el("p", "mt-1 text-sm text-muted", lab.where),
    objectiveList(lab.objective, "mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed"),
  );
  const list = el("ol", "mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed");
  for (const step of lab.steps) list.append(el("li", "", step));
  block.append(list);
  if (lab.note) block.append(el("p", "mt-3 text-sm leading-relaxed text-muted", lab.note));
  return block;
}

function kitNote(): HTMLElement {
  const ui = copy();
  const note = el("div", "border-b border-line px-4 py-4 sm:px-5");
  note.append(el("h3", "font-semibold", ui.kitTitle), el("p", "mt-2 text-sm leading-relaxed text-muted", ui.kitBody));
  const list = el("ul", "mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed");
  for (const item of ui.kitItems) list.append(el("li", "", item));
  note.append(list, el("p", "mt-3 text-sm leading-relaxed text-muted", ui.kitCaveat));
  return note;
}

function taskGroup(run: Run, title: string, items: { lab: Lab; index: number }[], intro?: HTMLElement): HTMLElement {
  const section = el("section", "overflow-hidden rounded-3xl border border-line bg-card");
  const head = el("div", "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3 sm:px-5");
  head.append(el("h2", "font-semibold", title));
  head.append(el("p", "text-right text-xs font-semibold text-muted", copy().marksLegend));
  section.append(head);
  if (intro) section.append(intro);
  if (items.length === 0) {
    section.append(el("p", "px-5 py-4 text-sm text-muted", copy().emptyGroup));
    return section;
  }
  for (const item of items) section.append(taskRow(run, item.lab, item.index));
  return section;
}

function taskRow(run: Run, lab: Lab, index: number): HTMLElement {
  const record = run.labs[index];
  const done = record?.status === "done";
  const revisit = record?.status === "revisit";
  const hard = done && isHard(record?.difficulty);
  const row = el(
    "div",
    `grid grid-cols-1 gap-2 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-5 ${
      hard ? "bg-[#f8f1e4]" : done ? "opacity-60" : revisit ? "bg-[#f8f1e4]" : ""
    }`,
  );
  const marks = el("div", "flex items-center gap-4");
  marks.append(radioMark(index, "revisit", copy().revisit, revisit), radioMark(index, "done", copy().done, done));
  const open = document.createElement("button");
  open.type = "button";
  open.className = "text-left";
  const title = el("span", `font-medium ${done && !hard ? "line-through" : ""}`, lab.title);
  open.append(title);
  const meta = el(
    "span",
    "mt-0.5 block text-sm text-muted",
    rowMeta(record, lab),
  );
  open.append(meta);
  open.addEventListener("click", () => openLab(index));
  const enter = button(copy().enterLab, "btn btn-primary shrink-0");
  enter.addEventListener("click", () => openLab(index));
  row.append(marks, open, enter);
  if (done) row.append(difficultyLine(index, record?.difficulty ?? null));
  return row;
}

function rowMeta(record: LabRecord | undefined, lab: Lab): string {
  const bits = [lab.where];
  if (record?.status === "skipped") bits.push(copy().passedMeta);
  const level = difficultyLabel(record?.difficulty, pageLocale());
  if (record?.status === "done" && level) bits.push(isHard(record.difficulty) ? `${level}, ${copy().redoMeta}` : level);
  if (record?.usedHelp) bits.push(copy().helpMeta);
  if (record?.durationSec) bits.push(formatShort(record.durationSec, pageLocale()));
  return bits.join(" · ");
}

function difficultyLine(index: number, selected: Difficulty | null): HTMLElement {
  const line = el("div", "flex items-center gap-2 overflow-x-auto sm:col-span-3");
  line.dataset.difficulty = String(index);
  line.append(el("span", "shrink-0 text-xs font-semibold tracking-[0.12em] text-muted uppercase", copy().difficulty));
  const group = el("div", "flex flex-nowrap items-center gap-1");
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", copy().difficultyAria);
  for (const item of copy().levels) {
    const chosen = selected === item.id;
    const label = el("label", "diff-pill");
    label.dataset.level = item.id;
    label.dataset.selected = chosen ? "true" : "false";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `difficulty-${index}`;
    input.className = "sr-only";
    input.checked = chosen;
    input.addEventListener("change", () => setDifficulty(index, item.id));
    label.append(input, document.createTextNode(item.label));
    group.append(label);
  }
  line.append(group);
  return line;
}

function radioMark(index: number, value: "revisit" | "done", label: string, checked: boolean): HTMLElement {
  const wrap = el("label", "inline-flex cursor-pointer items-center gap-2 text-sm font-medium");
  const input = document.createElement("input");
  input.type = "radio";
  input.name = `mark-${index}`;
  input.value = value;
  input.checked = checked;
  input.className = "h-4 w-4 accent-ink";
  input.addEventListener("click", () => {
    const run = current();
    const record = run?.labs[index];
    if (!record) return;
    setMark(index, record.status === value ? "pending" : value);
  });
  wrap.append(input, document.createTextNode(label));
  return wrap;
}

function clockBar(run: Run, showLab: boolean): HTMLElement {
  const bar = el("section", "rounded-3xl border border-line bg-card p-4 sm:p-5");
  const counts = el("dl", "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6");
  const scored = countedLabs(run.labs);
  const leftTasks = scored.filter((item) => item.status !== "done" && item.status !== "skipped").length;
  const revisit = scored.filter((item) => item.status === "revisit").length;
  const done = scored.filter((item) => item.status === "done").length;
  const help = scored.filter((item) => item.usedHelp).length;
  const record = run.labs[run.currentIndex];
  if (showLab) counts.append(counter(copy().thisLab, formatClock(liveLabSec(record, run.currentIndex)), true));
  const redo = scored.filter((item) => item.status === "done" && isHard(item.difficulty)).length;
  counts.append(
    counter(copy().missing, String(leftTasks)),
    counter(copy().revisit, String(revisit)),
    counter(copy().done, String(done)),
    counter(copy().redoCount, String(redo)),
    counter(copy().withHelp, String(help)),
  );
  bar.append(counts);
  return bar;
}

function removeFloat(): void {
  window.removeEventListener("resize", onFloatResize);
  floatRoot?.remove();
  floatRoot = null;
  floatPauseBtn = null;
  floatLabel = null;
  globalClock = null;
}

function defaultFloatPos(): { x: number; y: number } {
  const width = 168;
  return {
    x: Math.max(12, window.innerWidth - width - 20),
    y: Math.max(12, window.innerHeight - 140),
  };
}

function placeFloat(node: HTMLElement): void {
  const fallback = defaultFloatPos();
  const x = floatX ?? fallback.x;
  const y = floatY ?? fallback.y;
  const maxX = Math.max(8, window.innerWidth - node.offsetWidth - 8);
  const maxY = Math.max(8, window.innerHeight - node.offsetHeight - 8);
  const nextX = Math.min(Math.max(8, x), maxX);
  const nextY = Math.min(Math.max(8, y), maxY);
  node.style.left = `${nextX}px`;
  node.style.top = `${nextY}px`;
  floatX = nextX;
  floatY = nextY;
}

function syncFloat(run: Run): void {
  const left = remainingSec(run);
  const paused = run.mode === "pausable" && Boolean(run.pausedAt);
  if (!floatRoot) {
    floatRoot = el("aside", "exam-float");
    floatRoot.setAttribute("aria-label", copy().clock);
    const handle = el("div", "exam-float-handle");
    floatLabel = el("span", "", paused ? copy().paused : copy().clock);
    handle.append(floatLabel, el("span", "exam-float-grip", "⠿"));
    handle.title = copy().floatDrag;
    globalClock = el(
      "p",
      `stat-value text-2xl font-semibold sm:text-3xl ${paused ? "text-ink" : tone(left)}`,
      formatClock(left),
    );
    globalClock.dataset.globalClock = "true";
    globalClock.setAttribute("aria-live", "off");
    floatRoot.append(handle, globalClock);
    if (run.mode === "pausable") {
      floatPauseBtn = button(paused ? copy().resumeClock : copy().pause, "btn btn-primary");
      floatPauseBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePause();
      });
      floatRoot.append(floatPauseBtn);
    }
    document.body.append(floatRoot);
    bindFloatDrag(floatRoot, handle);
    window.addEventListener("resize", onFloatResize);
    requestAnimationFrame(() => {
      if (floatRoot) placeFloat(floatRoot);
      saveUi();
    });
  } else {
    floatRoot.dataset.paused = paused ? "true" : "false";
    if (floatLabel) floatLabel.textContent = paused ? copy().paused : copy().clock;
    if (globalClock) {
      globalClock.textContent = formatClock(left);
      globalClock.className = `stat-value text-2xl font-semibold sm:text-3xl ${paused ? "text-ink" : tone(left)}`;
    }
    if (floatPauseBtn) {
      floatPauseBtn.textContent = paused ? copy().resumeClock : copy().pause;
    }
  }
}

function onFloatResize(): void {
  if (floatRoot) placeFloat(floatRoot);
}

function bindFloatDrag(panel: HTMLElement, handle: HTMLElement): void {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMove = (event: PointerEvent) => {
    if (!dragging) return;
    const maxX = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
    const maxY = Math.max(8, window.innerHeight - panel.offsetHeight - 8);
    floatX = Math.min(Math.max(8, event.clientX - offsetX), maxX);
    floatY = Math.min(Math.max(8, event.clientY - offsetY), maxY);
    panel.style.left = `${floatX}px`;
    panel.style.top = `${floatY}px`;
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    panel.style.cursor = "";
    saveUi();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    panel.style.cursor = "grabbing";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
}

function counter(label: string, value: string, isLab = false): HTMLElement {
  const wrap = el("div", "rounded-2xl bg-paper px-3 py-2");
  wrap.append(el("dt", "text-xs text-muted", label));
  const dd = el("dd", "stat-value text-lg font-semibold", value);
  if (isLab) {
    labClock = dd;
    dd.dataset.labClock = "true";
  }
  wrap.append(dd);
  return wrap;
}

function objectiveList(lines: string[], className: string): HTMLElement {
  const list = el("ul", className);
  for (const line of lines) list.append(el("li", "", line));
  return list;
}

function labCard(lab: Lab, record: LabRecord): HTMLElement {
  const card = el("article", "rounded-3xl border border-line bg-card p-5 sm:p-7");
  card.append(
    el("p", "text-xs font-semibold tracking-[0.16em] text-muted uppercase", lab.where),
    el("h1", "mt-2 text-3xl font-semibold tracking-tight", lab.title),
    objectiveList(lab.objective, "mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink/90 sm:text-lg"),
  );
  if (record.attempts > 1) {
    card.append(el("p", "mt-4 text-sm text-warn", copy().attempt(record.attempts)));
  }
  if (helpVisible) card.append(helpPanel(lab));
  return card;
}

function helpPanel(lab: Lab): HTMLElement {
  const panel = el("section", "mt-6 rounded-2xl border border-warn/40 bg-[#f8f1e4] p-4 sm:p-5");
  panel.setAttribute("aria-labelledby", "ayuda-titulo");
  panel.append(
    el("h2", "text-lg font-semibold", copy().helpAsked),
  );
  const title = panel.querySelector("h2");
  title?.setAttribute("id", "ayuda-titulo");
  title?.setAttribute("tabindex", "-1");
  panel.append(el("p", "mt-1 text-sm text-warn", copy().helpMarked));
  panel.append(el("p", "mt-3 text-sm leading-relaxed text-ink", lab.help.tip));
  if (lab.steps.length) {
    panel.append(el("h3", "mt-4 text-sm font-semibold tracking-wide uppercase", copy().stepsTitle));
    const list = el("ol", "mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed");
    for (const step of lab.steps) list.append(el("li", "", step));
    panel.append(list);
  }
  if (lab.note) panel.append(el("p", "mt-3 text-sm leading-relaxed text-muted", lab.note));
  panel.append(el("h3", "mt-4 text-sm font-semibold tracking-wide uppercase", copy().commandsTitle));
  panel.append(renderCommands(lab.help.commands));
  if (lab.help.videos.length) {
    panel.append(el("h3", "mt-4 text-sm font-semibold tracking-wide uppercase", copy().videosTitle));
    const videos = el("ul", "mt-2 space-y-1 text-sm");
    for (const video of lab.help.videos) {
      const li = el("li");
      li.append(anchor(video.url, video.title));
      videos.append(li);
    }
    panel.append(videos);
  }
  panel.append(el("p", "mt-3 text-sm", lab.help.videoHint));
  return panel;
}

function actions(run: Run): HTMLElement {
  const record = run.labs[run.currentIndex];
  const row = el("div", "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center");
  const helpLabel = !record.usedHelp
    ? copy().askHelp
    : helpVisible
      ? copy().hideHelp
      : copy().showHelp;
  const helpBtn = button(helpLabel, "btn btn-warn");
  helpBtn.addEventListener("click", () => toggleHelp());
  const revisitBtn = button(copy().revisit, "btn btn-quiet");
  revisitBtn.addEventListener("click", () => setMark(run.currentIndex, "revisit"));
  const redoBtn = button(copy().redo, "btn btn-quiet");
  redoBtn.addEventListener("click", () => redo());
  const doneBtn = button(copy().done, "btn btn-primary");
  doneBtn.addEventListener("click", () => setMark(run.currentIndex, "done"));
  const skipBtn = button(copy().skipTask, "btn btn-quiet");
  skipBtn.addEventListener("click", () => setMark(run.currentIndex, "skipped"));
  row.append(helpBtn, revisitBtn, redoBtn, doneBtn, skipBtn);
  const wrap = el("div");
  wrap.append(row);
  if (record.status === "done") {
    const line = difficultyLine(run.currentIndex, record.difficulty ?? null);
    line.classList.add("mt-3");
    wrap.append(line);
  }
  wrap.append(
    el(
      "p",
      "mt-3 text-sm text-muted",
      copy().actionsHint,
    ),
  );
  return wrap;
}

function undoBar(): HTMLElement {
  const bar = el("div", "flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-paper");
  bar.dataset.undo = "true";
  bar.append(el("p", "", copy().undoText));
  const undo = button(copy().undo, "btn btn-quiet !text-ink");
  undo.addEventListener("click", () => {
    if (!undoSnapshot) return;
    const restored = undoSnapshot;
    undoSnapshot = null;
    commit(restored);
    render();
  });
  bar.append(undo);
  return bar;
}

function summaryView(run: Run): HTMLElement {
  const scored = countedLabs(run.labs);
  const done = scored.filter((item) => item.status === "done").length;
  const redo = scored.filter((item) => item.status === "done" && isHard(item.difficulty)).length;
  const skipped = scored.filter((item) => item.status === "skipped").length;
  const help = scored.filter((item) => item.usedHelp).length;
  const titles: Record<Run["status"], string> = {
    completed: copy().closed,
    timed_out: copy().timedOut,
    abandoned: copy().abandoned,
    in_progress: copy().inProgress,
  };
  const page = el("div", "flex flex-col gap-6 pb-10");
  const head = el("section", "rounded-3xl border border-line bg-card p-6 sm:p-8");
  head.append(
    el("p", "text-xs font-semibold tracking-[0.16em] text-muted uppercase", titles[run.status]),
    el("h1", "stat-value mt-2 text-4xl font-semibold", formatClock(wallSec(run))),
    el("p", "mt-3 text-lg", copy().tally({ done, revisit: scored.filter((item) => item.status === "revisit").length, redo, skipped, help })),
    el("p", "mt-2 text-sm text-muted", copy().summaryHint),
  );
  const row = el("div", "mt-6 flex flex-col gap-3 sm:flex-row");
  const remove = button(copy().deleteRun, "btn btn-quiet");
  remove.addEventListener("click", () => deleteCurrent());
  row.append(
    link(to("stats"), copy().seeStats, "btn btn-primary"),
    link(to("home"), copy().backHome, "btn btn-quiet"),
    remove,
  );
  head.append(row);
  page.append(head);

  const table = el("div", "overflow-hidden rounded-3xl border border-line bg-card");
  for (const [index, lab] of labs().entries()) {
    if (lab.track === "setup") continue;
    const record = run.labs[index];
    if (!record) continue;
    const line = el("div", "grid grid-cols-[1fr_auto] gap-3 border-b border-line px-4 py-3 last:border-b-0 sm:px-5");
    const left = el("div");
    left.append(el("p", "font-medium", lab.title));
    left.append(el("p", "text-sm text-muted", statusText(record)));
    line.append(left, el("p", "stat-value text-sm", record.durationSec == null ? "—" : formatShort(record.durationSec, pageLocale())));
    table.append(line);
  }
  page.append(table);
  return page;
}

function statusText(record: LabRecord): string {
  const ui = copy();
  const label =
    record.status === "done"
      ? ui.done
      : record.status === "revisit"
        ? ui.revisit
        : record.status === "skipped"
          ? ui.statusPassed
          : record.status === "redo"
            ? ui.statusRedo
            : record.durationSec != null
              ? ui.statusOpen
              : ui.statusNone;
  const level = record.status === "done" ? difficultyLabel(record.difficulty, pageLocale()) : "";
  const bits = [label];
  if (level) bits.push(isHard(record.difficulty) ? `${level}, ${ui.redoMeta}` : level);
  if (record.usedHelp) bits.push(ui.helpMeta);
  return bits.join(" · ");
}

function toggleHelp(): void {
  const run = current();
  if (!run || run.status !== "in_progress" || screen !== "lab") return;
  const record = run.labs[run.currentIndex];
  if (!record) return;
  if (!record.usedHelp) {
    snapshot();
    record.usedHelp = true;
    helpVisible = true;
    commit(run);
  } else {
    helpVisible = !helpVisible;
  }
  saveUi();
  render();
  if (helpVisible) document.getElementById("ayuda-titulo")?.focus();
}

function redo(): void {
  const run = current();
  if (!run || run.status !== "in_progress" || screen !== "lab") return;
  const record = run.labs[run.currentIndex];
  if (!record) return;
  snapshot();
  record.attempts += 1;
  record.startedAt = new Date().toISOString();
  record.finishedAt = null;
  record.durationSec = null;
  record.status = "redo";
  visitStart = Date.now();
  commit(run);
  render();
}

function openLab(index: number): void {
  const run = current();
  if (!run || run.status !== "in_progress" || labs()[index]?.track === "setup") return;
  if (visitStart != null) flushVisit(run.labs[run.currentIndex]);
  run.currentIndex = index;
  const record = run.labs[index];
  if (!record) return;
  if (record.attempts === 0) record.attempts = 1;
  if (!record.startedAt) record.startedAt = new Date().toISOString();
  visitStart = run.pausedAt ? null : Date.now();
  screen = "lab";
  helpVisible = false;
  commit(run);
  saveUi();
  render();
}

function backToBoard(): void {
  const run = current();
  if (!run) return;
  if (visitStart != null) flushVisit(run.labs[run.currentIndex]);
  screen = "board";
  helpVisible = false;
  commit(run);
  saveUi();
  render();
}

function setMark(index: number, status: LabRecord["status"]): void {
  const run = current();
  if (!run || run.status !== "in_progress") return;
  const record = run.labs[index];
  if (!record || labs()[index]?.track === "setup") return;
  if (screen === "lab" && run.currentIndex === index) flushVisit(record);
  snapshot(run);
  record.status = status;
  if (status !== "done") record.difficulty = null;
  record.finishedAt = status === "pending" || status === "redo" ? null : new Date().toISOString();
  screen = "board";
  helpVisible = false;
  if (status === "done") focusDifficultyIndex = index;
  commit(run);
  saveUi();
  render();
}

function setDifficulty(index: number, difficulty: Difficulty): void {
  const run = current();
  if (!run || run.status !== "in_progress") return;
  const record = run.labs[index];
  if (!record || record.status !== "done" || record.difficulty === difficulty) return;
  snapshot(run);
  record.difficulty = difficulty;
  commit(run);
  render();
}

function deleteCurrent(): void {
  const run = current();
  if (!run) return;
  if (!confirm(copy().confirmDelete)) return;
  deleteRun(run.id);
  runId = "";
  visitStart = null;
  undoSnapshot = null;
  screen = "board";
  helpVisible = false;
  sessionStorage.removeItem(UI_KEY);
  render();
}

function togglePause(): void {
  const run = current();
  if (!run || run.status !== "in_progress" || run.mode !== "pausable") return;
  if (run.pausedAt) {
    run.pausedSec += Math.max(0, (Date.now() - Date.parse(run.pausedAt)) / 1000);
    run.pausedAt = null;
    if (screen === "lab") visitStart = Date.now();
  } else {
    if (visitStart != null) flushVisit(run.labs[run.currentIndex]);
    run.pausedAt = new Date().toISOString();
  }
  commit(run);
  render();
}

function closeRun(): void {
  const run = current();
  if (!run || run.status !== "in_progress") return;
  if (!confirm(copy().confirmClose)) return;
  if (visitStart != null) flushVisit(run.labs[run.currentIndex]);
  if (run.pausedAt) {
    run.pausedSec += Math.max(0, (Date.now() - Date.parse(run.pausedAt)) / 1000);
    run.pausedAt = null;
  }
  run.status = "completed";
  run.finishedAt = new Date().toISOString();
  screen = "board";
  undoSnapshot = null;
  commit(run);
  render();
}

function renderCommands(items: LabCommand[]): HTMLElement {
  const list = el("ul", "mt-2 space-y-3");
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.orGroup) {
      const groupId = item.orGroup;
      const group: LabCommand[] = [];
      while (i < items.length && items[i].orGroup === groupId) {
        group.push(items[i]);
        i += 1;
      }
      list.append(renderChoiceGroup(group));
      continue;
    }
    list.append(renderCommandItem(item));
    i += 1;
  }
  return list;
}

function renderChoiceGroup(group: LabCommand[]): HTMLElement {
  const wrap = el("li", "help-choice");
  const asWho = group.find((item) => item.as)?.as;
  if (asWho) {
    wrap.append(
      el(
        "p",
        "mb-2 text-xs font-semibold tracking-[0.14em] text-warn uppercase",
        copy().asWho(asWho),
      ),
    );
  }
  wrap.append(el("p", "help-choice-banner", copy().helpPickOne));
  const inner = el("div", "help-choice-list");
  group.forEach((item, index) => {
    const card = el("div", "help-choice-card");
    card.append(el("p", "help-choice-label", copy().helpOption(index + 1, item.orName)));
    card.append(commandRow(item.cmd));
    card.append(el("p", "mt-1 text-sm text-muted", item.why));
    inner.append(card);
  });
  wrap.append(inner);
  return wrap;
}

function renderCommandItem(item: LabCommand): HTMLElement {
  const li = el("li");
  if (item.as) {
    li.append(
      el(
        "p",
        "mb-1 text-xs font-semibold tracking-[0.14em] text-warn uppercase",
        copy().asWho(item.as),
      ),
    );
  }
  li.append(commandRow(item.cmd), el("p", "mt-1 text-sm text-muted", item.why));
  return li;
}

function commandRow(cmd: string): HTMLElement {
  const row = el("div", "cmd-row");
  const text = el("code", "cmd-text");
  text.textContent = cmd;
  row.append(text, createCopyButton(cmd, { copy: copy().copyCmd, copied: copy().copiedCmd }));
  return row;
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

function anchor(href: string, text: string): HTMLAnchorElement {
  const node = link(href, text, "font-medium underline decoration-line underline-offset-2");
  node.target = "_blank";
  node.rel = "noopener noreferrer";
  return node;
}
