import type { Locale } from "./i18n";
import { LAB_EN } from "./labs-en";

export const YT_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLzwsIhHG_OdZiC6ugglW4TzjIM8wrJDrt";

export const REDHAT_EXAM_VIDEO = "https://www.youtube.com/watch?v=Me6Y12-sux8";

export const REDHAT_EXAM_VIDEO_TITLE =
  "Dentro de un examen de certificación Red Hat: Lo que necesita saber";

export const LAB_REPO = "https://github.com/nbaud/rhcsa_lab";

/** Videos exactos de la serie RHCSA (EX200), en el orden de esa playlist. */
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const YT = {
  vagrant9: yt("wQkpSwSzp5k"),
  vagrant10: yt("hMUA_hCIFJQ"),
  nmtui: yt("fhrYQwGrjZw"),
  nmcli: yt("BMRXlUFAOA8"),
  repos: yt("PrJT4y1sk-g"),
  reposLocal: yt("Z_ajOZjmYTM"),
  selinuxPort: yt("71BWFUvLXZI"),
  users: yt("iy3YU6IDQAc"),
  setgid: yt("CYdEgCMUz-Q"),
  cron: yt("zwH-noYukwI"),
  autofs: yt("N3eZMi4I3oY"),
  tar: yt("CqpUq__LBJ0"),
  acl: yt("JFY-XyATtR8"),
  chrony: yt("TvQWBDA7qHQ"),
  find: yt("OjKxQYuItxY"),
  grep: yt("vVeZENoGrS8"),
  uid: yt("Mg3OdomnoJo"),
  lvmCreate: yt("YIDlpaz2FGQ"),
  lvmExtend: yt("wHeBnPtMroY"),
  swap: yt("60CPUPN2cYo"),
  lvmResize: yt("pEsAZjsdFQc"),
  tuned: yt("I1f0NMoY1eQ"),
  loginUser: yt("ZUI1-zr6N8M"),
  loginAll: yt("LV6C2bOxIvE"),
  podmanRegistry: yt("eIyivl1AvpA"),
  podmanPull: yt("OnEKJlzJEv4"),
  podmanSystemd: yt("ln_rtv3oDfE"),
  rootRdBreak: yt("y7Qy9MiIzAc"),
  rootInitBash: yt("nbt5adKvn9M"),
  flatpak: yt("K426-l3Ji4U"),
  flatpakReview: `${yt("l3Sj-ZBysFU")}&t=199s`,
  scripting: yt("81wAczPBcOQ"),
  timers: yt("01sICGFsS2k"),
  selinuxFtp: yt("3mYwqNE5at8"),
} as const;

export interface LabVideo {
  title: string;
  url: string;
}

export interface LabCommand {
  cmd: string;
  why: string;
  /** Quién ejecuta el comando: root, felipe, consola VM, etc. */
  as?: string;
  /** Same id = mutually exclusive alternatives; pick one. */
  orGroup?: string;
  /** Short label next to Opción N, e.g. cp --parents */
  orName?: string;
  /** Optional aside. A small mark on this command; the text shows on hover. */
  slip?: string;
}

export type Edition = "v10" | "v9";

const PODMAN_IDS = new Set(["lab-20", "lab-21", "lab-22"]);
const FLATPAK_IDS = new Set(["extra-04", "extra-05"]);
const EDITION_KEY = "arceprog:rhcsa-edition";

export function loadEdition(): Edition {
  if (typeof localStorage === "undefined") return "v10";
  return localStorage.getItem(EDITION_KEY) === "v9" ? "v9" : "v10";
}

export function saveEdition(edition: Edition): void {
  localStorage.setItem(EDITION_KEY, edition);
}

/** v10: Flatpak in the main list, Podman in extras. v9 keeps the original tracks. */
export function trackFor(lab: Lab, edition: Edition): Lab["track"] {
  if (edition === "v10" && PODMAN_IDS.has(lab.id)) return "extra";
  if (edition === "v10" && FLATPAK_IDS.has(lab.id)) return "pdf";
  return lab.track;
}

/** The container topic that is not the one you are practicing. It stays visible as an extra and does not count as missing. */
export function isOffEdition(labId: string, edition: Edition): boolean {
  return edition === "v10" ? PODMAN_IDS.has(labId) : FLATPAK_IDS.has(labId);
}

export interface Lab {
  id: string;
  track: "pdf" | "extra" | "setup";
  title: string;
  /** Situación del lab, en una o dos frases. */
  story?: string;
  objective: string[];
  where: string;
  steps: string[];
  note?: string;
  help: {
    tip: string;
    videoHint: string;
    videos: LabVideo[];
    commands: LabCommand[];
  };
}

