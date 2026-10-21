export const DEFAULT_LOCALE = "es";
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE = "https://rhcsa.arceprog.dev";

export function getLocaleConfig(locale: Locale) {
  if (locale === "en") {
    return { htmlLang: "en", ogLocale: "en_US", label: "English" };
  }
  return { htmlLang: "es", ogLocale: "es_AR", label: "Español" };
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function localeFromPath(path: string): Locale {
  if (path === "/en" || path.startsWith("/en/")) return "en";
  return DEFAULT_LOCALE;
}

export function pageLocale(): Locale {
  if (typeof document !== "undefined") {
    const value = document.documentElement.dataset.locale;
    if (value === "en" || value === "es") return value;
  }
  if (typeof location !== "undefined") return localeFromPath(location.pathname);
  return DEFAULT_LOCALE;
}

/** Path with locale prefix and a trailing slash. Spanish stays at the root. */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  if (!clean) return `${prefix}/`;
  return `${prefix}/${clean}/`;
}

/**
 * Logical pages and their URL slug per locale.
 * Add new pages here so English never reuses Spanish words in the path.
 */
export const ROUTES = {
  home: { es: "", en: "" },
  practice: { es: "simulacro", en: "practice" },
  stats: { es: "estadisticas", en: "stats" },
  glossary: { es: "glosario", en: "glossary" },
} as const;

export type RouteId = keyof typeof ROUTES;

export function routePath(locale: Locale, id: RouteId): string {
  const slug = ROUTES[id][locale];
  return localePath(locale, slug ? `/${slug}/` : "/");
}

/** Strip /en prefix and normalize trailing slash for matching. */
export function barePathname(pathname: string): string {
  let path = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && !path.endsWith("/")) path = `${path}/`;
  return path === "" ? "/" : path;
}

export function matchRoute(pathname: string): RouteId {
  const bare = barePathname(pathname);
  if (bare === "/") return "home";
  for (const id of Object.keys(ROUTES) as RouteId[]) {
    if (id === "home") continue;
    const es = `/${ROUTES[id].es}/`;
    const en = `/${ROUTES[id].en}/`;
    if (bare === es || bare === en) return id;
  }
  return "home";
}

/** Same page in another locale, keeping query string if provided. */
export function swapLocalePath(pathname: string, target: Locale, search = ""): string {
  const base = routePath(target, matchRoute(pathname));
  if (!search || search === "?") return base;
  const q = search.startsWith("?") ? search : `?${search}`;
  return `${base}${q}`;
}

export function cvUrl(locale: Locale): string {
  return locale === "en" ? "https://arceprog.dev/en/" : "https://arceprog.dev/";
}

