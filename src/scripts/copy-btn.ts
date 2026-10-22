/** Classic “copy document” control for command / glossary fields. */

const COPY_ICON =
  '<svg class="cmd-copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';

export function createCopyButton(
  text: string,
  labels: { copy: string; copied: string },
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cmd-copy";
  btn.setAttribute("aria-label", `${labels.copy}: ${text}`);
  btn.setAttribute("title", labels.copy);
  btn.innerHTML = COPY_ICON;
  btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      btn.setAttribute("title", labels.copied);
      btn.classList.add("is-copied");
      window.setTimeout(() => {
        btn.setAttribute("title", labels.copy);
        btn.classList.remove("is-copied");
      }, 1500);
    } catch {
      /* clipboard may be blocked */
    }
  });
  return btn;
}
