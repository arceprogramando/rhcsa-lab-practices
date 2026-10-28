export const DEFAULT_LOCALE = "es";
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE = "https://ex200-personal-practice.arceprog.dev";

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
  practice: { es: "practica", en: "personal-practice" },
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
  glossaryPopupSearch: string;
  glossaryPopupClose: string;
  glossaryShortcut: string;
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
  editionLabel: string;
  editionSwitch: (openVersion: string, nextVersion: string) => string;
  confirmStartOther: (openVersion: string, nextVersion: string) => string;
  editionV10: string;
  editionV9: string;
  editionNote: string;
  startModesLabel: string;
  startPausable: string;
  startPausableAnother: string;
  startFixed: string;
  startFixedAnother: string;
  startFixedHint: string;
  modesNote: string;
  resume: string;
  resumeEdition: (version: string) => string;
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
  footerBefore: string;
  footerPlaylist: string;
  footerAndRepo: string;
  footerRepo: string;
  footerAfterRepo: string;
  footerLegal: string;
  noscript: string;
  videoTitle: string;
  confirmReplace: string;
  resumeAbandoned: string;
  confirmResumeOther: string;
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
  copyCmd: string;
  copiedCmd: string;
  helpPickOne: string;
  helpOption: (n: number, name?: string) => string;
  asWho: (who: string) => string;
  videosTitle: string;
  askHelp: string;
  showHelp: string;
  hideHelp: string;
  redo: string;
  skipTask: string;
  actionsHint: string;
  closeRun: string;
  closeKept: string;
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
  coverageTitle: string;
  coverageLead: string;
  coverageNote: string;
  coverageCenter: string;
  coverageDone: string;
  coverageHelp: string;
  coverageRevisit: string;
  coverageMissing: string;
  coverageGap: (names: string) => string;
  coverageNone: string;
  coverageSolid: string;
  domainShort: Record<string, string>;
  domainName: Record<string, string>;
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
  brand: "Práctica personal",
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
  glossaryPopupSearch: "Buscar en el glosario…",
  glossaryPopupClose: "Cerrar",
  glossaryShortcut: "Ctrl+K abre el glosario",
  cv: "Sobre mí",
  banner: "Práctica personal para el RHCSA del 6 de noviembre. No es el examen oficial ni un sitio de Red Hat.",
  homeTitle: "Práctica personal para el examen RHCSA",
  homeDescription: "Hola, me estoy preparando para rendir el RHCSA el 6 de noviembre y estoy usando esto como práctica personal.",
  hello: "Hola, me estoy preparando para rendir el examen RHCSA el 6 de noviembre, y estoy usando esto como práctica personal.",
  kicker: "Práctica personal · EX200",
  headline: "Primero lo que ya sabés hacer.",
  leadBefore: "La estructura (reloj de 3 horas, Revisit y Done) está basada en el video público de Red Hat ",
  leadAfter: ". Los puntos rápidos van primero. Si algo te traba, lo marcás y seguís.",
  start: "Empezá la práctica",
  startAnother: "Empezar otra",
  editionLabel: "Versión a practicar",
  editionSwitch: (openVersion, nextVersion) =>
    `La abierta es ${openVersion}. Abajo empezás una nueva con ${nextVersion}. La abierta queda en el historial.`,
  confirmStartOther: (openVersion, nextVersion) =>
    `La práctica de ${openVersion} queda en el historial. ¿Empezás una nueva con ${nextVersion}?`,
  editionV10: "RHCSA 10 · Flatpak",
  editionV9: "RHCSA 9 · Podman",
  editionNote: "No sabemos cómo es el examen. En lo publicado, la 10 practica Flatpak y la 9 practica Podman.",
  startModesLabel: "Empezar una práctica",
  startPausable: "Práctica con pausas",
  startPausableAnother: "Otra con pausas",
  startFixed: "Empezar sin pausas",
  startFixedAnother: "Otro sin pausas",
  startFixedHint: "El modo para medir tiempos: 3 horas de corrido, sin pausas.",
  modesNote: "Sin pausas es el que importa para medir cómo vas. Con pausas es solo práctica: el reloj se puede frenar.",
  resume: "Seguí donde quedaste",
  resumeEdition: (version) => `Seguí donde quedaste · ${version}`,
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
  runs: "Prácticas",
  best: "Mejor tiempo",
  withHelp: "Con ayuda",
  passed: "Pasados",
  lastClose: "Último cierre",
  footerBefore: "Material de práctica: ",
  footerPlaylist: "lista de YouTube",
  footerAndRepo: " y ",
  footerRepo: "repo del lab",
  footerAfterRepo: ". Cubre V9 y videos más nuevos: Flatpak, timers y el reset con init=/bin/bash.",
  footerLegal:
    "arceprog no está afiliado a Red Hat, LLC. Red Hat y RHCSA son marcas de Red Hat, LLC, usadas solo para identificación.",
  noscript: "Esta práctica guarda los tiempos en el navegador y necesita JavaScript.",
  videoTitle: "Dentro de un examen de certificación Red Hat: Lo que necesita saber",
  confirmReplace: "Hay uno en curso. Si empezás otro, ese queda guardado como abandonado.",
  resumeAbandoned: "Seguir esta",
  confirmResumeOther: "Hay otra práctica en curso. Si seguís esta, esa otra pasa al historial y también se puede retomar.",
  startedNote: (when) => `Empezada el ${when}, con el reloj andando.`,
  startedPausedNote: (when) => `Empezada el ${when}, con el reloj frenado.`,
  startedPausableNote: (when) => `Empezada el ${when}, y podés frenar el reloj.`,
  firstClose: (clock) => `Primer cierre: ${clock}. El próximo se compara contra este.`,
  openRun: "Hay una práctica sin cerrar. La mejora aparece cuando termina o se acaba el tiempo.",
  noCloseYet: "Cuando cierres la primera, acá vas a ver si la siguiente fue más corta.",
  deltaLine: (delta, label) => `${delta} · ${label} que el anterior`,
  tally: ({ done, revisit, redo, skipped, help }) =>
    `${done} done · ${revisit} revisit · ${redo} para rehacer · ${skipped} sin entender · ${help} con ayuda`,
  examTitle: "Práctica en curso",
  examDescription: "Lab actual de la práctica personal para el examen RHCSA, con reloj de 3 horas. La ayuda se abre solo si la pedís.",
  emptyTitle: "No hay una práctica en curso",
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
    "La ISO en teoria llega por Gmail. Esa ISO te da un tiempo para hacer pruebas. No hay una demo de cómo configurarla ni de cómo va a funcionar, y no se sabe si se puede probar el equipo antes. Conviene ir preparado.",
  kitItems: [
    "Teclado con cable.",
    "Cámara con cable.",
    "Si rendís con notebook, un adaptador de USB de más, si podés.",
    "USB booteable con la ISO del examen.",
  ],
  kitCaveat: "Esta información la saqué de distintos lados. Todavía no rendí el examen, así que no está confirmada.",
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
  copyCmd: "Copiar",
  copiedCmd: "Copiado",
  helpPickOne: "Elegí una forma · no hace falta las dos",
  helpOption: (n, name) => (name ? `Opción ${n} · ${name}` : `Opción ${n}`),
  asWho: (who) => `Como ${who}`,
  videosTitle: "Videos",
  askHelp: "Pedí ayuda",
  showHelp: "Ver ayuda",
  hideHelp: "Ocultar ayuda",
  redo: "Rehacer",
  skipTask: "No lo entiendo",
  actionsHint:
    "Revisit (volver después) te saca de esta tarea y la deja marcada para volver. Done (ya está) es cuando ya está: ahí elegís la dificultad del puntaje. Alto y muy alto quedan para rehacer. La ayuda no se abre hasta que la pedís.",
  closeRun: "Terminar y guardar",
  closeKept: "Los tiempos quedan en este navegador.",
  deleteRun: "Eliminar esta práctica",
  summaryHint: "El detalle y la comparación contra otros intentos están en estadísticas.",
  backHome: "Volver al inicio",
  closed: "Práctica cerrada",
  timedOut: "Se acabaron las 3 horas",
  abandoned: "Práctica abandonada",
  inProgress: "En curso",
  statusPassed: "Pasado",
  statusRedo: "Rehacer",
  statusOpen: "Quedó abierto al cortar el tiempo",
  statusNone: "Sin marcar",
  attempt: (n) => `Intento ${n} de este lab. El reloj del lab volvió a cero.`,
  confirmDelete: "¿Eliminar esta práctica? Se borran sus tiempos de este navegador.",
  confirmClose: "¿Terminar y guardar lo que marcaste hasta ahora?",
  statsTitle: "Estadísticas de la práctica",
  statsDescription: "Tiempos por lab, promedio, ayuda pedida y mejora contra la práctica anterior. Guardado en este navegador.",
  statsHeading: "Estadísticas",
  statsIntro: "Separadas por modo. Sin pausas es la que importa (como el examen). Con pausas es práctica libre.",
  coverageTitle: "Qué falta practicar",
  coverageLead: "Las barras agrupan los labs por tema. El largo es cuánto de ese grupo ya hiciste en este modo.",
  coverageNote:
    "Hecho sin abrir la ayuda cuenta entero. Hecho con la ayuda abierta cuenta la mitad. Volver a ver cuenta un cuarto. Se queda el mejor de todas las prácticas de este modo, también la que está en curso. Con RHCSA 10, Podman no entra en la cuenta. Con la 9, Flatpak no entra. Los temas los armamos nosotros para ver qué falta practicar.",
  coverageCenter: "cobertura",
  coverageDone: "hecho",
  coverageHelp: "con ayuda",
  coverageRevisit: "a revisar",
  coverageMissing: "falta",
  coverageGap: (names) => `Empezá por ${names}.`,
  coverageNone: "En este modo todavía no hay un lab hecho.",
  coverageSolid: "En este modo, todos los temas tienen sus labs hechos.",
  domainShort: {
    tools: "Archivos",
    software: "Paquetes",
    scripts: "Scripts",
    systems: "Arranque",
    storage: "Discos",
    filesystems: "NFS",
    deploy: "Servicios",
    network: "Red",
    users: "Cuentas",
    security: "SELinux",
  },
  domainName: {
    tools: "Archivos, grep y comprimidos",
    software: "Paquetes y Flatpak",
    scripts: "Scripts",
    systems: "Arranque y tuned",
    storage: "Discos, LVM y swap",
    filesystems: "NFS, permisos y resize",
    deploy: "Servicios, cron y hora",
    network: "Red y hostname",
    users: "Usuarios y sudo",
    security: "SELinux y firewall",
  },
  noClosed: "Todavía no hay una práctica cerrada",
  noClosedBody: "Cuando cierres una, o se acaben las 3 horas, acá se compara contra la anterior.",
  firstExam: "Esta es la primera práctica cerrada. La próxima se resta contra este tiempo.",
  fasterThan: (when) => `que la práctica del ${when}.`,
  lastVsPrev: (last, prev) => `Último: ${last}. Anterior: ${prev}. Un número negativo es menos tiempo.`,
  simulacros: "Prácticas",
  labsDone: "Labs hechos",
  byLab: "Por lab",
  cols: ["Lab", "Último", "Promedio", "Mejor", "Vs anterior", "Dificultad", "Ayuda"],
  redoCell: "rehacer",
  statsNote:
    "El promedio usa los labs que marcaste hecho o pasado. Dificultad es la del último Done: alto y muy alto son los que conviene rehacer. Ayuda es cuántas de esas veces pediste el panel. Vs anterior compara el último cierre con el anterior de ese mismo lab.",
  history: "Historial",
  historyEmpty: "Cuando empieces una, va a aparecer acá.",
  delete: "Eliminar",
  confirmDeleteNamed: (which) => `¿Eliminar ${which}? Se borran sus tiempos de este navegador.`,
  thisRunning: "la práctica en curso",
  thisSaved: "esta práctica",
  download: "Descargar JSON",
  wipe: "Borrar tiempos de este navegador",
  confirmWipe: "¿Borrar todas las prácticas guardadas en este navegador?",
  noTimes: "Sin tiempos todavía",
  noTimesBody: "Los contadores se guardan en este navegador. Empezá una práctica y, cuando cierres un lab, el promedio y la mejora aparecen acá.",
  goHome: "Ir al inicio",
  faster: "más rápido",
  slower: "más lento",
  similar: "parecido",
  same: "igual",
};