export interface Copy {
  skip: string;
  brand: string;
  nav: string;
  statsNav: string;
  glossaryNav: string;
  glossaryTitle: string;
  glossaryDescription: string;
  glossaryHeading: string;
  glossaryIntro: string;
  glossarySearch: string;
  glossarySearchEmpty: string;
  glossaryTldr: string;
  glossaryTldrRepo: string;
  cv: string;
  banner: string;
  homeTitle: string;
  homeDescription: string;
  hello: string;
  kicker: string;
  headline: string;
  leadBefore: string;
  leadAfter: string;
  start: string;
  startAnother: string;
  startModesLabel: string;
  startPausable: string;
  startPausableAnother: string;
  startFixed: string;
  startFixedAnother: string;
  startFixedHint: string;
  modesNote: string;
  resume: string;
  startAnotherLabel: string;
  seeStats: string;
  seeStatsFixed: string;
  seeStatsPausable: string;
  statsModeFixed: string;
  statsModePausable: string;
  timesNote: string;
  loading: string;
  improvement: string;
  improvementFixed: string;
  runs: string;
  best: string;
  withHelp: string;
  passed: string;
  lastClose: string;
  howTitle: string;
  how: string[];
  helpTitle: string;
  helpBody: string;
  vmsTitle: string;
  footerBefore: string;
  footerPlaylist: string;
  footerAndRepo: string;
  footerRepo: string;
  footerAfterRepo: string;
  footerVideoBefore: string;
  noscript: string;
  videoTitle: string;
  confirmReplace: string;
  startedNote: (when: string) => string;
  startedPausedNote: (when: string) => string;
  startedPausableNote: (when: string) => string;
  firstClose: (clock: string) => string;
  openRun: string;
  noCloseYet: string;
  deltaLine: (delta: string, label: string) => string;
  tally: (parts: { done: number; revisit: number; redo: number; skipped: number; help: number }) => string;
  examTitle: string;
  examDescription: string;
  emptyTitle: string;
  emptyBody: string;
  emptyHome: string;
  backToList: string;
  enterLab: string;
  enterHint: string;
  clock: string;
  pause: string;
  resumeClock: string;
  paused: string;
  floatDrag: string;
  thisLab: string;
  missing: string;
  redoCount: string;
  revisit: string;
  done: string;
  strategyTitle: string;
  strategyBody: string;
  listCreditBefore: string;
  groupMachine: string;
  setupAside: string;
  kitTitle: string;
  kitBody: string;
  kitItems: string[];
  kitCaveat: string;
  updatesTitle: string;
  updatesIntro: string;
  updates: string[];
  groupClient: string;
  groupServer: string;
  groupBoth: string;
  groupExtras: string;
  marksLegend: string;
  emptyGroup: string;
  passedMeta: string;
  helpMeta: string;
  redoMeta: string;
  difficulty: string;
  difficultyAria: string;
  levels: { id: "very_low" | "low" | "normal" | "high" | "very_high"; label: string }[];
  helpAsked: string;
  helpMarked: string;
  stepsTitle: string;
  commandsTitle: string;
  videosTitle: string;
  askHelp: string;
  showHelp: string;
  hideHelp: string;
  redo: string;
  skipTask: string;
  actionsHint: string;
  undoText: string;
  undo: string;
  closeRun: string;
  deleteRun: string;
  summaryHint: string;
  backHome: string;
  closed: string;
  timedOut: string;
  abandoned: string;
  inProgress: string;
  statusPassed: string;
  statusRedo: string;
  statusOpen: string;
  statusNone: string;
  attempt: (n: number) => string;
  confirmDelete: string;
  confirmClose: string;
  statsTitle: string;
  statsDescription: string;
  statsHeading: string;
  statsIntro: string;
  noClosed: string;
  noClosedBody: string;
  firstExam: string;
  fasterThan: (when: string) => string;
  lastVsPrev: (last: string, prev: string) => string;
  simulacros: string;
  labsDone: string;
  byLab: string;
  cols: string[];
  redoCell: string;
  statsNote: string;
  history: string;
  historyEmpty: string;
  delete: string;
  confirmDeleteNamed: (which: string) => string;
  thisRunning: string;
  thisSaved: string;
  download: string;
  wipe: string;
  confirmWipe: string;
  noTimes: string;
  noTimesBody: string;
  goHome: string;
  faster: string;
  slower: string;
  similar: string;
  same: string;
}

const levelsEs: Copy["levels"] = [
  { id: "very_low", label: "muy bajo" },
  { id: "low", label: "bajo" },
  { id: "normal", label: "normal" },
  { id: "high", label: "alto" },
  { id: "very_high", label: "muy alto" },
];

const levelsEn: Copy["levels"] = [
  { id: "very_low", label: "very low" },
  { id: "low", label: "low" },
  { id: "normal", label: "normal" },
  { id: "high", label: "high" },
  { id: "very_high", label: "very high" },
];