export const LABS: Lab[] = [
  {
    id: "setup-keyboard",
    track: "setup",
    title: "El teclado de la consola no coincide",
    story: "En la ventana de la máquina virtual las teclas no salen como las ves. En el cliente se puede pasar al latinoamericano. En el servidor hay que dejar el de Estados Unidos, porque el rescate se escribe ahí.",
    objective: [
      "En vagrant ssh el teclado lo pone tu máquina.",
      "En el client podés pasar a latam / la-latin1 para la consola de la VM.",
      "En el server dejá el teclado en us.",
    ],
    where: "client · vagrant ssh. El server se deja en us",
    steps: [
      "Esta ventana de vagrant ssh usa el teclado de tu máquina. Aunque localectl status diga us, acá escribís en español.",
      "Si vas a escribir en la ventana de VirtualBox del client: sudo localectl set-x11-keymap latam y sudo localectl set-keymap la-latin1. Si solo entrás por SSH, podés dejarlo en us.",
      "En el server no corras esos dos. El rescate se escribe en la consola de esa VM y arranca en us.",
    ],
    note: "Que el examen use el teclado us lo saqué de distintos lados. Todavía no lo rendí para confirmarlo.",
    help: {
      tip: "En vagrant ssh escribís con el teclado de tu máquina. El us molesta en la consola de la VM: la ventana de VirtualBox, GRUB o init=/bin/bash. Ahí, si VC Keymap es us, la tecla que ves no es la letra que sale.",
      videoHint: "El teclado no tiene video propio. Estos son los de armar la VM con Vagrant (Rocky 9 y Rocky 10).",
      videos: [
        { title: "Lab 00a: Vagrant y VirtualBox (Rocky 9)", url: YT.vagrant9 },
        { title: "Lab 00b: Vagrantfile para Rocky 10", url: YT.vagrant10 },
      ],
      commands: [
        { cmd: "localectl --help", why: "Lista los comandos. No hay get ni set. Para ver lo que está puesto se usa status. Para cambiar, los que empiezan con set-. Esos piden sudo.", as: "root" },
        { cmd: "man localectl", why: "La misma lista, con la explicación de cada argumento. set-keymap es la consola. set-x11-keymap es el gráfico.", as: "root" },
        { cmd: "localectl status", why: "VC Keymap es la consola de la VM. X11 Layout es el gráfico. unset quiere decir que no hay uno configurado. Ninguno de los dos cambia lo que escribís en vagrant ssh.", as: "consola VM" },
        { cmd: "localectl list-x11-keymap-layouts", why: "Teclados gráficos. us es inglés de Estados Unidos. latam es latinoamericano.", as: "root" },
        { cmd: "localectl list-keymaps", why: "Teclados de la consola. El latinoamericano acá se llama la-latin1, no latam.", as: "root" },
        { cmd: "sudo localectl set-x11-keymap latam", why: "Cambia el gráfico de la VM. Esta SSH no lo usa. X11 Layout unset es normal si nunca se configuró. No lo hagas en el server.", as: "root" },
        { cmd: "sudo localectl set-keymap la-latin1", why: "Cambia la consola de la VM, no esta SSH. Sirve si escribís en la ventana de VirtualBox. En el server no lo hagas: el rescate se escribe ahí.", as: "consola VM" },
        { cmd: "cat /etc/vconsole.conf", why: "KEYMAP es el que puede cargar la consola al boot. En el server tiene que seguir en us.", as: "root" },
      ],
    },
  },
  {
    id: "lab-01-root-client",
    track: "pdf",
    title: "El cliente olvidó la contraseña de root",
    story: "Tuvimos un percance. Esta máquina la configuró un antiguo empleado que renunció, perdimos la comunicación y la necesitamos urgente para seguir con las configuraciones.",
    objective: [
      "Reset de la contraseña de root en el client.",
      "Nueva contraseña: student.",
      "SELinux coherente antes del boot normal.",
    ],
    where: "client",
    steps: [
      "Interrumpí el boot del client y recuperá el acceso de root.",
      "Poné la contraseña de root en student (las dos veces iguales).",
      "SELinux tiene que quedar coherente antes de volver al boot normal (autorelabel si hace falta).",
    ],
    note: "Es el mismo rescate que en el server, también con password student. Practicá los dos. A mí me funcionó init=/bin/bash. rd.break puede no armar /sysroot en v10.",
    help: {
      tip: "Esto se hace en la ventana de la VM del client. SSH no sirve: no hay forma de editar GRUB desde afuera. En passwd escribí student dos veces. Si no coinciden, dice passwords do not match. Authentication token manipulation error también sale si el disco sigue en solo lectura.",
      videoHint: "Q22b es init=/bin/bash, el que me funcionó. Q22a es rd.break y puede no funcionar en v10.",
      videos: [
        { title: "Q22b: Reset de root (init=/bin/bash)", url: YT.rootInitBash },
        { title: "Q22a: Reset de root (rd.break)", url: YT.rootRdBreak },
      ],
      commands: [
        { cmd: "En GRUB: tecla e, al final de la línea que empieza con linux, agregar init=/bin/bash. Ctrl-x para arrancar.", why: "Es el que me funcionó. Q22b. La raíz queda en /, no en /sysroot.", as: "consola VM", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "mount -o remount,rw /", why: "Acá la raíz es /, no /sysroot. Arranca solo lectura. Sin este remount, passwd no puede guardar la contraseña.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "passwd", why: "Pide la contraseña dos veces: las dos tienen que ser student. No hace falta escribir root: en este shell ya sos root.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "touch /.autorelabel", why: "La línea del enunciado «SELinux coherente antes del boot normal» es este comando. No hay otro paso para esa frase. passwd toca /etc/shadow desde este shell y el archivo puede quedar con una etiqueta que SELinux no acepta. Este archivo vacío hace que el próximo boot reetiquete el disco antes de arrancar normal. Sin eso, en enforcing nadie puede entrar, ni root con la clave nueva. Ese primer arranque tarda más.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "sync", why: "Baja a disco lo que todavía está en memoria, antes de cortar.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "exec /sbin/reboot -f", why: "Reinicia ya. El -f no se saca. En este arranque bash es el proceso 1 y no hay systemd. Sin -f, reboot pide el cierre normal y mata ese proceso 1. El kernel se queda en Kernel panic - not syncing: Attempted to kill init. No vuelve el shell: reset de la VM. exec reemplaza el shell para que el reinicio ocupe ese proceso 1. exit hace el mismo panic. La edición de GRUB era solo de ese arranque.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "En GRUB: tecla e, al final de la línea que empieza con linux, agregar rd.break. Ctrl-x para arrancar.", why: "Es el otro video, Q22a. Puede no funcionar en v10. Si /sysroot no existe, volvé a la opción 1.", as: "consola VM", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "mount -o remount,rw /sysroot", why: "Pone escribible el sistema que rd.break dejó en /sysroot. Si dice que /sysroot no existe, este método no entró. Ahí se vuelve a la opción 1.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "chroot /sysroot", why: "Entra al sistema real. passwd y touch de abajo corren ahí, no en el shell de afuera.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "passwd", why: "Otra vez student dos veces, iguales.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "touch /.autorelabel", why: "La línea del enunciado «SELinux coherente antes del boot normal» es este comando. No hay otro paso para esa frase. passwd toca /etc/shadow y puede dejarle una etiqueta que SELinux no acepta. Sin este archivo, el boot normal en enforcing no deja entrar a nadie. El primer arranque reetiqueta el disco y tarda más.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "exit", why: "Sale del chroot y vuelve al shell de rd.break.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "reboot", why: "Sigue el boot. En el video de rd.break el orden es exit y después reboot.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
      ],
    },
  },
  {
    id: "lab-01",
    track: "pdf",
    title: "Hay que nombrar al cliente y sacarlo de la red principal",
    story: "Necesitamos conectar dos computadoras fuera de la red principal. Esta es la máquina cliente: hay que ponerle nombre y configurarle la dirección, la puerta de enlace y el DNS.",
    objective: [
      "IP 172.16.1.12/24 en la interfaz del lab.",
      "Gateway 172.16.1.1 y DNS 172.16.1.1.",
      "Hostname client.rhcsa.lab.",
      "Persistente tras reboot.",
    ],
    where: "client",
    steps: [
      "IP 172.16.1.12/24 en la interfaz del lab (enp0s8).",
      "Gateway 172.16.1.1 y DNS 172.16.1.1.",
      "Hostname client.rhcsa.lab.",
      "Todo persistente. Después de reboot, nmcli y hostnamectl tienen que mostrar lo mismo.",
    ],
    note: "El PDF original pedía otro hostname. Acá se usa el del Vagrantfile: client.rhcsa.lab.",
    help: {
      tip: "En el examen se edita el perfil que ya existe, no se crea otro encima. El nombre para el comando es la columna NAME, no la placa. En una salida donde DEVICE enp0s8 está en la fila hostonly, el modify usa hostonly. enp0s3 es la otra placa: si por ahí entraste, no la pases a manual. lo es la máquina hablándose a sí misma: no se toca.",
      videoHint: "Q01a es nmtui. Q01b es nmcli y hostnamectl. Los dos hacen la misma red.",
      videos: [
        { title: "Q01a: Red con nmtui", url: YT.nmtui },
        { title: "Q01b: Red con nmcli y hostnamectl", url: YT.nmcli },
      ],
      commands: [
        { cmd: "nmcli connection show", why: "No cambia nada. Lista los perfiles guardados, una fila por perfil. NAME es el nombre que vas a escribir en el modify: puede no coincidir con la placa. DEVICE es la placa que ese perfil está usando ahora. Si ves enp0s3 y enp0s8, no se elige el primero: se elige la fila cuyo DEVICE es la placa del lab. En el ejemplo, DEVICE enp0s8 está en la fila cuyo NAME es hostonly, así que el comando usa hostonly. lo es el loopback, la máquina consigo misma. Esa fila no se edita. Tab no hace falta para esto. Si al apretarlo salen archivos de la carpeta, el shell no tiene cargadas las palabras de nmcli. En el examen no se instala nada para arreglarlo: el nombre se copia de la columna NAME.", as: "root" },
        { cmd: "ip -br a", why: "Para saber cuál placa es la del lab, antes de cambiar nada. El nombre enp0s3 o enp0s8 no dice el rol: es el orden en que VirtualBox enchufó las placas. La que ya tiene 10.0.2.15 es la entrada, la NAT. No se pasa a manual. La otra ethernet es la del lab. En este Vagrant suele ser enp0s8, y al principio puede tener otra IP, por ejemplo 192.168.56. Esa palabra se busca en la columna DEVICE de connection show. La NAME de esa misma fila es la que se modifica. lo es la máquina consigo misma: no se toca.", as: "root" },
        { cmd: "nmtui", why: "En la conexión de enp0s8: IPv4 en Manual, Address 172.16.1.12/24, Gateway 172.16.1.1 y, en DNS servers, Add 172.16.1.1. Si dice <Add...>, el DNS no está puesto.", as: "root", orGroup: "net-set", orName: "nmtui" },
        { cmd: "nmcli connection modify NOMBRE ipv4.method manual ipv4.addresses 172.16.1.12/24 ipv4.gateway 172.16.1.1 ipv4.dns 172.16.1.1", why: "NOMBRE es la columna NAME de la fila del lab, no la placa. Si esa fila dice hostonly y DEVICE enp0s8, el comando es modify hostonly. Guarda la IP, el gateway y el DNS en ese perfil. ipv4.dns es el pedazo que anota el DNS. Sin eso, el DNS no queda. sudo hace falta si el prompt es vagrant@. Si ya es root@, sudo no suma nada.", as: "root", orGroup: "net-set", orName: "nmcli" },
        { cmd: "restorecon -v /etc/NetworkManager/system-connections/NOMBRE.nmconnection", why: "No es un paso de siempre. Solo si el modify anterior dice Permission denied al renombrar el .nmconnection, aunque el prompt ya sea root@. El archivo se llama como la columna NAME: si el perfil es hostonly, el archivo es hostonly.nmconnection. SELinux no deja que NetworkManager lo reemplace. Este comando no guarda el DNS. Corrige la etiqueta y, si hacía falta, avisa Relabeled. Después se vuelve a correr el modify.", as: "root" },
        { cmd: "nmcli -f ipv4.dns connection show NOMBRE", why: "No cambia nada. NOMBRE es otra vez la columna NAME, por ejemplo hostonly. Muestra solo el DNS guardado en ese perfil. Si quedó, la línea dice ipv4.dns: 172.16.1.1. Si sale vacío, no quedó. ip a no muestra el DNS.", as: "root" },
        { cmd: "nmcli connection up NOMBRE", why: "Aplica ahora lo que el modify ya guardó en ese perfil. No es lo que lo hace persistente: el modify ya lo escribió en disco. up sirve para no esperar al reboot. NOMBRE sigue siendo la columna NAME.", slip: "Me pasó: el perfil quedó bien y activé enp0s3 en vez de enp0s8. Por eso la IP seguía igual.", as: "root" },
        { cmd: "hostnamectl set-hostname client.rhcsa.lab", why: "Cambia el hostname ya, y lo guarda. No hace falta nmcli connection up ni ningún otro up: el hostname no es parte del perfil de red. Después de un reboot, hostnamectl tiene que seguir diciendo client.rhcsa.lab.", as: "root" },
        { cmd: "man nmcli", why: "En el examen esto es legal. Buscá connection modify.", as: "root" },
      ],
    },
  },
  {
    id: "lab-02-root-server",
    track: "pdf",
    title: "El servidor olvidó la contraseña de root",
    story: "El mismo percance, en la otra máquina. El empleado se fue y nadie puede entrar como root. Hay que recuperar el servidor para seguir trabajando.",
    objective: [
      "Reset de la contraseña de root en el server.",
      "Nueva contraseña: student.",
      "SELinux coherente antes del boot normal.",
    ],
    where: "server",
    steps: [
      "Interrumpí el boot del server y recuperá el acceso de root.",
      "Poné la contraseña de root en student (las dos veces iguales).",
      "SELinux tiene que quedar coherente antes de volver al boot normal (autorelabel si hace falta).",
    ],
    note: "Es el mismo rescate que en el client, también con password student. Practicá los dos. A mí me funcionó init=/bin/bash. rd.break puede no armar /sysroot en v10.",
    help: {
      tip: "Esto se hace en la ventana de la VM del server. SSH no sirve: no hay forma de editar GRUB desde afuera. En passwd escribí student dos veces. Si no coinciden, dice passwords do not match. Authentication token manipulation error también sale si el disco sigue en solo lectura.",
      videoHint: "Q22b es init=/bin/bash, el que me funcionó. Q22a es rd.break y puede no funcionar en v10.",
      videos: [
        { title: "Q22b: Reset de root (init=/bin/bash)", url: YT.rootInitBash },
        { title: "Q22a: Reset de root (rd.break)", url: YT.rootRdBreak },
      ],
      commands: [
        { cmd: "En GRUB: tecla e, al final de la línea que empieza con linux, agregar init=/bin/bash. Ctrl-x para arrancar.", why: "Es el que me funcionó. Q22b. La raíz queda en /, no en /sysroot.", as: "consola VM", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "mount -o remount,rw /", why: "Acá la raíz es /, no /sysroot. Arranca solo lectura. Sin este remount, passwd no puede guardar la contraseña.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "passwd", why: "Pide la contraseña dos veces: las dos tienen que ser student. No hace falta escribir root: en este shell ya sos root.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "touch /.autorelabel", why: "La línea del enunciado «SELinux coherente antes del boot normal» es este comando. No hay otro paso para esa frase. passwd toca /etc/shadow desde este shell y el archivo puede quedar con una etiqueta que SELinux no acepta. Este archivo vacío hace que el próximo boot reetiquete el disco antes de arrancar normal. Sin eso, en enforcing nadie puede entrar, ni root con la clave nueva. Ese primer arranque tarda más.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "sync", why: "Baja a disco lo que todavía está en memoria, antes de cortar.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "exec /sbin/reboot -f", why: "Reinicia ya. El -f no se saca. En este arranque bash es el proceso 1 y no hay systemd. Sin -f, reboot pide el cierre normal y mata ese proceso 1. El kernel se queda en Kernel panic - not syncing: Attempted to kill init. No vuelve el shell: reset de la VM. exec reemplaza el shell para que el reinicio ocupe ese proceso 1. exit hace el mismo panic. La edición de GRUB era solo de ese arranque.", as: "root", orGroup: "root-rescue", orName: "init=/bin/bash" },
        { cmd: "En GRUB: tecla e, al final de la línea que empieza con linux, agregar rd.break. Ctrl-x para arrancar.", why: "Es el otro video, Q22a. Puede no funcionar en v10. Si /sysroot no existe, volvé a la opción 1.", as: "consola VM", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "mount -o remount,rw /sysroot", why: "Pone escribible el sistema que rd.break dejó en /sysroot. Si dice que /sysroot no existe, este método no entró. Ahí se vuelve a la opción 1.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "chroot /sysroot", why: "Entra al sistema real. passwd y touch de abajo corren ahí, no en el shell de afuera.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "passwd", why: "Otra vez student dos veces, iguales.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "touch /.autorelabel", why: "La línea del enunciado «SELinux coherente antes del boot normal» es este comando. No hay otro paso para esa frase. passwd toca /etc/shadow y puede dejarle una etiqueta que SELinux no acepta. Sin este archivo, el boot normal en enforcing no deja entrar a nadie. El primer arranque reetiqueta el disco y tarda más.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "exit", why: "Sale del chroot y vuelve al shell de rd.break.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
        { cmd: "reboot", why: "Sigue el boot. En el video de rd.break el orden es exit y después reboot.", as: "root", orGroup: "root-rescue", orName: "rd.break" },
      ],
    },
  },
  {
    id: "lab-02",
    track: "pdf",
    title: "Hay que nombrar al servidor y sacarlo de la red principal",
    story: "La otra computadora del par. Es el servidor: hay que ponerle nombre y la dirección de esta red, para que el cliente pueda llegar.",
    objective: [
      "IP 172.16.1.13/24 en la interfaz del lab.",
      "Gateway 172.16.1.1 y DNS 172.16.1.1.",
      "Hostname server.rhcsa.lab.",
      "Persistente tras reboot.",
    ],
    where: "server",
    steps: [
      "IP 172.16.1.13/24 en la interfaz del lab (enp0s8).",
      "Gateway 172.16.1.1 y DNS 172.16.1.1.",
      "Hostname server.rhcsa.lab.",
      "Todo persistente. Después de reboot, nmcli y hostnamectl tienen que mostrar lo mismo.",
    ],
    note: "El PDF original pedía otro hostname. Acá se usa el del Vagrantfile: server.rhcsa.lab. El rescate de root está en el lab anterior, con password student.",
    help: {
      tip: "En el examen se edita el perfil que ya existe, no se crea otro encima. El nombre para el comando es la columna NAME, no la placa. En una salida donde DEVICE enp0s8 está en la fila hostonly, el modify usa hostonly. enp0s3 es la otra placa: si por ahí entraste, no la pases a manual. lo es la máquina hablándose a sí misma: no se toca.",
      videoHint: "Q01a es nmtui. Q01b es nmcli y hostnamectl. Los dos hacen la misma red. Es la misma tarea que en el client, con la IP y el hostname del server.",
      videos: [
        { title: "Q01a: Red con nmtui", url: YT.nmtui },
        { title: "Q01b: Red con nmcli y hostnamectl", url: YT.nmcli },
      ],
      commands: [
        { cmd: "nmcli connection show", why: "No cambia nada. Lista los perfiles guardados, una fila por perfil. NAME es el nombre que vas a escribir en el modify: puede no coincidir con la placa. DEVICE es la placa que ese perfil está usando ahora. Si ves enp0s3 y enp0s8, no se elige el primero: se elige la fila cuyo DEVICE es la placa del lab. En el ejemplo, DEVICE enp0s8 está en la fila cuyo NAME es hostonly, así que el comando usa hostonly. lo es el loopback, la máquina consigo misma. Esa fila no se edita. Tab no hace falta para esto. Si al apretarlo salen archivos de la carpeta, el shell no tiene cargadas las palabras de nmcli. En el examen no se instala nada para arreglarlo: el nombre se copia de la columna NAME.", as: "root" },
        { cmd: "ip -br a", why: "Para saber cuál placa es la del lab, antes de cambiar nada. El nombre enp0s3 o enp0s8 no dice el rol: es el orden en que VirtualBox enchufó las placas. La que ya tiene 10.0.2.15 es la entrada, la NAT. No se pasa a manual. La otra ethernet es la del lab. En este Vagrant suele ser enp0s8, y al principio puede tener otra IP, por ejemplo 192.168.56. Esa palabra se busca en la columna DEVICE de connection show. La NAME de esa misma fila es la que se modifica. lo es la máquina consigo misma: no se toca.", as: "root" },
        { cmd: "nmtui", why: "En la conexión de enp0s8: IPv4 en Manual, Address 172.16.1.13/24, Gateway 172.16.1.1 y, en DNS servers, Add 172.16.1.1. Si dice <Add...>, el DNS no está puesto.", as: "root", orGroup: "net-set", orName: "nmtui" },
        { cmd: "nmcli connection modify NOMBRE ipv4.method manual ipv4.addresses 172.16.1.13/24 ipv4.gateway 172.16.1.1 ipv4.dns 172.16.1.1", why: "NOMBRE es la columna NAME de la fila del lab, no la placa. Si esa fila dice hostonly y DEVICE enp0s8, el comando es modify hostonly. Guarda la IP, el gateway y el DNS en ese perfil. ipv4.dns es el pedazo que anota el DNS. Sin eso, el DNS no queda. sudo hace falta si el prompt es vagrant@. Si ya es root@, sudo no suma nada.", as: "root", orGroup: "net-set", orName: "nmcli" },
        { cmd: "restorecon -v /etc/NetworkManager/system-connections/NOMBRE.nmconnection", why: "No es un paso de siempre. Solo si el modify anterior dice Permission denied al renombrar el .nmconnection, aunque el prompt ya sea root@. El archivo se llama como la columna NAME: si el perfil es hostonly, el archivo es hostonly.nmconnection. SELinux no deja que NetworkManager lo reemplace. Este comando no guarda el DNS. Corrige la etiqueta y, si hacía falta, avisa Relabeled. Después se vuelve a correr el modify.", as: "root" },
        { cmd: "nmcli -f ipv4.dns connection show NOMBRE", why: "No cambia nada. NOMBRE es otra vez la columna NAME, por ejemplo hostonly. Muestra solo el DNS guardado en ese perfil. Si quedó, la línea dice ipv4.dns: 172.16.1.1. Si sale vacío, no quedó. ip a no muestra el DNS.", as: "root" },
        { cmd: "nmcli connection up NOMBRE", why: "Aplica ahora lo que el modify ya guardó en ese perfil. No es lo que lo hace persistente: el modify ya lo escribió en disco. up sirve para no esperar al reboot. NOMBRE sigue siendo la columna NAME.", slip: "Me pasó: el perfil quedó bien y activé enp0s3 en vez de enp0s8. Por eso la IP seguía igual.", as: "root" },
        { cmd: "hostnamectl set-hostname server.rhcsa.lab", why: "Cambia el hostname ya, y lo guarda. No hace falta nmcli connection up ni ningún otro up: el hostname no es parte del perfil de red. Después de un reboot, hostnamectl tiene que seguir diciendo server.rhcsa.lab.", as: "root" },
        { cmd: "man nmcli", why: "En el examen esto es legal. Buscá connection modify.", as: "root" },
      ],
    },
  },
  {
    id: "lab-03",
    track: "pdf",
    title: "Sin internet, los paquetes salen de un estante local",
    story: "No hay salida a internet. Nos pasan dos direcciones, BaseOS y AppStream, y de ahí tiene que instalarse el diccionario de palabras.",
    objective: [
      "Un repo de nombre BaseOS con baseurl http://dl.rockylinux.org/pub/rocky/10/BaseOS/x86_64/os/.",
      "Un repo de nombre AppStream con baseurl http://dl.rockylinux.org/pub/rocky/10/AppStream/x86_64/os/.",
      "dnf list available lista paquetes de esos repos.",
      "Instalar words. Deja /usr/share/dict/words, el diccionario del lab de grep.",
    ],
    where: "client",
    steps: [
      "No es un lab de las dos a la vez: se hace en la VM donde necesites instalar (client o server).",
      "BaseOS y AppStream tienen que figurar en dnf repolist.",
      "gpgcheck desactivado en esos dos repos, si el lab lo pide.",
      "La config queda en /etc/yum.repos.d/ y sobrevive reboot.",
      "dnf list available tiene que devolver paquetes.",
    ],
    note: "En el examen casi no hay internet: el repo suele ser interno (DVD/ISO montada con file://, o un http:// del lab). En este Vagrant, si no montás una ISO, podés usar los repos que ya trae la box o un mirror que responda. Los labs que instalan (acl, chrony, words, tuned, …) asumen que en ESA máquina ya corriste este paso.",
    help: {
      tip: "Como en el video Q03: dnf lee solo archivos en /etc/yum.repos.d/ que terminen en .repo (ej. local.repo). Entrás ahí (cd /etc/yum.repos.d/), creás el archivo a mano con dos bloques BaseOS y AppStream, y memorizás la forma: [id], name=, baseurl= (la URL o file:// del enunciado, copiar/pegar), enabled=1, gpgcheck=0. Sin repos, el resto del examen se traba. Un baseurl que no existe deja dnf muerto. En este Rocky alcanzan esos dos: Debug, Source y CRB no van en el archivo.",
      videoHint: "Videos de este lab: Q03, y otro canal (Mingtao SUN) con el repo local a mano, sin internet.",
      videos: [
        { title: "Q03: Repositorios YUM/DNF", url: YT.repos },
        {
          title: "RHCSA Exam: How to Manually Configure a Local YUM/DNF Repository (No Internet!) · Mingtao SUN",
          url: YT.reposLocal,
        },
      ],
      commands: [
        { cmd: "man dnf.conf", why: "La página que explica gpgcheck, enabled y baseurl. Se lee antes de escribir el archivo.", as: "root" },
        { cmd: "man dnf.conf | grep -E 'baseurl|gpgcheck|enabled'", why: "man escribe la página. El | se la pasa a grep en vez de mostrarla. grep imprime solo las líneas donde aparece alguna de las frases. -E prende la regex extendida: el | de adentro de las comillas significa «o». Sin -E, ese | es un carácter más y no separa las tres palabras. baseurl, gpgcheck y enabled son las de este lab.", as: "root" },
        { cmd: "cd /etc/yum.repos.d/ && ls", why: "Primero: entrar a la carpeta de los repos (dnf/yum la usan igual). Hay que saberla de memoria. Ahí se crea el .repo; si el archivo no termina en .repo, dnf lo ignora.", as: "root" },
        { cmd: "dnf repolist", why: "Ver qué repos están enabled ahora en ESTA máquina (antes y después de crear el archivo).", as: "root" },
        { cmd: "cat > /etc/yum.repos.d/local.repo <<'EOF'\n[BaseOS]\nname=BaseOS\nbaseurl=http://dl.rockylinux.org/pub/rocky/10/BaseOS/x86_64/os/\nenabled=1\ngpgcheck=0\n\n[AppStream]\nname=AppStream\nbaseurl=http://dl.rockylinux.org/pub/rocky/10/AppStream/x86_64/os/\nenabled=1\ngpgcheck=0\nEOF", why: "BaseOS: http://dl.rockylinux.org/pub/rocky/10/BaseOS/x86_64/os/. AppStream: http://dl.rockylinux.org/pub/rocky/10/AppStream/x86_64/os/. En rocky.repo esas líneas están comentadas con $contentdir, $releasever y $basearch. Acá van ya escritas: pub/rocky, 10 y x86_64.", as: "root" },
        { cmd: "dnf config-manager --setopt=REPOS.gpgcheck=0 --save", why: "Solo si los repos ya existen y falta apagar GPG. El nombre sale de repolist.", as: "root" },
        { cmd: "dnf clean all && dnf repolist && dnf list available | head", why: "Comprobar: repolist muestra BaseOS y AppStream; list available tiene que listar paquetes (si la URL/file no existe, acá falla).", as: "root" },
        { cmd: "dnf install -y --repo=BaseOS --repo=AppStream words && ls /usr/share/dict/words", why: "Prueba de que el repo instala. words deja /usr/share/dict/words, el diccionario del lab de grep. En una mínima no está. Van los dos repos: el paquete puede estar en uno y una dependencia en el otro. Con solo --repo=AppStream, dnf no ve BaseOS y dice nothing provides. Sin --repo, también usa los de Rocky y un install que sale bien no prueba que lo sirvió local.repo. Si el paquete no se llama words, dnf provides /usr/share/dict/words dice el nombre.", as: "root" },
      ],
    },
  },
  {
    id: "lab-04",
    track: "pdf",
    title: "El sitio tiene que atender en un puerto que no es el de siempre",
    story: "El servidor web sigue con SELinux activo. Tiene que contestar en el puerto 82, y seguir haciéndolo después de reiniciar.",
    objective: [
      "httpd escucha en TCP 82.",
      "SELinux en enforcing.",
      "Persistente tras reboot.",
    ],
    where: "server",
    steps: [
      "Apache tiene que escuchar en el puerto 82.",
      "No pongas SELinux en permissive ni lo desactives.",
      "No muevas ni reetiquetes los archivos de /var/www/html.",
      "Tiene que seguir escuchando después de reboot.",
    ],
    help: {
      tip: "El puerto y el firewall son dos cosas distintas. SELinux puede dejar pasar el puerto y firewalld igual lo bloquea, o al revés.",
      videoHint: "Video de este lab: Q04.",
      videos: [{ title: "Q04: SELinux, Apache en el puerto 82", url: YT.selinuxPort }],
      commands: [
        { cmd: "getenforce", why: "No cambia nada. Pregunta el modo de SELinux e imprime una sola palabra.\nEnforcing: bloquea lo que la política no permite. Si Apache intenta el 82 sin permiso, no lo abre.\nPermissive: lo anota en el log y lo deja pasar.\nDisabled: SELinux no está corriendo.\nAl terminar tiene que decir Enforcing. Pasarlo a Permissive para que Apache arranque no cumple el lab.", as: "root" },
        { cmd: "dnf repolist && dnf install -y policycoreutils-python-utils", why: "semanage no viene en la mínima: el shell dice orden no encontrada. El paquete sale del repo DNF local de esta máquina, en AppStream.\nPara ver el nombre: dnf provides /usr/sbin/semanage. El patrón */semanage a veces no coincide y dnf dice que no hay resultados.", as: "root" },
        { cmd: "semanage port -l | grep http", why: "No cambia nada. Lista los puertos que SELinux ya etiquetó y deja solo las líneas de http.\nhttp_port_t es la etiqueta de los puertos donde Apache puede escuchar.\nSi 82 no aparece ahí, en Enforcing Apache no puede usarlo, aunque httpd.conf diga Listen 82.", as: "root" },
        { cmd: "semanage port -a -t http_port_t -p tcp 82", why: "Agrega el 82 a la etiqueta http_port_t, en TCP. -a agrega, -t es el tipo y -p tcp es el protocolo.\nQueda en la política y sigue después del reboot. No toca los archivos de /var/www/html: acá el bloqueo es el puerto.\nLas líneas policy capability son normales: SELinux reescribe la política. Si vuelve el prompt y no dice error, quedó. Comprobar con semanage port -l | grep http: el 82 tiene que aparecer en http_port_t.\nSi dice que el puerto ya está definido, ya estaba. No hace falta correrlo de nuevo.", as: "root" },
        { cmd: "dnf install -y httpd", why: "Si grep dice que /etc/httpd/conf/httpd.conf no existe, Apache no está instalado. El paquete sale del repo DNF local. En el Vagrant a veces ya viene; en una mínima, no.", as: "root" },
        { cmd: "grep -n Listen /etc/httpd/conf/httpd.conf", why: "No cambia el puerto. Muestra la línea donde Apache dice en qué puerto escucha, con su número.\nSuele decir Listen 80. La que cuenta es la que no tiene # adelante. #Listen 12.34.56.78:80 es un comentario y se deja.\nSin el cambio de abajo, Apache sigue en el 80 aunque SELinux y el firewall ya permitan el 82.", as: "root" },
        { cmd: "sed -i 's/^Listen 80$/Listen 82/' /etc/httpd/conf/httpd.conf", why: "El comando es sed, con d. set es otra orden de bash: set -i responde opción inválida y no toca el archivo.\n-i edita el archivo. Solo cambia la línea que empieza con Listen 80 y no tiene # adelante.\nDespués el grep tiene que mostrar Listen 82.", as: "root" },
        { cmd: "firewall-cmd --add-port=82/tcp --permanent && firewall-cmd --reload", why: "firewalld es otra barrera, aparte de SELinux.\n--add-port=82/tcp abre el 82.\n--permanent lo guarda en disco. Sin eso, al reboot el puerto se cierra.\n--reload aplica ahora lo guardado. Hasta el reload, el cambio permanente no entra en vigor.", as: "root" },
        { cmd: "systemctl enable --now httpd", why: "enable lo deja para el próximo boot. Sin esto, después del reboot no hay nadie en el 82.\n--now también lo arranca ahora. Si ya estaba corriendo, igual hace falta el restart de abajo para que lea Listen 82.", as: "root" },
        { cmd: "systemctl restart httpd && ss -ltnp | grep 82", why: "restart corta Apache y lo vuelve a levantar para que lea Listen 82. Si el puerto o SELinux están mal, el restart falla.\nss -ltnp lista qué procesos escuchan en TCP. grep 82 deja solo esa línea.\nSi aparece httpd en :82, está escuchando. Si no hay línea, no quedó.", as: "root" },
        { cmd: "curl -I http://127.0.0.1:82", why: "Pregunta desde esta misma máquina si Apache contesta en el 82. -I pide solo los encabezados. 127.0.0.1 no cruza el firewall.\nHTTP/1.1 200: hay página y la sirvió. En el examen lo normal es esto: /var/www/html ya trae el archivo, y el enunciado pide no moverlo ni reetiquetarlo.\nHTTP/1.1 403 Forbidden: Apache está en el 82, pero la carpeta no tiene index.html. En este clon vacío es lo esperado. No crees un archivo ahí.\nCould not connect: nadie escucha en el 82. El Listen no quedó, o httpd no está corriendo. La carpeta vacía no da ese error.", as: "root" },
        { cmd: "curl -I http://172.16.1.13:82", why: "Desde el client. Esta sí cruza el firewall: es la prueba de afuera.\nEl mismo código que en el server. 200 si hay página, 403 si /var/www/html está vacío, Could not connect si el puerto no está abierto o httpd no escucha.", as: "client" },
      ],
    },
  },
  {
    id: "lab-05",
    track: "pdf",
    title: "Llega gente nueva y no todos pueden administrar",
    story: "Hay que crear las cuentas y un grupo para los que administran. Uno de ellos puede usar sudo. El resto, no. Thiago es developer: entra, pero no administra.",
    objective: [
      "Grupo sysadm y grupo developer.",
      "Usuarios: felipe y erik en sysadm; thiago en developer; diego con /sbin/nologin.",
      "Contraseña de los cuatro: lalala.",
      "sysadm puede sudo useradd.",
      "felipe puede sudo passwd sin que pida contraseña.",
    ],
    where: "client",
    steps: [
      "Grupo sysadm y grupo developer.",
      "Felipe: grupo secundario sysadm.",
      "Erik: grupo secundario sysadm.",
      "Thiago: grupo secundario developer, con shell, y fuera de sysadm.",
      "Diego: sin shell interactiva (/sbin/nologin) y fuera de sysadm.",
      "Contraseña del ejercicio para los cuatro: lalala.",
      "Quien esté en sysadm puede crear usuarios con sudo.",
      "Felipe puede cambiar la contraseña de otros usuarios sin que sudo le pida contraseña.",
      "Persistente.",
    ],
    help: {
      tip: "El grupo de este lab es sysadm, no wheel. Si el usuario ya existe, el secundario se suma con usermod -aG, no con otro useradd. La regla de sudo va con visudo: un error de sintaxis te deja sin sudo. userdel -r USUARIO borra cuenta + home + mail, no el crontab ni archivos fuera del home ni sudoers ni ACL. groupdel GRUPO: el grupo no puede ser primario de nadie.",
      videoHint: "Video de este lab: Q05.",
      videos: [{ title: "Q05: Usuarios, grupos y sudo", url: YT.users }],
      commands: [
        { cmd: "id felipe", why: "No cambia nada. Si el usuario existe, muestra uid, gid y grupos. getent passwd felipe también sirve: una línea con la cuenta. Si no existe, id dice no such user.", as: "root" },
        { cmd: "getent passwd", why: "Lista todas las cuentas. Solo nombres: getent passwd | cut -d: -f1. Usuarios de persona (UID 1000 o más, sin nobody): getent passwd | awk -F: '$3 >= 1000 && $3 < 65534 {print $1}'. Ahí tienen que aparecer felipe, erik, thiago y diego.", as: "root" },
        { cmd: "groupadd sysadm", why: "Crear el grupo del enunciado.", as: "root" },
        { cmd: "useradd -G sysadm felipe && useradd -G sysadm erik", why: "-G es secundario. No uses -g si no querés cambiar el grupo primario. Solo si el usuario todavía no existe.", as: "root" },
        { cmd: "usermod -aG sysadm felipe", why: "Si felipe ya existía, esto suma sysadm sin sacar los grupos secundarios que ya tenía. El grupo va primero, el usuario después. Sin -a, -G reemplaza la lista entera y se pierden los otros. Comprobar con id felipe. Lo mismo para erik.", as: "root" },
        { cmd: "useradd -s /sbin/nologin diego", why: "Diego no entra a una shell y no va a sysadm.", as: "root" },
        { cmd: "groupadd developer", why: "El otro rol. Quien desarrolla entra a una shell y no administra.", as: "root" },
        { cmd: "useradd -G developer thiago", why: "Thiago queda en developer, no en sysadm. El shell por defecto es /bin/bash, así que sí puede entrar. La contraseña se pone con passwd, igual que los otros.", as: "root" },
        { cmd: "usermod -l erik Erik", why: "Renombra el login: el nombre nuevo va primero. Erik no puede estar logueado. El home y el grupo primario no cambian solos. Home y carpeta: usermod -l erik -d /home/erik -m Erik. Grupo primario: groupmod -n erik Erik.", as: "root" },
        { cmd: "man usermod | grep -- '-l'", why: "Busca la opción -l en el manual. man usermod | grep -l falla: -l es opción de grep, no el texto. El -- dice que lo de atrás es el patrón. Sale -l, --login NEW_LOGIN. También puede salir -L, --lock, porque --lock contiene -l.", as: "root" },
        { cmd: "passwd felipe", why: "Repetilo para erik, thiago y diego. La contraseña del ejercicio es lalala.", as: "root" },
        { cmd: "visudo -f /etc/sudoers.d/sysadm", why: "Ahí va la regla del grupo. El archivo queda en 440.", as: "root" },
        { cmd: "%sysadm ALL=(ALL) /usr/sbin/useradd", why: "El grupo puede crear usuarios. El % indica grupo.", as: "root" },
        { cmd: "felipe ALL=(ALL) NOPASSWD: /usr/bin/passwd", why: "Solo Felipe, solo passwd, sin contraseña de sudo.", as: "root" },
        { cmd: "sudo -l -U felipe", why: "Leer la regla antes de probar con su - felipe.", as: "root" },
        { cmd: "userdel -r erik", why: "Borra: la cuenta (passwd/shadow/group), el home (/home/erik) y el mail spool. Sin -r el home queda. No borra: crontab (/var/spool/cron/…), archivos fuera del home (ej. /root/erikfiles, /shared), ACL en otros paths, líneas de sudoers, ni procesos/sesiones abiertas. Sin sesión abierta: loginctl terminate-user erik si hace falta. En XFS el home no se recupera: otro useradd deja la carpeta vacía.", as: "root" },
        { cmd: "crontab -u erik -r; rm -f /var/spool/cron/erik /var/spool/cron/crontabs/erik; find / -nouser -o -nogroup 2>/dev/null; setfacl -b /var/tmp/fstab 2>/dev/null", why: "Extra (VM de práctica limpia): userdel -r no alcanza si querés borrar todo lo del usuario. Sacá el crontab (con -u si la cuenta aún existe, o el archivo en spool si ya la borraste), buscá archivos/dirs huérfanos con find -nouser/-nogroup, limpiá ACL de prueba y, si aplica, rm de carpetas de lab (/root/erikfiles, /shared) y la regla en sudoers.d. Para reset total de la box, mejor snapshot o vagrant destroy.", as: "root" },
        { cmd: "groupdel sysadm", why: "Borrar un grupo: groupdel NOMBRE. Tiene que estar vacío como grupo primario: primero borrá o cambiá de grupo a los usuarios que lo tengan de primario (usermod -g OTRO usuario). Si solo era secundario, userdel o usermod -G ya lo sacan de la lista. getent group sysadm comprueba que ya no está.", as: "root" },
      ],
    },
  },
  {
    id: "lab-06",
    track: "pdf",
    title: "Una carpeta compartida donde lo nuevo queda del grupo",
    story: "Varias personas escriben en la misma carpeta. Los archivos que crean tienen que nacer ya del grupo, no solo de quien los creó.",
    objective: [
      "Directorio /shared/sysadm.",
      "Grupo dueño sysadm, setgid.",
      "Solo el grupo puede entrar.",
    ],
    where: "client",
    steps: [
      "Crear /shared/sysadm.",
      "Grupo dueño: sysadm.",
      "Solo los miembros del grupo pueden entrar.",
      "Los archivos nuevos heredan el grupo sysadm (setgid).",
      "Persistente: es un permiso del directorio, no hace falta fstab.",
    ],
    help: {
      tip: "El primer dígito de chmod no es dueño/grupo/otros: es el bit especial. 4 setuid, 2 setgid, 1 sticky. Se pueden sumar (por ejemplo 3 = setgid+sticky). En este lab hace falta el 2. setgid en un directorio se ve como s en el grupo: drwxrws---. Probalo creando un archivo con uno de los usuarios, no con root.",
      videoHint: "Video de este lab: Q06.",
      videos: [{ title: "Q06: Directorio compartido con setgid", url: YT.setgid }],
      commands: [
        { cmd: "mkdir -p /shared/sysadm", why: "Crear la ruta.", as: "root" },
        { cmd: "chown root:sysadm /shared/sysadm", why: "El grupo dueño tiene que ser sysadm. Sin eso, el setgid haría heredar otro grupo.", as: "root" },
        { cmd: "chmod 2770 /shared/sysadm", why: "El 2 es setgid en la carpeta: los archivos y carpetas nuevos que se creen adentro heredan el grupo dueño de esta carpeta (sysadm), no el grupo primario de quien los crea. Si Felipe es grupo felipe y hace un touch acá, el archivo queda grupo sysadm. Sin el 2 sería solo 770: mismos permisos de entrada, pero cada uno dejaría archivos con su propio grupo y el compartido se rompe. El 770 es dueño y grupo leen, escriben y entran; el resto no.", as: "root" },
        { cmd: "Bits especiales (el primer dígito): 4 setuid, 2 setgid, 1 sticky", why: "setuid (4): en un ejecutable, el proceso corre con el dueño del archivo (ejemplo clásico: passwd corre como root). En un directorio casi no se usa. setgid (2): en un directorio, hereda el grupo (este lab). En un ejecutable, el proceso corre con el grupo del archivo. sticky (1): en un directorio escribible por varios (como /tmp), solo el dueño del archivo (o root) puede borrarlo. Se ve como t al final: drwxrwxrwt. Acá no hace falta sticky: el lab pide heredar el grupo, no proteger borrados.", as: "info" },
        { cmd: "ls -ld /shared/sysadm", why: "Tiene que verse drwxrws---. La s en el lugar de la x del grupo es el setgid. Si ves una S mayúscula, el bit está pero falta el permiso de ejecución del grupo: algo mal en el 770.", as: "root" },
        { cmd: "su - felipe -c 'touch /shared/sysadm/prueba && ls -l /shared/sysadm'", why: "Prueba real: el archivo nuevo tiene que quedar grupo sysadm, aunque el grupo primario de Felipe sea otro.", as: "felipe" },
      ],
    },
  },
  {
    id: "lab-07",
    track: "pdf",
    title: "Erik quiere un aviso que se anote solo",
    story: "Erik no va a estar mirando la máquina. Quiere que, cada minuto, quede anotado el texto que le pidieron, sin que él lo escriba.",
    objective: [
      "Usuario erik.",
      "Cada 1 minuto.",
      "logger con el texto \"Ex200 Testing\".",
    ],
    where: "client",
    steps: [
      "Usuario: erik.",
      "Cada 1 minuto.",
      "Acción: logger con el texto Ex200 Testing.",
      "Persistente.",
    ],
    help: {
      tip: "crontab -e abre el crontab de root si estás como root. Para Erik hace falta -u erik. El servicio crond tiene que estar activo.",
      videoHint: "Video de este lab: Q07.",
      videos: [{ title: "Q07: Cron con logger", url: YT.cron }],
      commands: [
        { cmd: "systemctl enable --now crond", why: "Sin el servicio, el crontab no corre.", as: "root" },
        { cmd: "crontab -u erik -e", why: "Editar la tabla de Erik, no la de root.", as: "root" },
        { cmd: "* * * * * logger \"Ex200 Testing\"", why: "Los cinco asteriscos son cada minuto.", as: "root" },
        { cmd: "crontab -u erik -l", why: "Ver que quedó guardada.", as: "root" },
        { cmd: "journalctl -t erik --since '2 min ago'", why: "logger usa el usuario como identificador. Esperá un minuto.", as: "root" },
      ],
    },
  },
  {
    id: "lab-08",
    track: "pdf",
    title: "Una carpeta del servidor tiene que aparecer sola en el cliente",
    story: "El servidor comparte una carpeta. En el cliente tiene que montarse cuando alguien entra, sin montarla a mano cada vez.",
    objective: [
      "Usuario netuser1, home /home/guests/netuser1, pass arceprog.",
      "Export NFS en el server.",
      "Client: /netdir/netuser1 monta 172.16.1.13.",
    ],
    where: "server · client",
    steps: [
      "Antes: repos DNF ok en server y en client si hace falta instalar nfs-utils (lab Repositorios DNF en cada una).",
      "En el server, crear el usuario netuser1 con contraseña del ejercicio arceprog y el directorio /home/guests/netuser1.",
      "Exportar ese directorio por NFS.",
      "En el client, autofs: al acceder a /netdir/netuser1 se monta el export del server (172.16.1.13).",
      "Persistente en las dos máquinas.",
    ],
    note: "Autofs suele llevar tiempo. No lo dejes para cuando el reloj ya se acabó.",
    help: {
      tip: "NFS, firewall y autofs se rompen por separado. Primero showmount desde el client. Recién después autofs.",
      videoHint: "Video de este lab: Q08.",
      videos: [{ title: "Q08: Autofs con NFS", url: YT.autofs }],
      commands: [
        { cmd: "useradd -d /home/guests/netuser1 netuser1 && echo arceprog | passwd --stdin netuser1", why: "Usuario y home en el server. La contraseña es la del ejercicio.", as: "root" },
        { cmd: "dnf repolist && dnf install -y nfs-utils", why: "En cada máquina donde falte: primero repos DNF en ESA VM (lab Repositorios DNF), después install. Server y client.", as: "root" },
        { cmd: "echo '/home/guests/netuser1 172.16.1.12(rw,sync,no_root_squash)' >> /etc/exports", why: "Export solo hacia el client. Ajustá opciones si el lab pide otra cosa.", as: "root" },
        { cmd: "exportfs -r && systemctl enable --now nfs-server", why: "Publicar el export y dejarlo al boot.", as: "root" },
        { cmd: "firewall-cmd --add-service=nfs --permanent && firewall-cmd --reload", why: "En el server. Sin esto el client no ve el export.", as: "root" },
        { cmd: "showmount -e 172.16.1.13", why: "Desde el client: si esto falla, autofs no va a andar.", as: "root" },
        { cmd: "man auto.master", why: "La línea de /netdir apunta a un mapa indirecto con el host 172.16.1.13.", as: "root" },
      ],
    },
  },
  {
    id: "lab-09",
    track: "pdf",
    title: "Antes de tocar la configuración, hay que guardar /etc",
    story: "Vamos a cambiar cosas del sistema. Primero se comprime /etc en un archivo, por si hay que volver atrás.",
    objective: [
      "Archivo /root/myetcbackup.tar.bz2.",
      "Contiene /etc.",
      "Compresión bzip2.",
    ],
    where: "client",
    steps: [
      "Crear /root/myetcbackup.tar.bz2.",
      "Tiene que contener /etc.",
      "Compresión bzip2, extensión .tar.bz2.",
    ],
    help: {
      tip: "j es bzip2. z es gzip. Si el archivo queda .gz, el lab no está cumplido aunque pese menos.",
      videoHint: "Video de este lab: Q09.",
      videos: [{ title: "Q09: Archivo tar.bz2 de /etc", url: YT.tar }],
      commands: [
        { cmd: "tar -cjf /root/myetcbackup.tar.bz2 /etc", why: "c crea, j comprime con bzip2, f es el archivo de salida.", as: "root" },
        { cmd: "tar -tjf /root/myetcbackup.tar.bz2 | head", why: "Listar sin descomprimir, para verificar. head muestra solo las primeras líneas (por defecto 10): alcanza para ver que el .tar.bz2 tiene contenido, sin tirar miles de rutas de /etc en la pantalla.", as: "root" },
        { cmd: "man tar", why: "Por si no te acordás qué letra es bzip2.", as: "root" },
      ],
    },
  },
  {
    id: "lab-10",
    track: "pdf",
    title: "Erik tiene que cambiar un archivo que no es suyo",
    story: "Los dueños del archivo son root y el grupo root. Hoy Erik necesita poder leerlo y hacer cambios, porque le tocó revisar esa copia de fstab. Felipe está en otro proyecto y no tiene que ver el archivo. Los demás pueden leerlo, pero no escribir.",
    objective: [
      "Copia /etc/fstab → /var/tmp/fstab, dueño root:root.",
      "erik: lectura y escritura.",
      "felipe: sin acceso.",
      "others: solo lectura.",
    ],
    where: "client",
    steps: [
      "Antes: en el client, repos DNF ok (lab Repositorios DNF) si vas a instalar el paquete acl.",
      "Copiar /etc/fstab a /var/tmp/fstab.",
      "Dueño root y grupo root.",
      "Sin bit de ejecución.",
      "Erik: lectura y escritura.",
      "Felipe: sin acceso.",
      "Otros: solo lectura.",
    ],
    help: {
      tip: "ACL (Access Control List): permisos extra por usuario o por grupo, encima del chmod. Se usa cuando el dueño/grupo/otros del chmod no alcanza: por ejemplo un archivo de root donde erik necesita escribir y felipe no puede ni leer, sin meter a erik en el grupo dueño ni abrir other a escritura. Formato tipo:nombre:permisos. Dos tipos: u:erik:rw (usuario) y g:sysadm:r (grupo). No existe ug: junto: o u: o g:. -m modifica; -x borra una entrada. La máscara m:: puede bajar el permiso efectivo: mirá getfacl entero, no solo el chmod.",
      videoHint: "Video de este lab: Q10.",
      videos: [{ title: "Q10: ACL en /var/tmp/fstab", url: YT.acl }],
      commands: [
        { cmd: "cp /etc/fstab /var/tmp/fstab && chown root:root /var/tmp/fstab && chmod 644 /var/tmp/fstab", why: "Base: sin ejecución, otros leen.", as: "root" },
        { cmd: "dnf repolist && dnf install -y acl", why: "Antes de instalar: repolist tiene que listar BaseOS/AppStream en ESTA máquina (lab Repositorios DNF). setfacl no siempre está en la mínima.", as: "root" },
        { cmd: "setfacl -m u:erik:rw /var/tmp/fstab", why: "ACL de usuario: u = user, erik = nombre, rw = permisos. Lee y escribe.", as: "root" },
        { cmd: "setfacl -m u:felipe:--- /var/tmp/fstab", why: "Misma forma u:nombre:permisos. --- (o 0) = sin acceso.", as: "root" },
        { cmd: "setfacl -m g:sysadm:r /var/tmp/fstab", why: "Ejemplo de ACL de grupo: g:nombre:permisos. Este lab no lo pide; acá alcanzan las dos de usuario.", as: "root" },
        { cmd: "getfacl /var/tmp/fstab", why: "Ver user:, group:, mask: y other:.", as: "root" },
        { cmd: "su - erik -c 'echo prueba >> /var/tmp/fstab'", why: "Prueba real: el >> tiene que ir adentro de las comillas. Si va afuera, escribe root y no estás probando a erik.", as: "erik" },
      ],
    },
  },
  {
    id: "lab-11",
    track: "pdf",
    title: "Las dos máquinas no marcan la misma hora",
    story: "El reloj del servidor y el del cliente tienen que quedar alineados, y seguir así después de reiniciar.",
    objective: [
      "Server 172.16.1.13 ofrece NTP.",
      "Client 172.16.1.12 sincroniza contra ese server.",
      "Persistente en las dos.",
    ],
    where: "server · client",
    steps: [
      "Antes: repos DNF ok en cada máquina donde instales chrony (lab Repositorios DNF).",
      "El server (172.16.1.13) tiene que responder NTP.",
      "El client (172.16.1.12) usa ese server como fuente.",
      "Persistente en los dos.",
    ],
    help: {
      tip: "allow en el server y el firewall van juntos. chronyc sources en el client tiene que mostrar 172.16.1.13, no solo localhost.",
      videoHint: "Video de este lab: Q11.",
      videos: [{ title: "Q11: chrony / NTP", url: YT.chrony }],
      commands: [
        { cmd: "dnf repolist && dnf install -y chrony", why: "En cada VM donde falte chrony: primero repos en ESA máquina, después install.", as: "root" },
        { cmd: "man chrony.conf", why: "allow en el server, pool o server en el client.", as: "root" },
        { cmd: "server 172.16.1.13 iburst", why: "Línea para /etc/chrony.conf del client. Comentá los pool públicos si tapan a esta fuente.", as: "info" },
        { cmd: "allow 172.16.1.0/24", why: "En el server, para aceptar al client.", as: "root" },
        { cmd: "firewall-cmd --add-service=ntp --permanent && firewall-cmd --reload", why: "UDP 123 en el server.", as: "root" },
        { cmd: "systemctl enable --now chronyd && chronyc sources -v", why: "Activar y ver que la fuente quedó seleccionada.", as: "root" },
      ],
    },
  },
  {
    id: "lab-12",
    track: "pdf",
    title: "Erik no recuerda qué archivos tocó",
    story: "Erik es nuevo y no recuerda qué archivos modificó. Quiere copiarlos con la misma estructura de carpetas de donde estaban la primera vez.",
    objective: [
      "Archivos de erik modificados en las últimas 24 h.",
      "Copiarlos a /root/erikfiles.",
      "Conservar la estructura de rutas.",
    ],
    where: "client",
    steps: [
      "Encontrar archivos cuyo dueño es erik, modificados en las últimas 24 horas.",
      "Copiarlos a /root/erikfiles.",
      "Conservar la estructura de directorios.",
    ],
    note: "En el PDF la carpeta de destino usa el nombre viejo del usuario. Acá el destino es /root/erikfiles.",
    help: {
      tip: "Hay que conservar la ruta bajo /root/erikfiles. cp --parents recrea las carpetas. Un cp sin --parents deja los archivos sueltos en el destino.",
      videoHint: "Video de este lab: Q12.",
      videos: [{ title: "Q12: find y copiar conservando rutas", url: YT.find }],
      commands: [
        { cmd: "find / -user erik -mtime -1 -type f 2>/dev/null", why: "Dueño erik, modificado hace menos de 1 día. El error de /proc se descarta.", as: "root" },
        { cmd: "mkdir -p /root/erikfiles", why: "Destino.", as: "root" },
        {
          cmd: "find / -user erik -mtime -1 -type f -exec cp --parents -p {} /root/erikfiles \\; 2>/dev/null",
          why: "find encuentra cada archivo y llama a cp una vez por archivo. {} es un marcador: find lo cambia por la ruta real (ej. /home/erik/a.txt) y corre cp --parents -p esa-ruta /root/erikfiles. --parents = recrea carpetas bajo el destino (/root/erikfiles/home/erik/…). -p = conserva dueño, modo y fechas (como root). El \\; cierra el -exec de find.",
          as: "root",
        },
        { cmd: "find /root/erikfiles -type f", why: "Ver que llegó la estructura, no un montón de archivos sueltos.", as: "root" },
      ],
    },
  },
  {
    id: "lab-13",
    track: "pdf",
    title: "El proyecto ruso busca cómo llamarse",
    story: "Los repos de DNF ya quedaron, así que se puede bajar words y usar el diccionario. El proyecto ruso cambia de nombre y nos vamos a guiar por las palabras que contienen ich. Esa lista hay que guardarla.",
    objective: [
      "Fuente: /usr/share/dict/words.",
      "Líneas que contienen ich.",
      "Guardar en /root/lines.",
    ],
    where: "client",
    steps: [
      "Antes: en el client, repos DNF ok (lab Repositorios DNF) si hace falta instalar el diccionario.",
      "Fuente: /usr/share/dict/words.",
      "Quedate con las palabras que contienen ich.",
      "Guardar el resultado en /root/lines.",
    ],
    help: {
      tip: "Si el diccionario no existe, no inventes el archivo: el paquete que lo provee se instala con dnf, después de tener repos en esta máquina.",
      videoHint: "Video de este lab: Q13.",
      videos: [{ title: "Q13: grep en un diccionario", url: YT.grep }],
      commands: [
        { cmd: "man grep", why: "Por si el enunciado pide inicio de línea o palabra entera.", as: "root" },
        { cmd: "dnf repolist; ls /usr/share/dict/words || dnf provides /usr/share/dict/words", why: "Primero repos en el client. Si no está words, dnf provides dice el paquete (a menudo words o similar) y lo instalás con dnf install.", as: "root" },
        { cmd: "grep ich /usr/share/dict/words > /root/lines", why: "ich en cualquier parte de la línea. No hace falta -E.", as: "root" },
        { cmd: "wc -l /root/lines && head /root/lines", why: "Tiene que haber líneas, y todas con ich.", as: "root" },
      ],
    },
  },
  {
    id: "lab-14",
    track: "pdf",
    title: "Arce trajo sus archivos de otra máquina",
    story: "Arce trabajaba en otra máquina. Sus archivos vinieron con él.\n\nEsos archivos no guardan el nombre arce. Guardan el número de la cuenta, el 1111.\n\nSi acá la cuenta nace con otro número, los archivos no lo toman como dueño. Siguen diciendo 1111.",
    objective: [
      "Usuario arce.",
      "UID 1111.",
      "Contraseña lalala.",
    ],
    where: "client",
    steps: [
      "Usuario: arce.",
      "UID: 1111.",
      "Contraseña del ejercicio: lalala.",
    ],
    note: "En el PDF el usuario tenía otro nombre. Acá es arce, para no usar el hostname viejo del material original.",
    help: {
      tip: "Si el UID 1111 ya existe, id 1111 te lo dice antes de que useradd falle.",
      videoHint: "Video de este lab: Q14.",
      videos: [{ title: "Q14: Usuario con UID fijo", url: YT.uid }],
      commands: [
        { cmd: "getent passwd 1111", why: "Ver si el UID está libre.", as: "root" },
        { cmd: "useradd -u 1111 arce", why: "-u fija el UID.", as: "root" },
        { cmd: "echo 'lalala' | passwd --stdin arce", why: "Contraseña del ejercicio, sin modo interactivo. Misma idea que felipe/erik: lalala.", as: "root" },
        { cmd: "id arce", why: "Tiene que mostrar uid=1111.", as: "root" },
      ],
    },
  },
  {
    id: "lab-15",
    track: "pdf",
    title: "Hay un disco de más y hay que dejar un espacio con nombre",
    story: "El disco extra no se usa todavía. Hay que armar un volumen, darle formato y dejarlo montado para que vuelva al reiniciar.",
    objective: [
      "wgroup (VG), PE 8 MB.",
      "wshare (LV) de 50 extents, ext4.",
      "Montado en /mnt/wshare por UUID al boot.",
    ],
    where: "server",
    steps: [
      "wgroup (VG), extent físico de 8 MB.",
      "wshare (LV) de 50 extents.",
      "Formato ext4, montado en /mnt/wshare.",
      "Montaje automático al boot, por UUID.",
    ],
    note: "Ese disco de 1 GB lo comparten este lab, el swap y el resize. No lo ocupes entero acá: 50 × 8 MB son 400 MB. Este lab es la secuencia de crear un LV nuevo.",
    help: {
      tip: "No uses el disco del sistema. lsblk tiene que mostrarte un disco chico sin particiones: ese es el de 1 GB.",
      videoHint: "Video de este lab: Q15.",
      videos: [{ title: "Q15: Crear y montar LVM", url: YT.lvmCreate }],
      commands: [
        { cmd: "lsblk -f", why: "Identificar el disco extra. No toques el que tiene / y /boot.", as: "root" },
        { cmd: "dnf repolist && dnf install -y lvm2", why: "Si pvcreate no está: primero repos en el server (lab Repositorios DNF), después install.", as: "root" },
        { cmd: "pvcreate /dev/DISCO", why: "Marca el disco extra entero como PV. En ese disco no queda lugar para la partición de swap del lab siguiente.", as: "root", orGroup: "pv-target", orName: "disco entero" },
        { cmd: "pvcreate /dev/DISCO1", why: "Marca solo una partición de ese disco. El resto queda para el swap. DISCO1 es esa partición, no el disco que tiene / y /boot. El vgcreate de abajo usa el mismo dispositivo que acabás de marcar.", as: "root", orGroup: "pv-target", orName: "una partición" },
        { cmd: "vgcreate -s 8M wgroup /dev/DISCO", why: "-s 8M es el tamaño de extent que pide el lab.", as: "root" },
        { cmd: "lvcreate -n wshare -l 50 wgroup", why: "-l son extents, no megabytes. 50 × 8 MB.", as: "root" },
        { cmd: "mkfs.ext4 /dev/wgroup/wshare && mkdir -p /mnt/wshare", why: "Formato y punto de montaje.", as: "root" },
        { cmd: "blkid /dev/wgroup/wshare", why: "El UUID va a /etc/fstab, no el nombre /dev/sdX.", as: "root" },
      ],
    },
  },
  {
    id: "lab-16",
    track: "pdf",
    title: "La máquina se queda sin memoria y necesita una reserva",
    story: "Cuando la memoria se llena, hace falta un espacio de 400 MB en disco para que el sistema pueda seguir.",
    objective: [
      "Partición swap de 400 MB.",
      "Activa ahora y en fstab.",
    ],
    where: "server",
    steps: [
      "Crear una partición de swap de 400 MB.",
      "Activarla ahora.",
      "Que vuelva sola después de reboot.",
    ],
    note: "Practicá crear o agrandar la partición de swap y dejarla permanente.",
    help: {
      tip: "Si en el lab anterior hiciste pvcreate del disco entero, no queda espacio para esta partición. Un VG puede vivir en una partición y el swap en otra del mismo disco.",
      videoHint: "Video de este lab: Q16.",
      videos: [{ title: "Q16: Partición swap de 400M", url: YT.swap }],
      commands: [
        { cmd: "lsblk", why: "Ver espacio libre en el disco extra.", as: "root" },
        { cmd: "parted /dev/DISCO", why: "mkpart para una primaria de unos 400 MB, tipo linux-swap. man parted.", as: "root" },
        { cmd: "mkswap /dev/PARTICION && swapon /dev/PARTICION", why: "Formatear y activar ahora.", as: "root" },
        { cmd: "blkid /dev/PARTICION", why: "Línea de fstab: UUID=... swap swap defaults 0 0.", as: "root" },
        { cmd: "swapon --show", why: "Tiene que aparecer, también después de reboot.", as: "root" },
      ],
    },
  },
  {
    id: "lab-17",
    track: "pdf",
    title: "El volumen se llenó y hay que agrandarlo",
    story: "El espacio que ya está en uso se quedó chico. Hay que estirarlo sin perder lo que tiene adentro.",
    objective: [
      "LV vo en el VG vgroup.",
      "Tamaño final cerca de 50 MB (vale 30–70).",
      "Filesystem ajustado junto con el LV.",
    ],
    where: "server",
    steps: [
      "El logical volume se llama vo y está en el volume group vgroup.",
      "Tamaño final alrededor de 50 MB. Vale entre 30 y 70 MB.",
      "No pierdas el filesystem: el tamaño del LV y el del sistema de archivos tienen que quedar juntos.",
    ],
    note: "En el PDF ese volumen ya existe. En este Vagrant probablemente no. Crearlo y después llevarlo al rango también cumple el resultado. Para agrandar el VG: vgextend y después lvextend -r.",
    help: {
      tip: "lvreduce sin -r puede dejar el filesystem más grande que el LV. -r achica o agranda los dos. Igual, si hay datos, medí antes con df. Agrandar un VG es vgextend; agrandar el LV es lvextend -r.",
      videoHint: "Q15b agranda un LV. Q17 es resize (subir y bajar). En v10 piden las dos cosas.",
      videos: [
        { title: "Q15b: Extender un LV y el filesystem", url: YT.lvmExtend },
        { title: "Q17: Resize de un logical volume", url: YT.lvmResize },
      ],
      commands: [
        { cmd: "lvs", why: "Ver si vo/vgroup ya está. Si no está, crealo en el espacio que quede del disco extra.", as: "root" },
        { cmd: "vgs && lvs -o lv_name,vg_name,lv_size", why: "Tamaño actual antes de tocar.", as: "root" },
        { cmd: "lvresize -r -L 50M /dev/vgroup/vo", why: "-r ajusta el filesystem. El rango aceptado es 30–70 MB.", as: "root" },
        { cmd: "vgextend vgroup /dev/PARTICION && lvextend -r -L +200M /dev/vgroup/vo", why: "Agrandar el VG con espacio libre y después el LV. -r agranda también el filesystem.", as: "root" },
        { cmd: "lvs /dev/vgroup/vo && df -h /punto", why: "LV y filesystem tienen que coincidir.", as: "root" },
      ],
    },
  },
  {
    id: "lab-18",
    track: "pdf",
    title: "Operaciones pidió tuned en esta máquina",
    story: "Esta máquina quedó lenta para el trabajo que le toca. Desde operaciones nos dijeron que no la ajustemos a mano: que usemos tuned.\n\ntuned se ocupa de eso. Es un servicio que aplica un perfil: junta los ajustes de CPU, disco y kernel bajo un nombre, según para qué se usa la máquina. Los perfiles que trae el paquete están en /usr/lib/tuned.\n\nHay que instalarlo, poner el perfil que recomienda y dejar el servicio activo. Si no queda activo, al reiniciar la máquina vuelve a trabajar sin ese ajuste.",
    objective: [
      "Perfil que diga tuned-adm recommend.",
      "Sigue activo después de reboot.",
    ],
    where: "client",
    steps: [
      "Antes: en el client, repos DNF ok (lab Repositorios DNF).",
      "Instalar y activar tuned si no está.",
      "Aplicar el perfil recomendado.",
      "Tiene que quedar elegido después de reboot.",
    ],
    note: "El punto es cambiar el profile y que quede permanente. tuned-adm profile lo escribe en /etc/tuned/active_profile. Al reiniciar, el servicio tuned tiene que estar enable para leer ese archivo y volver a aplicarlo. Sin enable, el archivo puede quedar y el perfil igual no vuelve.",
    help: {
      tip: "recommend solo imprime un nombre: no lo guarda. profile NOMBRE lo aplica ahora y lo deja escrito en /etc/tuned/active_profile. enable --now tuned arranca el servicio y lo deja para el boot: al reiniciar, tuned lee ese archivo y vuelve a poner el mismo perfil. Comprobación: reboot y tuned-adm active tiene que mostrar el mismo nombre.",
      videoHint: "Video de este lab: Q18.",
      videos: [{ title: "Q18: Perfil recomendado de tuned", url: YT.tuned }],
      commands: [
        { cmd: "dnf repolist && dnf install -y tuned && systemctl enable --now tuned", why: "Primero repos en el client; después install. enable --now lo arranca ya y lo deja para el próximo boot. Sin enable, al reiniciar tuned no vuelve y el perfil no se reaplica.", as: "root" },
        { cmd: "tuned-adm recommend", why: "Solo dice cuál conviene. No cambia nada y no lo guarda.", as: "root" },
        { cmd: "tuned-adm profile NOMBRE", why: "NOMBRE es el que imprimió recommend. Lo aplica ahora y lo guarda en /etc/tuned/active_profile. Ese archivo es lo que sobrevive al reboot.", as: "root" },
        { cmd: "tuned-adm active", why: "Tiene que mostrar el mismo nombre. Después de reboot, repetilo: si el servicio quedó enable, lee active_profile y sigue igual.", as: "root" },
      ],
    },
  },
  {
    id: "lab-19",
    track: "pdf",
    title: "Quien entra tiene que ver un mensaje",
    story: "Al iniciar sesión tiene que aparecer un saludo. Puede ser para una persona o para todos los que entran.",
    objective: [
      "joaquin: \"Welcome to you, user Joaquin, you are amazing!\".",
      "Cualquier usuario: \"Welcome USUARIO, you are logged in!\".",
    ],
    where: "client",
    steps: [
      "Cuando entra joaquin, tiene que ver: Welcome to you, user Joaquin, you are amazing!",
      "Cualquier usuario que entre (por ejemplo felipe o erik) tiene que ver: Welcome USUARIO, you are logged in!",
      "USUARIO es el nombre de quien entró, no un texto fijo.",
    ],
    help: {
      tip: "El saludo de una sola persona va en su bashrc. El de todos va en profile.d. Si lo ponés solo en /etc/bashrc, un login no interactivo puede no verlo: probá con su - usuario.",
      videoHint: "Q19a es el mensaje de un usuario. Q19b es el de todos.",
      videos: [
        { title: "Q19a: Mensaje de login de un usuario", url: YT.loginUser },
        { title: "Q19b: Mensaje de login para todos", url: YT.loginAll },
      ],
      commands: [
        { cmd: "id joaquin || useradd joaquin", why: "Si el usuario del saludo no existe, el mensaje no se puede probar.", as: "root" },
        { cmd: "echo 'echo \"Welcome to you, user Joaquin, you are amazing!\"' >> /home/joaquin/.bashrc", why: "Solo para Joaquin. El dueño del archivo tiene que ser joaquin.", as: "root" },
        { cmd: "echo 'echo \"Welcome $USER, you are logged in!\"' > /etc/profile.d/welcome.sh", why: "Para todos. $USER se expande al entrar.", as: "root" },
        { cmd: "chmod 644 /etc/profile.d/welcome.sh", why: "Tiene que poder leerlo cualquier usuario.", as: "root" },
        { cmd: "su - felipe", why: "Probar un login de verdad, no solo bash -c.", as: "felipe" },
      ],
    },
  },
  {
    id: "lab-20",
    track: "pdf",
    title: "La imagen está en un registro privado",
    story: "El contenedor no está en el registro público. Hay que entrar al registro que nos pasan y traer la imagen.",
    objective: [
      "Clonar Text-To-PDF.",
      "Imagen localhost/text2pdf:latest.",
    ],
    where: "client",
    steps: [
      "Clonar https://github.com/sachinyadav3496/Text-To-PDF.git.",
      "Construir una imagen llamada text2pdf con el Dockerfile del repo.",
      "Etiquetarla localhost/text2pdf:latest.",
      "Verificar que la imagen existe en la máquina.",
    ],
    note: "Está en el PDF. En RHCSA 10 no es prioridad: el tema de contenedores es Flatpak. Si practicás la 9, este lab sí entra en la lista. Sin internet no se puede clonar.",
    help: {
      tip: "El nombre que pide el lab es el tag completo localhost/text2pdf:latest. podman images tiene que mostrar esa línea.",
      videoHint: "Q20a/b son registry privado. Q21 arma la imagen y el autostart. Para v10 priorizá Flatpak.",
      videos: [
        { title: "Q20a: Registry privado de Podman", url: YT.podmanRegistry },
        { title: "Q20b: Pull desde registry privado", url: YT.podmanPull },
        { title: "Q21: Imagen Podman y systemd", url: YT.podmanSystemd },
      ],
      commands: [
        { cmd: "dnf install -y podman git", why: "Herramientas de este lab.", as: "root" },
        { cmd: "git clone https://github.com/sachinyadav3496/Text-To-PDF.git", why: "El código y el Dockerfile.", as: "root" },
        { cmd: "podman build -t localhost/text2pdf:latest Text-To-PDF", why: "Construir y etiquetar en un paso. La ruta es la carpeta clonada.", as: "root" },
        { cmd: "podman images", why: "Tiene que listar localhost/text2pdf.", as: "root" },
      ],
    },
  },
  {
    id: "lab-21",
    track: "pdf",
    title: "Hay que poner el contenedor a correr",
    story: "La imagen ya está. Hay que levantar el contenedor con el nombre y los puertos que piden.",
    objective: [
      "Contenedor mycontainer, imagen localhost/text2pdf:latest.",
      "/opt/file → /data/input.",
      "/opt/processed → /data/output.",
    ],
    where: "client",
    steps: [
      "Contenedor llamado mycontainer, imagen localhost/text2pdf:latest.",
      "Montar /opt/file del host en /data/input.",
      "Montar /opt/processed del host en /data/output.",
    ],
    note: "Mismo aviso que el lab anterior: en v10 este tema no es el foco.",
    help: {
      tip: "Los directorios del host tienen que existir antes del -v. Si /opt/file es un archivo o no existe, el montaje falla.",
      videoHint: "Correr el contenedor con volúmenes está en Q21. Para v10, Flatpak.",
      videos: [{ title: "Q21: Imagen Podman y systemd", url: YT.podmanSystemd }],
      commands: [
        { cmd: "mkdir -p /opt/file /opt/processed", why: "Rutas del host. El enunciado las llama file y processed.", as: "root" },
        { cmd: "podman run -d --name mycontainer -v /opt/file:/data/input:Z -v /opt/processed:/data/output:Z localhost/text2pdf:latest", why: ":Z alcanza para SELinux en un lab. Sin -d el proceso se queda adelante.", as: "root" },
        { cmd: "podman ps", why: "mycontainer tiene que figurar.", as: "root" },
      ],
    },
  },
  {
    id: "lab-22",
    track: "pdf",
    title: "El contenedor tiene que volver cuando la máquina arranca",
    story: "Si se reinicia, el contenedor no puede quedar apagado. Tiene que levantarse con el usuario, sin que nadie abra sesión.",
    objective: [
      "Usuario student, contenedor mycontainer.",
      "Arranca al boot con linger, sin sesión abierta.",
    ],
    where: "client",
    steps: [
      "Correr el contenedor como el usuario student, nombre mycontainer.",
      "Mismos montajes: /opt/file → /data/input y /opt/processed → /data/output.",
      "Que arranque al boot con un servicio systemd de usuario.",
      "loginctl enable-linger student, para que el servicio viva sin una sesión activa.",
    ],
    note: "Si student no existe en la box, crealo para este lab. Sigue siendo tema de contenedores del PDF, no de Flatpak.",
    help: {
      tip: "El servicio de usuario no es el de root. Hace falta systemctl --user, y linger para que arranque sin que student esté logueado.",
      videoHint: "Video de este lab: Q21 (systemd y linger).",
      videos: [{ title: "Q21: Imagen Podman y systemd", url: YT.podmanSystemd }],
      commands: [
        { cmd: "id student || useradd student", why: "El enunciado corre el contenedor como student.", as: "root" },
        { cmd: "loginctl enable-linger student", why: "El user manager queda activo sin sesión.", as: "root" },
        { cmd: "sudo -u student podman run -d --name mycontainer -v /opt/file:/data/input:Z -v /opt/processed:/data/output:Z localhost/text2pdf:latest", why: "El contenedor queda en el storage de student, no en el de root.", as: "student" },
        { cmd: "sudo -u student podman generate systemd --name mycontainer --files --new", why: "Crea la unidad. man podman-generate-systemd.", as: "student" },
        { cmd: "systemctl --user enable --now container-mycontainer", why: "Ejecutado como student, con linger ya puesto.", as: "root" },
      ],
    },
  },
  {
    id: "extra-01",
    track: "extra",
    title: "Hace falta un programa que liste los textos de tres carpetas",
    story: "En tres carpetas puede haber archivos de texto, o puede no haber carpeta. El programa tiene que decir qué encontró en cada una.",
    objective: [
      "Script /usr/local/bin/gap-txt.sh.",
      "Mira /opt/lab/dir1, dir2 y dir3.",
    ],
    where: "client",
    steps: [
      "Creá /usr/local/bin/gap-txt.sh y dejalo ejecutable.",
      "Tiene que mirar solo el primer nivel de /opt/lab/dir1, /opt/lab/dir2 y /opt/lab/dir3.",
      "Si el directorio no existe: Directory RUTA not found.",
      "Si existe y no hay *.txt: No text files found in RUTA.",
      "Si hay .txt: los nombres de archivo, ordenados, uno por línea. Sin la ruta.",
      "El entorno se arma con el script de preparación del lab de scripting del repo. No mires el archivo de respuestas.",
    ],
    help: {
      tip: "find con -maxdepth 1 no baja a subcarpetas. sort ordena los nombres. Probá los tres casos: directorio ausente, vacío de txt, y con txt.",
      videoHint: "Video de este lab: Bonus GAP Q01.",
      videos: [{ title: "Bonus: Scripting simple", url: YT.scripting }],
      commands: [
        { cmd: "man test", why: "-d para saber si el directorio existe.", as: "root" },
        { cmd: "find /opt/lab/dir1 -maxdepth 1 -name '*.txt' -printf '%f\\n' | sort", why: "%f imprime solo el nombre. Ajustalo dentro del if.", as: "root" },
        { cmd: "chmod 755 /usr/local/bin/gap-txt.sh", why: "Tiene que poder ejecutarse.", as: "root" },
        { cmd: "bash -n /usr/local/bin/gap-txt.sh", why: "Revisar sintaxis antes de correrlo.", as: "root" },
      ],
    },
  },
  {
    id: "extra-02",
    track: "extra",
    title: "Una limpieza tiene que correr sola a una hora",
    story: "No queremos acordarnos de borrar los archivos viejos. Un timer tiene que hacerlo en el horario pedido, también si la máquina estaba apagada a esa hora.",
    objective: [
      "Timer cleanup habilitado al boot.",
      "A :30 corre /usr/local/bin/clean.sh.",
    ],
    where: "client",
    steps: [
      "Hay un proceso que deja archivos en /tmp al segundo 00 de cada minuto. El prep está en el lab de timers del repo.",
      "Creá un servicio y un timer llamados cleanup.",
      "El servicio corre /usr/local/bin/clean.sh.",
      "La limpieza ocurre a los 30 segundos de cada minuto.",
      "El timer queda habilitado y arranca solo al boot.",
      "Comprobación: los archivos aparecen en :00 y desaparecen en :30.",
    ],
    help: {
      tip: "OnCalendar y el servicio son dos unidades. enable se lo das al timer, no solo al service. systemd-analyze calendar te dice la próxima corrida antes de esperar un minuto.",
      videoHint: "Video de este lab: Bonus GAP Q02. Es objetivo de v10.",
      videos: [{ title: "Bonus: Timers de systemd", url: YT.timers }],
      commands: [
        { cmd: "man systemd.timer", why: "OnCalendar y Persistent.", as: "root" },
        { cmd: "systemd-analyze calendar '*-*-* *:00:30'", why: "Ver que la expresión cae en el segundo 30.", as: "root" },
        { cmd: "systemctl cat cleanup.timer", why: "Leer la unidad que escribiste en /etc/systemd/system/.", as: "root" },
        { cmd: "systemctl enable --now cleanup.timer", why: "Queda al boot y arranca ahora.", as: "root" },
        { cmd: "systemctl list-timers cleanup.timer", why: "Próxima y última ejecución.", as: "root" },
      ],
    },
  },
  {
    id: "extra-03",
    track: "extra",
    title: "El FTP anónimo tiene que poder dejar y llevar archivos",
    story: "La gente entra sin cuenta. Tiene que poder bajar de una carpeta y subir a otra, con SELinux todavía activo.",
    objective: [
      "vsftpd en enforcing.",
      "Anónimo descarga de /srv/company-drop/pub.",
      "Anónimo sube a /srv/company-drop/incoming.",
    ],
    where: "server o client",
    steps: [
      "El servicio es vsftpd. El script de preparación del repo deja el escenario.",
      "Un anónimo tiene que poder descargar de /srv/company-drop/pub.",
      "Un anónimo tiene que poder subir a /srv/company-drop/incoming.",
      "SELinux sigue en enforcing. No vale setenforce 0, ni mover los archivos a /var/ftp, ni chmod 777.",
    ],
    help: {
      tip: "El AVC del audit log dice qué tipo de contexto falta. No adivines el boolean: leé el mensaje y después sealert o ausearch.",
      videoHint: "Video de este lab: Bonus GAP Q05. No es el de solo cambiar un puerto.",
      videos: [{ title: "Bonus: SELinux y VSFTP", url: YT.selinuxFtp }],
      commands: [
        { cmd: "getenforce", why: "Tiene que seguir en Enforcing.", as: "root" },
        { cmd: "ausearch -m avc -ts recent", why: "El rechazo concreto, no un resumen genérico.", as: "root" },
        { cmd: "ls -Zd /srv/company-drop /srv/company-drop/pub /srv/company-drop/incoming", why: "Comparar el contexto con el que vsftpd espera.", as: "root" },
        { cmd: "semanage fcontext -l | grep ftp", why: "Ver public_content_t y public_content_rw_t.", as: "root" },
        { cmd: "getsebool -a | grep ftp", why: "El booleano de escritura anónima, y dejarlo con -P.", as: "root" },
        { cmd: "man restorecon", why: "Aplicar el contexto que semanage fcontext declaró.", as: "root" },
      ],
    },
  },
  {
    id: "extra-04",
    track: "extra",
    title: "Unas aplicaciones quedan para todos y otra para una persona",
    story: "Nos pasan un depósito de aplicaciones. Una queda para toda la máquina y otra solo para un usuario. Las dos siguen después de cerrar sesión.",
    objective: [
      "Agregá un remote de Flatpak y dejalo guardado. De ahí salen las apps. La dirección te la dan en el enunciado.",
      "Instalá una app para todos los usuarios de la máquina.",
      "Instalá otra app, distinta, para un usuario concreto. Hacelo en la sesión de ese usuario. Desde root, la app queda en root.",
      "Cerrá sesión y volvé a entrar. Las dos tienen que seguir instaladas.",
    ],
    where: "client",
    steps: [
      "Agregá un remote de Flatpak y dejalo configurado.",
      "Instalá una aplicación a nivel sistema.",
      "Instalá otra aplicación como un usuario concreto, con --user. Si lo corrés como root, queda en root y no en ese usuario.",
      "Las dos tienen que seguir listadas después de cerrar sesión.",
    ],
    note: "Entra por los objetivos nuevos de RHEL 10. El comando flatpak sale del repo DNF local. Las apps salen del remote que te pasan: la URL no se memoriza. flathub.org pide internet; un file:/// o un http del lab, no. Q23 no dice que el examen sea sin internet. Si el remote es el de Red Hat, el install puede pedir login. El Flatpak de un usuario concreto conviene practicarlo con tiempo.",
    help: {
      tip: "--system y --user no se mezclan. flatpak --user de root no es el Flatpak de felipe. Entrá con sudo -u USUARIO, o el install --user queda en el usuario equivocado. flatpak list sin --user no muestra las de usuario. Cómo se conecta un remote local está en man flatpak-remote-add: LOCATION es la URL o la carpeta.",
      videoHint: "Q23 agrega el remote con la URL que le dan, instala con --system, y si el remote rhel dice login required entra con podman login. Después muestra bajar de commit y flatpak mask. No arma un file:///. El otro no baja de commit ni usa mask: muestra el remote que ya trae el escritorio, cómo borrarlo, flatpak run, update, uninstall y --unused. El link arranca en el minuto 3:19.",
      videos: [
        { title: "Q23: Flatpak (RHCSA 10)", url: YT.flatpak },
        { title: "Gestión de Flatpak · revisión RHCSA 10", url: YT.flatpakReview },
      ],
      commands: [
        { cmd: "dnf install -y flatpak", why: "El paquete sale del repo DNF local, el de BaseOS y AppStream. No hace falta internet para tener el comando.", as: "root" },
        { cmd: "flatpak remotes", why: "No cambia nada. Lista los remotes ya guardados. Si no aparece ninguno, hay que agregarlo.", as: "root" },
        { cmd: "man flatpak-remote-add", why: "Ahí está cómo conectar un remote, también local. NAME es la etiqueta que elegís. LOCATION es un http:// o un file:/// con tres barras, o la carpeta del repo. --if-not-exists no falla si ya existe. --system es el de todos. --user es el de una cuenta.\nDentro del man, /LOCATION salta a eso. Si el repo local se queja de GPG, en la misma página está --no-gpg-verify.\nflatpak remote-add --help muestra las mismas opciones en una pantalla, sin abrir el man.", as: "root" },
        { cmd: "flatpak remote-add --if-not-exists NOMBRE {link-del-remote}", why: "Guarda el remote de sistema. NOMBRE es la etiqueta: no tiene que llamarse flathub. {link-del-remote} es el http:// o el file:/// que te pasan.\nSi el link es flathub.org, hace falta internet. Si es file:///ruta o un http de la red del lab, no.", as: "root" },
        { cmd: "flatpak remote-ls NOMBRE", why: "No cambia nada. Lista las apps que ese remote ya tiene. El APP_ID se copia de acá, tal cual, con las mayúsculas.", as: "root" },
        { cmd: "flatpak search PALABRA", why: "La otra forma que usa Q23 para encontrar el APP_ID. Filtra por nombre. El ID igual se copia de la salida.", as: "root" },
        { cmd: "flatpak install -y --system NOMBRE APP_ID", why: "Instala a nivel sistema desde ese remote. NOMBRE es la etiqueta del remote-add. -y no pregunta.\nSi dice login required, primero el podman login de abajo y después se repite este install.\nSi dice cannot autolaunch a bus without an X11 display, estás en SSH. Q23 lo corre desde la terminal del escritorio.", as: "root" },
        { cmd: "dnf install -y podman && podman login REGISTRY", why: "Solo si el install dice login required, como el remote rhel de Q23. Usuario y token te los pasan. podman login los guarda y el flatpak install sigue.\nEl portal de Red Hat es lo que él usa en su casa para sacar el token. En el examen no hace falta abrirlo si las credenciales ya están en el enunciado. Flathub no pide este login.", as: "root" },
        { cmd: "flatpak remote-info --log NOMBRE APP_ID", why: "No cambia nada. Q23 lo usa para bajar de versión: lista los commits de esa app en el remote. El commit se copia de acá.", as: "root" },
        { cmd: "flatpak update --commit=COMMIT APP_ID", why: "Deja esa app en el commit copiado. Es el downgrade del video.", as: "root" },
        { cmd: "flatpak mask APP_ID", why: "Fija la app. Un flatpak update de después no la sube. flatpak mask --remove APP_ID saca el freno.", as: "root" },
        { cmd: "sudo -u felipe flatpak remote-add --user --if-not-exists NOMBRE {link-del-remote}", why: "El remote de sistema no le aparece a felipe cuando usa --user. Hay que agregarlo en su cuenta. La opción --user está en man flatpak-remote-add.", as: "felipe" },
        { cmd: "sudo -u felipe flatpak install --user -y NOMBRE OTRA_APP", why: "Corre como felipe. --user de root instala en root, no en felipe.", as: "felipe" },
        { cmd: "flatpak list && flatpak list --user", why: "Las dos listas. No necesitan red: muestran lo que ya quedó instalado. Tienen que seguir después de cerrar sesión.", as: "root" },
      ],
    },
  },
  {
    id: "extra-05",
    track: "extra",
    title: "Quitar un Flatpak",
    objective: [
      "Si no hay una app Flatpak para todos, instalá una desde el remote.",
      "Desinstalá esa app y los datos que haya guardado.",
      "Sacá el runtime que ya nadie usa. Si otra app lo necesita, dejalo.",
      "Volvé a mirar las apps instaladas. Esa no tiene que aparecer.",
    ],
    where: "client",
    steps: [
      "Si no hay una app Flatpak de sistema, instalá una desde el remote.",
      "Desinstalala, también los datos que haya dejado.",
      "Sacá el runtime que quedó sin usar.",
      "flatpak list ya no muestra esa app.",
    ],
    note: "En lo publicado hay que poder instalar y sacar paquetes Flatpak. Este lab es la parte de sacar. El remote y la app de un usuario están en el lab anterior.",
    help: {
      tip: "El APP_ID se copia de flatpak list, con las mayúsculas. --unused no toca un runtime que otra app todavía usa.",
      videoHint: "La revisión muestra uninstall, --delete-data y --unused. Q23 no lo hace como tarea: saca Thunderbird de paso.",
      videos: [
        { title: "Gestión de Flatpak · revisión RHCSA 10", url: YT.flatpakReview },
        { title: "Q23: Flatpak (RHCSA 10)", url: YT.flatpak },
      ],
      commands: [
        { cmd: "flatpak list", why: "No cambia nada. Muestra lo instalado. Si ya hay una app de sistema, el APP_ID se copia de acá y el install de abajo no hace falta.", as: "root" },
        { cmd: "flatpak install -y --system NOMBRE APP_ID", why: "Solo si la lista está vacía. NOMBRE es la etiqueta del remote. El APP_ID sale de flatpak search o de flatpak remote-ls.\nSi dice login required, es el podman login del lab anterior.", as: "root" },
        { cmd: "flatpak uninstall -y --delete-data APP_ID", why: "Saca la app y los datos que escribió en ~/.var. Sin --delete-data la app sale de la lista y esos archivos quedan. El APP_ID es el mismo del install.", as: "root" },
        { cmd: "flatpak uninstall -y --unused", why: "Saca runtimes y extensiones que ninguna app usa. En la revisión, al borrar Firefox también se va el runtime si nadie más lo necesita.", as: "root" },
        { cmd: "flatpak list", why: "No cambia nada. La app no tiene que aparecer. Si era la única, el runtime tampoco.", as: "root" },
      ],
    },
  },
];

for (const lab of LABS) {
  const copy = LAB_EN[lab.id];
  if (!copy) throw new Error(`Falta la traducción de ${lab.id}`);
  if (copy.steps.length !== lab.steps.length) {
    throw new Error(`${lab.id}: steps ${copy.steps.length} != ${lab.steps.length}`);
  }
  if (copy.objective.length !== lab.objective.length) {
    throw new Error(`${lab.id}: objective ${copy.objective.length} != ${lab.objective.length}`);
  }
  if (copy.why.length !== lab.help.commands.length) {
    throw new Error(`${lab.id}: why ${copy.why.length} != ${lab.help.commands.length}`);
  }
  if ((copy.videos?.length ?? 0) !== lab.help.videos.length) {
    throw new Error(`${lab.id}: videos ${(copy.videos?.length ?? 0)} != ${lab.help.videos.length}`);
  }
}

function localizeAs(as: string | undefined, locale: Locale): string | undefined {
  if (!as || locale === "es") return as;
  if (as === "consola VM") return "VM console";
  if (as === "info") return "note";
  return as;
}

export function labById(id: string, locale: Locale = "es"): Lab | undefined {
  return labsFor(locale).find((lab) => lab.id === id);
}

export function labsFor(locale: Locale): Lab[] {
  if (locale === "es") return LABS;
  return LABS.map((lab) => {
    const copy = LAB_EN[lab.id];
    if (!copy) return lab;
    return {
      ...lab,
      title: copy.title,
      story: copy.story,
      objective: copy.objective,
      where: copy.where,
      steps: copy.steps,
      note: copy.note ?? lab.note,
      help: {
        ...lab.help,
        tip: copy.tip,
        videoHint: copy.videoHint,
        videos: lab.help.videos.map((video, index) => ({
          ...video,
          title: copy.videos?.[index] ?? video.title,
        })),
        commands: lab.help.commands.map((command, index) => ({
          ...command,
          why: copy.why[index] ?? command.why,
          as: localizeAs(command.as, "en"),
          slip: copy.slip?.[index],
        })),
      },
    };
  });
}