const en: Copy = {
  skip: "Skip to content",
  brand: "Personal practice",
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
  glossaryPopupSearch: "Search the glossary…",
  glossaryPopupClose: "Close",
  glossaryShortcut: "Ctrl+K opens the glossary",
  cv: "About me",
  banner: "Personal practice for the November 6 RHCSA. This is not the official exam and not a Red Hat site.",
  homeTitle: "Personal practice for the RHCSA exam",
  homeDescription: "I am preparing for the RHCSA on November 6, and I am using this as personal practice.",
  hello: "I am preparing to take the RHCSA exam on November 6, and I am using this as personal practice.",
  kicker: "Personal practice · EX200",
  headline: "Do what you already know first.",
  leadBefore: "The structure (3-hour clock, Revisit and Done) is based on the public Red Hat video ",
  leadAfter: ". Quick points go first. If something stalls you, mark it and move on.",
  start: "Start practice",
  startAnother: "Start another",
  editionLabel: "Version to practice",
  editionSwitch: (openVersion, nextVersion) =>
    `The open one is ${openVersion}. Below you start a new one with ${nextVersion}. The open one stays in the history.`,
  confirmStartOther: (openVersion, nextVersion) =>
    `The ${openVersion} practice stays in the history. Start a new one with ${nextVersion}?`,
  editionV10: "RHCSA 10 · Flatpak",
  editionV9: "RHCSA 9 · Podman",
  editionNote: "We don't know what the exam is like. From what's published, 10 practices Flatpak and 9 practices Podman.",
  startModesLabel: "Start a practice",
  startPausable: "Practice with pauses",
  startPausableAnother: "Another with pauses",
  startFixed: "Start without pauses",
  startFixedAnother: "Another without pauses",
  startFixedHint: "The mode for measuring time: 3 hours straight, without pauses.",
  modesNote: "Without pauses is what matters for measuring progress. With pauses is only practice: you can stop the clock.",
  resume: "Continue where you left off",
  resumeEdition: (version) => `Continue where you left off · ${version}`,
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
  runs: "Practice runs",
  best: "Best time",
  withHelp: "With help",
  passed: "Skipped",
  lastClose: "Last close",
  footerBefore: "Practice material: ",
  footerPlaylist: "YouTube playlist",
  footerAndRepo: " and ",
  footerRepo: "lab repo",
  footerAfterRepo: ". Covers V9 and newer videos: Flatpak, timers, and the init=/bin/bash reset.",
  footerLegal:
    "arceprog is not affiliated with Red Hat, LLC. Red Hat and RHCSA are trademarks of Red Hat, LLC, used for identification only.",
  noscript: "This practice stores times in the browser and needs JavaScript.",
  videoTitle: "Inside a Red Hat certification exam: What you need to know",
  confirmReplace: "One is already running. If you start another, that one is saved as abandoned.",
  resumeAbandoned: "Continue this one",
  confirmResumeOther: "Another practice is in progress. If you continue this one, that other one goes to the history and can be continued too.",
  startedNote: (when) => `Started on ${when}. The clock is running.`,
  startedPausedNote: (when) => `Started on ${when}. The clock is stopped.`,
  startedPausableNote: (when) => `Started on ${when}. You can stop the clock.`,
  firstClose: (clock) => `First close: ${clock}. The next one is compared with this.`,
  openRun: "A practice run is still open. The comparison appears when it ends or the time runs out.",
  noCloseYet: "After you close the first one, this shows whether the next was shorter.",
  deltaLine: (delta, label) => `${delta} · ${label} than the previous one`,
  tally: ({ done, revisit, redo, skipped, help }) =>
    `${done} done · ${revisit} revisit · ${redo} to redo · ${skipped} not understood · ${help} with help`,
  examTitle: "Practice in progress",
  examDescription: "Current lab of personal practice for the RHCSA exam, with a 3-hour clock. Help opens only if you ask.",
  emptyTitle: "No practice in progress",
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
    "In theory the ISO arrives by Gmail. That ISO gives you a window to run practice tests. There is no demo of how to set it up or how it will work, and it is not clear whether you can try the machine beforehand. Go prepared.",
  kitItems: [
    "A wired keyboard.",
    "A wired camera.",
    "If you take it on a laptop, an extra USB adapter, if you can.",
    "A bootable USB with the exam ISO.",
  ],
  kitCaveat: "I gathered this from different places. I have not taken the exam yet, so it is not confirmed.",
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
  copyCmd: "Copy",
  copiedCmd: "Copied",
  helpPickOne: "Pick one way · you do not need both",
  helpOption: (n, name) => (name ? `Option ${n} · ${name}` : `Option ${n}`),
  asWho: (who) => `As ${who}`,
  videosTitle: "Videos",
  askHelp: "Ask for help",
  showHelp: "Show help",
  hideHelp: "Hide help",
  redo: "Redo",
  skipTask: "I don't get it",
  actionsHint:
    "Revisit (come back later) leaves this task and keeps it marked so you can return. Done (finished) means it is done: then you set how hard the points felt. High and very high stay marked to redo. Help stays closed until you ask.",
  closeRun: "Finish and save",
  closeKept: "The times stay in this browser.",
  deleteRun: "Delete this practice",
  summaryHint: "The detail and the comparison with other attempts are in stats.",
  backHome: "Back home",
  closed: "Practice closed",
  timedOut: "The 3 hours are over",
  abandoned: "Practice abandoned",
  inProgress: "In progress",
  statusPassed: "Skipped",
  statusRedo: "Redo",
  statusOpen: "Still open when time ran out",
  statusNone: "Unmarked",
  attempt: (n) => `Attempt ${n} of this lab. The lab clock went back to zero.`,
  confirmDelete: "Delete this practice? Its times are removed from this browser.",
  confirmClose: "Finish and save what you have marked so far?",
  statsTitle: "Practice stats",
  statsDescription: "Time per lab, average, help requested, and improvement against the previous attempt. Stored in this browser.",
  statsHeading: "Stats",
  statsIntro: "Split by mode. Without pauses is what matters (like the exam). With pauses is free practice.",
  coverageTitle: "What still needs practice",
  coverageLead: "The bars group the labs by topic. The length is how much of that group you have already done in this mode.",
  coverageNote:
    "Done without opening help counts in full. Done with help open counts as half. Revisit counts as a quarter. The best mark across every practice in this mode is kept, including the one in progress. On RHCSA 10, Podman stays out of the count. On 9, Flatpak stays out. We made these topics to see what still needs practice.",
  coverageCenter: "coverage",
  coverageDone: "done",
  coverageHelp: "with help",
  coverageRevisit: "revisit",
  coverageMissing: "missing",
  coverageGap: (names) => `Start with ${names}.`,
  coverageNone: "No lab is done yet in this mode.",
  coverageSolid: "In this mode, every topic has its labs done.",
  domainShort: {
    tools: "Files",
    software: "Packages",
    scripts: "Scripts",
    systems: "Boot",
    storage: "Disks",
    filesystems: "NFS",
    deploy: "Services",
    network: "Network",
    users: "Accounts",
    security: "SELinux",
  },
  domainName: {
    tools: "Files, grep, and archives",
    software: "Packages and Flatpak",
    scripts: "Scripts",
    systems: "Boot and tuned",
    storage: "Disks, LVM, and swap",
    filesystems: "NFS, permissions, and resize",
    deploy: "Services, cron, and time",
    network: "Network and hostname",
    users: "Users and sudo",
    security: "SELinux and firewall",
  },
  noClosed: "No practice has been closed yet",
  noClosedBody: "When you close one, or the 3 hours run out, this compares it with the previous one.",
  firstExam: "This is the first closed practice. The next one is subtracted from this time.",
  fasterThan: (when) => `than the practice of ${when}.`,
  lastVsPrev: (last, prev) => `Latest: ${last}. Previous: ${prev}. A negative number means less time.`,
  simulacros: "Practice runs",
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
  thisRunning: "the practice in progress",
  thisSaved: "this practice",
  download: "Download JSON",
  wipe: "Erase times in this browser",
  confirmWipe: "Erase every practice run saved in this browser?",
  noTimes: "No times yet",
  noTimesBody: "Counters stay in this browser. Start a practice and, when you close a lab, the average and the improvement show up here.",
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