const es: Copy = {
  skip: "Saltar al contenido",
  brand: "Simulacro RHCSA",
  nav: "Secciones",
  statsNav: "Estadísticas",
  glossaryNav: "Glosario",
  glossaryTitle: "Glosario RHCSA",
  glossaryDescription: "Palabras y comandos que no quiero olvidar para el examen RHCSA.",
  glossaryHeading: "Glosario",
  glossaryIntro: "Términos que se me traban. Buscá por palabra o por la descripción. Donde hay tldr, el enlace abre ejemplos de uso en el repo de la comunidad.",
  glossarySearch: "Buscar por palabra o descripción…",
  glossarySearchEmpty: "No hay entradas que coincidan.",
  glossaryTldr: "Ejemplos en tldr",
  glossaryTldrRepo: "Repo tldr-pages",
  cv: "CV",
  banner: "Práctica personal para el RHCSA del 30 de octubre. No es el examen oficial ni un sitio de Red Hat.",
  homeTitle: "Simulacro RHCSA",
  homeDescription: "Hola, me estoy preparando para rendir el RHCSA el 30 de octubre y estoy usando esto como práctica personal.",
  hello: "Hola, me estoy preparando para rendir el examen RHCSA el 30 de octubre, y estoy usando esto como práctica personal.",
  kicker: "Práctica personal · EX200",
  headline: "Primero lo que ya sabés hacer.",
  leadBefore: "Reloj de 3 horas y la lista completa, con Revisit (volver después) y Done (ya está), como se ve en el video público de Red Hat ",
  leadAfter: ". Los puntos rápidos van primero. Si algo te traba, lo marcás y seguís.",
  start: "Empezá el simulacro",
  startAnother: "Empezar otro",
  startModesLabel: "Empezar un simulacro",
  startPausable: "Práctica con pausas",
  startPausableAnother: "Otra con pausas",
  startFixed: "Empezar sin pausas",
  startFixedAnother: "Otro sin pausas",
  startFixedHint: "El modo importante: 3 horas de corrido, como el examen real.",
  modesNote: "Sin pausas es el que importa para medir cómo vas. Con pausas es solo práctica: el reloj se puede frenar.",
  resume: "Seguí donde quedaste",
  startAnotherLabel: "O empezar otro",
  seeStats: "Ver mis tiempos",
  seeStatsFixed: "Tiempos sin pausas",
  seeStatsPausable: "Tiempos con pausas",
  statsModeFixed: "Sin pausas · como el examen",
  statsModePausable: "Con pausas · práctica",
  timesNote: "Los tiempos quedan en este navegador.",
  loading: "Cargando tiempos locales…",
  improvement: "Mejora",
  improvementFixed: "Mejora sin pausas",
  runs: "Simulacros",
  best: "Mejor tiempo",
  withHelp: "Con ayuda",
  passed: "Pasados",
  lastClose: "Último cierre",
  howTitle: "Cómo se rinde",
  how: [
    "Lo principal es sin pausas: 3 horas de corrido como el examen. Con pausas es práctica opcional.",
    "Hacé primero lo que ya sabés. Esos son los puntos rápidos.",
    "Revisit (volver después): te trabaste, lo dejás marcado y seguís con otro.",
    "Done (ya está): ese ya está. Lo que no tiene marca es lo que falta.",
    "No hace falta ir en orden.",
  ],
  helpTitle: "Ayuda",
  helpBody: "Cada lab muestra el título y los datos exactos a cumplir. El detalle paso a paso, los comandos y los videos aparecen recién con Pedí ayuda, y ese lab queda contado como resuelto con ayuda.",
  vmsTitle: "Las dos VMs",
  footerBefore: "Material de práctica: ",
  footerPlaylist: "lista de YouTube",
  footerAndRepo: " y ",
  footerRepo: "repo del lab",
  footerAfterRepo: ". Cubre V9 y videos más nuevos: Flatpak, timers y el reset con init=/bin/bash.",
  footerVideoBefore: "La lista con Revisit (volver después) y Done (ya está) está basada en el video oficial ",
  noscript: "Esta práctica guarda los tiempos en el navegador y necesita JavaScript.",
  videoTitle: "Dentro de un examen de certificación Red Hat: Lo que necesita saber",
  confirmReplace: "Hay uno en curso. Si empezás otro, ese queda guardado como abandonado.",
  startedNote: (when) => `Hay uno empezado el ${when}. El reloj sigue desde ese momento.`,
  startedPausedNote: (when) => `Hay uno en pausa, empezado el ${when}. El reloj está frenado.`,
  startedPausableNote: (when) => `Hay uno con pausas, empezado el ${when}. Pausar frena el reloj.`,
  firstClose: (clock) => `Primer cierre: ${clock}. El próximo se compara contra este.`,
  openRun: "Hay un simulacro sin cerrar. La mejora aparece cuando termina o se acaba el tiempo.",
  noCloseYet: "Cuando cierres el primero, acá vas a ver si el siguiente fue más corto.",
  deltaLine: (delta, label) => `${delta} · ${label} que el anterior`,
  tally: ({ done, revisit, redo, skipped, help }) =>
    `${done} done · ${revisit} revisit · ${redo} para rehacer · ${skipped} sin entender · ${help} con ayuda`,
  examTitle: "Simulacro en curso",
  examDescription: "Lab actual del simulacro RHCSA, con reloj de 3 horas. La ayuda se abre solo si la pedís.",
  emptyTitle: "No hay un simulacro en curso",
  emptyBody: "El reloj de 3 horas arranca al empezar, y la lista muestra lo que falta.",
  emptyHome: "Empezá desde el inicio",
  backToList: "Volver a la lista",
  enterLab: "Entrar",
  enterHint: "Entrar abre el enunciado de esa tarea.",
  clock: "Reloj del examen",
  pause: "Pausar",
  resumeClock: "Seguir",
  paused: "En pausa",
  floatDrag: "Arrastrá",
  thisLab: "Este lab",
  missing: "Te faltan",
  redoCount: "Rehacer",
  revisit: "Revisit (volver después)",
  done: "Done (ya está)",
  strategyTitle: "Hacé primero lo que ya sabés",
  strategyBody:
    "Los puntos rápidos van primero, como se ve en el video público de Red Hat. Si una tarea te traba, marcala Revisit (volver después) y seguí con otra. Done (ya está) es cuando ya está: en esa misma línea elegís la dificultad del puntaje. Alto y muy alto son los que conviene rehacer. Lo que no tiene marca es lo que te falta. No hace falta ir en orden.",
  listCreditBefore: "La lista está armada a partir del video oficial ",
  groupMachine: "Configuración de máquina",
  setupAside: "No cuenta como lab.",
  kitTitle: "Para el día del examen",
  kitBody:
    "La ISO llega por Gmail. Esa ISO te da un tiempo para hacer pruebas. No hay una demo de cómo configurarla ni de cómo va a funcionar, y no se sabe si se puede probar el equipo antes. Conviene ir preparado.",
  kitItems: [
    "Teclado con cable.",
    "Cámara con cable.",
    "Si rendís con notebook, un adaptador de USB de más, si podés.",
    "USB booteable con la ISO del examen.",
  ],
  kitCaveat: "Esta información la saqué de distintos lados. Todavía no rendí el examen, así que no está confirmada.",
  updatesTitle: "Info nueva que fui juntando",
  updatesIntro: "Cosas que encontré después sobre la preparación del EX200 v10. No es el enunciado oficial.",
  updates: [
    "Agrandar un VG, la partición de swap y crear un LV nuevo: practicarlos hasta poder hacerlo sin abrir la ayuda.",
    "Flatpak de un usuario concreto: tiene que quedar en ese usuario, no en el --user de root.",
    "tuned: cambiar el profile y que siga puesto después del reboot.",
    "Recuperar root: hay que saber rd.break e init=/bin/bash. Si /sysroot no existe, el segundo.",
    "Autofs puede comerse el tiempo: no lo dejes para el final del reloj.",
  ],
  groupClient: "En el client",
  groupServer: "En el server",
  groupBoth: "En las dos",
  groupExtras: "Extras, si te queda tiempo",
  marksLegend: "Revisit (volver después) · Done (ya está)",
  emptyGroup: "Nada en este grupo.",
  passedMeta: "pasado, no lo entendiste",
  helpMeta: "con ayuda",
  redoMeta: "para rehacer",
  difficulty: "Dificultad",
  difficultyAria: "Dificultad del puntaje",
  levels: levelsEs,
  helpAsked: "Ayuda pedida",
  helpMarked: "Quedó marcado en las estadísticas de este lab. En el examen real esto no está.",
  stepsTitle: "Detalle del enunciado",
  commandsTitle: "Comandos para mirar",
  videosTitle: "Videos",
  askHelp: "Pedí ayuda",
  showHelp: "Ver ayuda",
  hideHelp: "Ocultar ayuda",
  redo: "Rehacer",
  skipTask: "No lo entiendo",
  actionsHint:
    "Revisit (volver después) te saca de esta tarea y la deja marcada para volver. Done (ya está) es cuando ya está: ahí elegís la dificultad del puntaje. Alto y muy alto quedan para rehacer. La ayuda no se abre hasta que la pedís.",
  undoText: "Listo. Si fue sin querer, podés volver.",
  undo: "Deshacer",
  closeRun: "Cerrar simulacro",
  deleteRun: "Eliminar este simulacro",
  summaryHint: "El detalle y la comparación contra otros intentos están en estadísticas.",
  backHome: "Volver al inicio",
  closed: "Simulacro cerrado",
  timedOut: "Se acabaron las 3 horas",
  abandoned: "Simulacro abandonado",
  inProgress: "En curso",
  statusPassed: "Pasado",
  statusRedo: "Rehacer",
  statusOpen: "Quedó abierto al cortar el tiempo",
  statusNone: "Sin marcar",
  attempt: (n) => `Intento ${n} de este lab. El reloj del lab volvió a cero.`,
  confirmDelete: "¿Eliminar este simulacro? Se borran sus tiempos de este navegador.",
  confirmClose: "¿Cerrar el simulacro con lo que marcaste hasta ahora?",
  statsTitle: "Estadísticas del simulacro",
  statsDescription: "Tiempos por lab, promedio, ayuda pedida y mejora contra el simulacro anterior. Guardado en este navegador.",
  statsHeading: "Estadísticas",
  statsIntro: "Separadas por modo. Sin pausas es la que importa (como el examen). Con pausas es práctica.",
  noClosed: "Todavía no hay un simulacro cerrado",
  noClosedBody: "Cuando cierres uno, o se acaben las 3 horas, acá se compara contra el anterior.",
  firstExam: "Este es el primer simulacro cerrado. El próximo se resta contra este tiempo.",
  fasterThan: (when) => `que el simulacro del ${when}.`,
  lastVsPrev: (last, prev) => `Último: ${last}. Anterior: ${prev}. Un número negativo es menos tiempo.`,
  simulacros: "Simulacros",
  labsDone: "Labs hechos",
  byLab: "Por lab",
  cols: ["Lab", "Último", "Promedio", "Mejor", "Vs anterior", "Dificultad", "Ayuda"],
  redoCell: "rehacer",
  statsNote:
    "El promedio usa los labs que marcaste hecho o pasado. Dificultad es la del último Done: alto y muy alto son los que conviene rehacer. Ayuda es cuántas de esas veces pediste el panel. Vs anterior compara el último cierre con el anterior de ese mismo lab.",
  history: "Historial",
  historyEmpty: "Cuando empieces uno, va a aparecer acá.",
  delete: "Eliminar",
  confirmDeleteNamed: (which) => `¿Eliminar ${which}? Se borran sus tiempos de este navegador.`,
  thisRunning: "el simulacro en curso",
  thisSaved: "este simulacro",
  download: "Descargar JSON",
  wipe: "Borrar tiempos de este navegador",
  confirmWipe: "¿Borrar todos los simulacros guardados en este navegador?",
  noTimes: "Sin tiempos todavía",
  noTimesBody: "Los contadores se guardan en este navegador. Empezá un simulacro y, cuando cierres un lab, el promedio y la mejora aparecen acá.",
  goHome: "Ir al inicio",
  faster: "más rápido",
  slower: "más lento",
  similar: "parecido",
  same: "igual",
};

