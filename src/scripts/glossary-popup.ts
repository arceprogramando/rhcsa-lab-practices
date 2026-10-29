import { glossaryFor, tldrUrl, type GlossaryEntry } from "../lib/glossary";
import { getUI, pageLocale, routePath } from "../lib/i18n";
import { createCopyButton } from "./copy-btn";

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "CODE", "PRE", "KBD", "A", "BUTTON"]);

let entries: GlossaryEntry[] = [];
let sortedTerms: { term: string; entry: GlossaryEntry; re: RegExp }[] = [];
let overlay: HTMLElement | null = null;
let input: HTMLInputElement | null = null;
let results: HTMLElement | null = null;
let empty: HTMLElement | null = null;
let detail: HTMLElement | null = null;
let tip: HTMLElement | null = null;
/** Term pinned in the popup list; null = show every search match. */
let selectedTerm: string | null = null;

export function openGlossaryPopup(prefill = ""): void {
  openPopup(prefill);
}

export function mountGlossaryPopup(): void {
  const locale = pageLocale();
  const ui = getUI(locale);
  entries = glossaryFor(locale);
  sortedTerms = entries
    .slice()
    .sort((a, b) => b.term.length - a.term.length)
    .map((entry) => ({
      term: entry.term,
      entry,
      re: new RegExp(`(?<![\\w.-])${escapeRegExp(entry.term)}(?![\\w.-])`, "gi"),
    }));

  ensureUi(ui);
  underlineRoot(document.getElementById("contenido"));
  watchDynamic();

  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k" || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
      if (target.id === "glossary-popup-input") return;
      // still open over normal inputs in the exam UI
    }
    event.preventDefault();
    openPopup();
  });
}

function ensureUi(ui: ReturnType<typeof getUI>): void {
  if (overlay) return;
  overlay = document.createElement("div");
  overlay.id = "glossary-popup";
  overlay.className = "glossary-popup hidden";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", ui.glossaryHeading);
  overlay.innerHTML = `
    <div class="glossary-popup-backdrop" data-close></div>
    <div class="glossary-popup-panel">
      <div class="glossary-popup-head">
        <p class="glossary-popup-kicker">${escapeHtml(ui.glossaryHeading)} · Ctrl+K</p>
        <button type="button" class="glossary-popup-x" data-close aria-label="${escapeHtml(ui.glossaryPopupClose)}">×</button>
      </div>
      <input id="glossary-popup-input" type="search" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(ui.glossaryPopupSearch)}" />
      <p id="glossary-popup-empty" class="glossary-popup-empty hidden">${escapeHtml(ui.glossarySearchEmpty)}</p>
      <div id="glossary-popup-results" class="glossary-popup-results"></div>
      <div id="glossary-popup-detail" class="glossary-popup-detail hidden"></div>
      <p class="glossary-popup-foot">
        <a class="underline decoration-line" href="${routePath(pageLocale(), "glossary")}">${escapeHtml(ui.glossaryNav)}</a>
      </p>
    </div>
  `;
  document.body.append(overlay);
  tip = document.createElement("div");
  tip.id = "glossary-tip";
  tip.className = "glossary-tip";
  tip.hidden = true;
  tip.setAttribute("role", "tooltip");
  document.body.append(tip);
  document.addEventListener("scroll", hideTip, true);
  input = overlay.querySelector("#glossary-popup-input");
  results = overlay.querySelector("#glossary-popup-results");
  empty = overlay.querySelector("#glossary-popup-empty");
  detail = overlay.querySelector("#glossary-popup-detail");

  overlay.querySelectorAll("[data-close]").forEach((node) => {
    node.addEventListener("click", () => closePopup());
  });
  input?.addEventListener("input", () => {
    selectedTerm = null;
    hideDetail();
    renderResults(input?.value ?? "");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay && !overlay.classList.contains("hidden")) {
      event.preventDefault();
      closePopup();
    }
  });
}