const en: Copy = {
  skip: "Skip to content",
  brand: "RHCSA practice exam",
  nav: "Sections",
  statsNav: "Stats",
  glossaryNav: "Glossary",
  glossaryTitle: "RHCSA glossary",
  glossaryDescription: "Words and commands I do not want to forget for the RHCSA exam.",
  glossaryHeading: "Glossary",
  glossaryIntro: "Terms that stall me. Search by word or by the description. Where there is a tldr link, it opens usage examples in the community repo.",
  glossarySearch: "Search by word or description…",
  glossarySearchEmpty: "No matching entries.",
  glossaryTldr: "Examples on tldr",
  glossaryTldrRepo: "tldr-pages repo",
  cv: "CV",
  banner: "Personal practice for the October 30 RHCSA. This is not the official exam and not a Red Hat site.",
  homeTitle: "RHCSA practice exam",
  homeDescription: "I am preparing for the RHCSA on October 30, and I am using this as personal practice.",
  hello: "I am preparing to take the RHCSA exam on October 30, and I am using this as personal practice.",
  kicker: "Personal practice · EX200",
  headline: "Do what you already know first.",
  leadBefore: "A 3-hour clock and the full list, with Revisit (come back later) and Done (finished), as in the public Red Hat video ",
  leadAfter: ". Quick points go first. If something stalls you, mark it and move on.",
  start: "Start the practice exam",
  startAnother: "Start another",
  startModesLabel: "Start a practice exam",
  startPausable: "Practice with pauses",
  startPausableAnother: "Another with pauses",
  startFixed: "Start without pauses",
  startFixedAnother: "Another without pauses",
  startFixedHint: "The important mode: 3 hours straight, like the real exam.",
  modesNote: "Without pauses is what matters for measuring progress. With pauses is only practice: you can stop the clock.",
  resume: "Continue where you left off",
  startAnotherLabel: "Or start another",
  seeStats: "View my times",
  seeStatsFixed: "Times without pauses",
  seeStatsPausable: "Times with pauses",
  statsModeFixed: "Without pauses · like the exam",
  statsModePausable: "With pauses · practice",
  timesNote: "Times stay in this browser.",
  loading: "Loading local times…",
  improvement: "Improvement",
  improvementFixed: "Improvement without pauses",
  runs: "Practice exams",
  best: "Best time",
  withHelp: "With help",
  passed: "Skipped",
  lastClose: "Last close",
  howTitle: "How to take it",
  how: [
    "The main one is without pauses: 3 hours straight like the exam. With pauses is optional practice.",
    "Do what you already know first. Those are the quick points.",
    "Revisit (come back later): you got stuck, leave it marked, and move on.",
    "Done (finished): that one is done. Anything unmarked is still left.",
    "You do not have to go in order.",
  ],
  helpTitle: "Help",
  helpBody: "Each lab shows the title and the exact data to meet. Step-by-step detail, commands, and videos appear only after Ask for help, and that lab is counted as solved with help.",
  vmsTitle: "The two VMs",
  footerBefore: "Practice material: ",
  footerPlaylist: "YouTube playlist",
  footerAndRepo: " and ",
  footerRepo: "lab repo",
  footerAfterRepo: ". Covers V9 and newer videos: Flatpak, timers, and the init=/bin/bash reset.",
  footerVideoBefore: "The list with Revisit (come back later) and Done (finished) is based on the official video ",
  noscript: "This practice stores times in the browser and needs JavaScript.",
  videoTitle: "Inside a Red Hat certification exam: What you need to know",
  confirmReplace: "One is already running. If you start another, that one is saved as abandoned.",
  startedNote: (when) => `One started on ${when}. The clock continues from that moment.`,
  startedPausedNote: (when) => `One is paused, started on ${when}. The clock is stopped.`,
  startedPausableNote: (when) => `One with pauses started on ${when}. Pause stops the clock.`,
  firstClose: (clock) => `First close: ${clock}. The next one is compared with this.`,
  openRun: "A practice exam is still open. The comparison appears when it ends or the time runs out.",
  noCloseYet: "After you close the first one, this shows whether the next was shorter.",
  deltaLine: (delta, label) => `${delta} · ${label} than the previous one`,
  tally: ({ done, revisit, redo, skipped, help }) =>
    `${done} done · ${revisit} revisit · ${redo} to redo · ${skipped} not understood · ${help} with help`,
  examTitle: "Practice exam in progress",
  examDescription: "Current lab of the RHCSA practice exam, with a 3-hour clock. Help opens only if you ask.",
  emptyTitle: "No practice exam in progress",
  emptyBody: "The 3-hour clock starts when you begin, and the list shows what is left.",
  emptyHome: "Start from the home page",
  backToList: "Back to the list",
  enterLab: "Open",
  enterHint: "Open shows that task.",
  clock: "Exam clock",
  pause: "Pause",
  resumeClock: "Resume",
  paused: "Paused",
  floatDrag: "Drag",
  thisLab: "This lab",
  missing: "Left",
  redoCount: "Redo",
  revisit: "Revisit (come back later)",
  done: "Done (finished)",
  strategyTitle: "Do what you already know first",
  strategyBody:
    "Quick points go first, as in the public Red Hat video. If a task stalls you, mark it Revisit (come back later) and move on. Done (finished) means it is done: on that same line you set how hard the points felt. High and very high are the ones to redo. Anything unmarked is still left. You do not have to go in order.",
  listCreditBefore: "The list is built from the official video ",
  groupMachine: "Machine setup",
  setupAside: "Does not count as a lab.",
  kitTitle: "For exam day",
  kitBody:
    "They send the ISO by Gmail. That ISO gives you a window to run practice tests. There is no demo of how to set it up or how it will work, and it is not clear whether you can try the machine beforehand. Go prepared.",
  kitItems: [
    "A wired keyboard.",
    "A wired camera.",
    "If you take it on a laptop, an extra USB adapter, if you can.",
    "A bootable USB with the exam ISO.",
  ],
  kitCaveat: "I gathered this from different places. I have not taken the exam yet, so it is not confirmed.",
  updatesTitle: "Newer info I gathered",
  updatesIntro: "Things I found later about preparing for EX200 v10. Not the official exam wording.",
  updates: [
    "Grow a VG, the swap partition, and create a new LV: practice until you can do them without opening help.",
    "A Flatpak for one specific user: it has to belong to that user, not to root's --user.",
    "tuned: change the profile and leave it in place after a reboot.",
    "Recovering root: know both rd.break and init=/bin/bash. If /sysroot does not exist, use the second.",
    "Autofs can eat the clock: do not leave it for the end.",
  ],
  groupClient: "On the client",
  groupServer: "On the server",
  groupBoth: "On both",
  groupExtras: "Extras, if you have time",
  marksLegend: "Revisit (come back later) · Done (finished)",
  emptyGroup: "Nothing in this group.",
  passedMeta: "skipped, you did not understand it",
  helpMeta: "with help",
  redoMeta: "to redo",
  difficulty: "Difficulty",
  difficultyAria: "How hard the points felt",
  levels: levelsEn,
  helpAsked: "Help requested",
  helpMarked: "This lab is marked in the stats. The real exam does not have this.",
  stepsTitle: "Task detail",
  commandsTitle: "Commands to look at",
  videosTitle: "Videos",
  askHelp: "Ask for help",
  showHelp: "Show help",
  hideHelp: "Hide help",
  redo: "Redo",
  skipTask: "I don't get it",
  actionsHint:
    "Revisit (come back later) leaves this task and keeps it marked so you can return. Done (finished) means it is done: then you set how hard the points felt. High and very high stay marked to redo. Help stays closed until you ask.",
  undoText: "Saved. If that was a mistake, you can go back.",
  undo: "Undo",
  closeRun: "Close practice exam",
  deleteRun: "Delete this practice exam",
  summaryHint: "The detail and the comparison with other attempts are in stats.",
  backHome: "Back home",
  closed: "Practice exam closed",
  timedOut: "The 3 hours are over",
  abandoned: "Practice exam abandoned",
  inProgress: "In progress",
  statusPassed: "Skipped",
  statusRedo: "Redo",
  statusOpen: "Still open when time ran out",
  statusNone: "Unmarked",
  attempt: (n) => `Attempt ${n} of this lab. The lab clock went back to zero.`,
  confirmDelete: "Delete this practice exam? Its times are removed from this browser.",
  confirmClose: "Close the practice exam with what you have marked so far?",
  statsTitle: "Practice exam stats",
  statsDescription: "Time per lab, average, help requested, and improvement against the previous attempt. Stored in this browser.",
  statsHeading: "Stats",
  statsIntro: "Split by mode. Without pauses is what matters (like the exam). With pauses is practice.",
  noClosed: "No practice exam has been closed yet",
  noClosedBody: "When you close one, or the 3 hours run out, this compares it with the previous one.",
  firstExam: "This is the first closed practice exam. The next one is subtracted from this time.",
  fasterThan: (when) => `than the practice exam of ${when}.`,
  lastVsPrev: (last, prev) => `Latest: ${last}. Previous: ${prev}. A negative number means less time.`,
  simulacros: "Practice exams",
  labsDone: "Labs done",
  byLab: "By lab",
  cols: ["Lab", "Latest", "Average", "Best", "Vs previous", "Difficulty", "Help"],
  redoCell: "redo",
  statsNote:
    "The average uses labs you marked done or skipped. Difficulty is the last Done: high and very high are the ones to redo. Help is how many of those times you opened the panel. Vs previous compares the latest close with the one before for that same lab.",
  history: "History",
  historyEmpty: "When you start one, it shows up here.",
  delete: "Delete",
  confirmDeleteNamed: (which) => `Delete ${which}? Its times are removed from this browser.`,
  thisRunning: "the practice exam in progress",
  thisSaved: "this practice exam",
  download: "Download JSON",
  wipe: "Erase times in this browser",
  confirmWipe: "Erase every practice exam saved in this browser?",
  noTimes: "No times yet",
  noTimesBody: "Counters stay in this browser. Start a practice exam and, when you close a lab, the average and the improvement show up here.",
  goHome: "Go home",
  faster: "faster",
  slower: "slower",
  similar: "about the same",
  same: "same",
};

const UI: Record<Locale, Copy> = { es, en };

export function getUI(locale: Locale = DEFAULT_LOCALE): Copy {
  return UI[locale] ?? UI[DEFAULT_LOCALE];
}

export function difficultyLabel(
  value: "very_low" | "low" | "normal" | "high" | "very_high" | null | undefined,
  locale: Locale = pageLocale(),
): string {
  if (!value) return "";
  return getUI(locale).levels.find((item) => item.id === value)?.label ?? "";
}