function openPopup(prefill = ""): void {
  if (!overlay || !input) return;
  hideTip();
  overlay.classList.remove("hidden");
  input.value = prefill;
  selectedTerm = prefill.trim() ? prefill.trim() : null;
  renderResults(prefill);
  if (selectedTerm) showDetail(findEntry(selectedTerm));
  else hideDetail();
  requestAnimationFrame(() => input?.focus());
}

function closePopup(): void {
  overlay?.classList.add("hidden");
  selectedTerm = null;
  hideDetail();
}

/** Lower = better. Title beats definition/example. */
function glossaryRank(entry: GlossaryEntry, q: string): number {
  if (!q) return 0;
  const term = entry.term.toLowerCase();
  if (term === q) return 0;
  if (term.startsWith(q)) return 1;
  if (term.includes(q)) return 2;
  return 3;
}

function renderResults(query: string): void {
  if (!results || !empty) return;
  const q = query.trim().toLowerCase();
  if (selectedTerm) {
    const still = entries.some((entry) => {
      if (entry.term.toLowerCase() !== selectedTerm!.toLowerCase()) return false;
      if (!q) return true;
      const hay = `${entry.term} ${entry.definition} ${entry.example ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
    if (!still) selectedTerm = null;
  }
  const matches = entries.filter((entry) => {
    if (!q) return true;
    const hay = `${entry.term} ${entry.definition} ${entry.example ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
  if (q) {
    matches.sort((a, b) => glossaryRank(a, q) - glossaryRank(b, q) || a.term.localeCompare(b.term));
  }
  const visible = selectedTerm
    ? matches.filter((entry) => entry.term.toLowerCase() === selectedTerm!.toLowerCase())
    : matches;
  empty.classList.toggle("hidden", visible.length > 0);
  const pinned = selectedTerm != null && visible.length > 0;
  results.classList.toggle("hidden", pinned);
  results.replaceChildren();
  if (pinned) return;
  for (const entry of visible.slice(0, 40)) {
    const btn = document.createElement("button");
    btn.type = "button";
    const active = selectedTerm != null && entry.term.toLowerCase() === selectedTerm.toLowerCase();
    btn.className = active ? "glossary-popup-item is-selected" : "glossary-popup-item";
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.innerHTML = `<span class="mono">${escapeHtml(entry.term)}</span><span>${escapeHtml(entry.definition)}</span>`;
    btn.addEventListener("click", () => toggleSelect(entry));
    results.append(btn);
  }
}

function toggleSelect(entry: GlossaryEntry): void {
  if (selectedTerm && selectedTerm.toLowerCase() === entry.term.toLowerCase()) {
    selectedTerm = null;
    hideDetail();
  } else {
    selectedTerm = entry.term;
    showDetail(entry);
  }
  renderResults(input?.value ?? "");
}

function showDetail(entry: GlossaryEntry | undefined): void {
  if (!detail || !entry) {
    hideDetail();
    return;
  }
  const ui = getUI(pageLocale());
  const labels = { copy: ui.copyCmd, copied: ui.copiedCmd };
  detail.classList.remove("hidden");
  detail.replaceChildren();

  const termRow = document.createElement("div");
  termRow.className = "glossary-term-row";
  const term = document.createElement("span");
  term.className = "glossary-popup-term mono";
  term.textContent = entry.term;
  termRow.append(term, createCopyButton(entry.term, labels));
  detail.append(termRow);

  const def = document.createElement("p");
  def.className = "glossary-popup-def";
  def.textContent = entry.definition;
  detail.append(def);

  if (entry.example) {
    const exRow = document.createElement("div");
    exRow.className = "cmd-row glossary-popup-ex-row";
    const ex = document.createElement("code");
    ex.className = "cmd-text";
    ex.textContent = entry.example;
    exRow.append(ex, createCopyButton(entry.example, labels));
    detail.append(exRow);
  }

  if (entry.tldr) {
    const tldr = document.createElement("p");
    const link = document.createElement("a");
    link.href = tldrUrl(entry.tldr);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "underline decoration-line";
    link.textContent = ui.glossaryTldr;
    tldr.className = "glossary-popup-tldr";
    tldr.append(link);
    detail.append(tldr);
  }
}

function showTip(mark: HTMLElement, text: string): void {
  if (!tip || (overlay && !overlay.classList.contains("hidden"))) return;
  tip.textContent = text;
  tip.hidden = false;
  const rect = mark.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const margin = 8;
  let top = rect.top - tipRect.height - margin;
  if (top < margin) top = rect.bottom + margin;
  let left = rect.left;
  const maxLeft = window.innerWidth - tipRect.width - margin;
  if (left > maxLeft) left = Math.max(margin, maxLeft);
  if (left < margin) left = margin;
  tip.style.top = `${top}px`;
  tip.style.left = `${left}px`;
}

function hideTip(): void {
  if (!tip) return;
  tip.hidden = true;
}

function hideDetail(): void {
  if (!detail) return;
  detail.classList.add("hidden");
  detail.replaceChildren();
}

function findEntry(term: string): GlossaryEntry | undefined {
  const needle = term.trim().toLowerCase();
  return entries.find((entry) => entry.term.toLowerCase() === needle);
}

function underlineRoot(root: HTMLElement | null): void {
  if (!root || sortedTerms.length === 0) return;
  if (root.closest("#glossary-list") || root.id === "glossary-list") return;
  walk(root);
}

function walk(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (!text.trim()) return;
    const parent = node.parentElement;
    if (!parent || parent.closest(".glossary-mark, .glossary-popup, code, pre, a, button, kbd")) return;

    let matched: { term: string; entry: GlossaryEntry; index: number } | null = null;
    for (const item of sortedTerms) {
      item.re.lastIndex = 0;
      const hit = item.re.exec(text);
      if (hit && hit.index != null) {
        matched = { term: hit[0], entry: item.entry, index: hit.index };
        break;
      }
    }
    if (!matched) return;

    const frag = document.createDocumentFragment();
    if (matched.index > 0) frag.append(document.createTextNode(text.slice(0, matched.index)));
    const mark = document.createElement("span");
    mark.className = "glossary-mark";
    mark.setAttribute("role", "button");
    mark.tabIndex = 0;
    mark.textContent = matched.term;
    const definition = matched.entry.definition;
    mark.addEventListener("mouseenter", () => showTip(mark, definition));
    mark.addEventListener("mouseleave", hideTip);
    mark.addEventListener("focus", () => showTip(mark, definition));
    mark.addEventListener("blur", hideTip);
    const open = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      hideTip();
      openPopup(matched!.entry.term);
      showDetail(matched!.entry);
    };
    mark.addEventListener("click", open);
    mark.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") open(event);
    });
    frag.append(mark);
    const rest = text.slice(matched.index + matched.term.length);
    const restNode = document.createTextNode(rest);
    frag.append(restNode);
    parent.replaceChild(frag, node);
    if (rest) walk(restNode);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as HTMLElement;
  if (SKIP.has(el.tagName) || el.classList.contains("glossary-mark") || el.id === "glossary-popup") return;
  const children = Array.from(el.childNodes);
  for (const child of children) walk(child);
}

function watchDynamic(): void {
  const root = document.getElementById("contenido");
  if (!root) return;
  let timer = 0;
  let marking = false;
  const obs = new MutationObserver((records) => {
    if (marking) return;
    const onlyMarks = records.every((record) =>
      Array.from(record.addedNodes).every(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList?.contains("glossary-mark"),
      ),
    );
    if (onlyMarks && records.every((record) => record.removedNodes.length === 0)) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      marking = true;
      try {
        underlineRoot(root);
      } finally {
        marking = false;
      }
    }, 80);
  });
  obs.observe(root, { childList: true, subtree: true, characterData: true });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
