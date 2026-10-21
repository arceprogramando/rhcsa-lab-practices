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
}

export interface Lab {
  id: string;
  track: "pdf" | "extra" | "setup";
  title: string;
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
    title: "Teclado",
    objective: [
      "En vagrant ssh el teclado lo pone tu máquina.",
      "En el client podés pasar a latam / la-latin1 para la consola de la VM.",
      "En el server dejá el teclado en us.",
    ],
    where: "client · vagrant ssh. El server se deja en us",
    steps: [
      "Estás en vagrant ssh. El teclado de esta ventana lo pone tu máquina, no la VM. Por eso, aunque localectl status diga VC Keymap us y X11 Layout unset, acá escribís en español sin problema. gsettings en esta SSH responde No schemas installed: no lo uses.",
      "localectl no tiene get ni set. Con localectl --help o man localectl ves los comandos: status muestra lo que está puesto, y para cambiar se usan los que empiezan con set-, que piden sudo. La lista gráfica es localectl list-x11-keymap-layouts: latam es latinoamericano y us es inglés de Estados Unidos. La de la consola es localectl list-keymaps: ahí el latinoamericano es la-latin1.",
      "Esos set no cambian esta SSH. Cambian la consola de la VM: la ventana de VirtualBox, GRUB y el rescate. En el client, si vas a escribir ahí: sudo localectl set-x11-keymap latam y sudo localectl set-keymap la-latin1. Si solo practicás por SSH, podés dejarlo en us.",
      "Si los cambiaste, localectl status tiene que mostrar X11 Layout latam y VC Keymap la-latin1. Esta ventana de SSH sigue igual.",
      "En el server no lo pases a latam. El rescate con init=/bin/bash o rd.break se tipea en la consola de esa VM, no por SSH, y esa consola arranca en inglés us.",
    ],
    note: "VC Keymap us y X11 Layout unset no frenan esta SSH: las letras ya llegan traducidas desde tu máquina. localectl cambia la consola de la VM. En el server, al reboot, entrás por GRUB y el teclado que vale es ese, de fábrica en us. Dejalo así. Que el examen use el teclado inglés us lo saqué de distintos lados: todavía no lo rendí para confirmarlo.",
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
    title: "Recuperar root en el client",
    objective: [
      "Reset de la contraseña de root en el client.",
      "Nueva contraseña: student.",
      "SELinux coherente antes del boot normal.",
    ],
    where: "client · consola de VirtualBox, no SSH",
    steps: [
      "Interrumpí el boot del client y recuperá el acceso de root.",
      "Poné la contraseña de root en student (las dos veces iguales).",
      "SELinux tiene que quedar coherente antes de volver al boot normal (autorelabel si hace falta).",
    ],
    note: "Es el mismo rescate que en el server, pero en el client y con password student. Practicá los dos métodos: rd.break puede no funcionar en v10; si /sysroot no existe, usá init=/bin/bash.",
    help: {
      tip: "Esto se hace en la ventana de la VM del client. SSH no sirve: no hay forma de editar GRUB desde afuera. En passwd escribí student dos veces. Si no coinciden, dice passwords do not match. Authentication token manipulation error también sale si el disco sigue en solo lectura.",
      videoHint: "Q22a es rd.break y puede no funcionar en v10. Q22b es init=/bin/bash, el que queda cuando /sysroot no existe.",
      videos: [
        { title: "Q22a: Reset de root (rd.break)", url: YT.rootRdBreak },
        { title: "Q22b: Reset de root (init=/bin/bash)", url: YT.rootInitBash },
      ],
      commands: [
        { cmd: "Método rd.break. En GRUB: tecla e, al final de la línea que empieza con linux, agregar rd.break. Ctrl-x para arrancar.", why: "Es el ejemplo del video de rd.break. Puede no funcionar en v10.", as: "consola VM" },
        { cmd: "mount -o remount,rw /sysroot", why: "Pone escribible el sistema que rd.break dejó en /sysroot. Si dice que /sysroot no existe, este método no entró. Ahí se pasa a init=/bin/bash.", as: "root" },
        { cmd: "chroot /sysroot", why: "Entra al sistema real. passwd y touch de abajo corren ahí, no en el shell de afuera.", as: "root" },
        { cmd: "passwd", why: "Pide la contraseña dos veces: las dos tienen que ser student. No hace falta escribir root: en este shell ya sos root.", as: "root" },
        { cmd: "touch /.autorelabel", why: "SELinux reetiqueta en el próximo boot. Sin esto el sistema puede quedar inutilizable.", as: "root" },
        { cmd: "exit", why: "Sale del chroot y vuelve al shell de rd.break.", as: "root" },
        { cmd: "reboot", why: "Sigue el boot. En el video de rd.break el orden es exit y después reboot.", as: "root" },
        { cmd: "Método init=/bin/bash. En GRUB: tecla e, al final de la misma línea linux, agregar init=/bin/bash. Ctrl-x para arrancar.", why: "Es el ejemplo del otro video. Se usa cuando rd.break no arma /sysroot.", as: "consola VM" },
        { cmd: "mount -o remount,rw /", why: "Acá la raíz es /, no /sysroot. Arranca solo lectura. Sin este remount, passwd no puede guardar la contraseña.", as: "root" },
        { cmd: "passwd", why: "Otra vez student dos veces, iguales.", as: "root" },
        { cmd: "touch /.autorelabel", why: "Igual que en rd.break: sin esto SELinux puede dejar el sistema inutilizable al volver a un boot normal.", as: "root" },
        { cmd: "sync", why: "Baja a disco lo que todavía está en memoria, antes de cortar.", as: "root" },
        { cmd: "exec /sbin/reboot -f", why: "Reinicia desde este shell. exec lo reemplaza, así que un exit escrito debajo no llega a correr. No salgas con exit antes de este reboot.", as: "root" },
      ],
    },
  },
  {
    id: "lab-01",
    track: "pdf",
    title: "Red y hostname del client",
    objective: [
      "IP 172.16.1.12/24 en la interfaz del lab.",
      "Gateway 172.16.1.1 y DNS 172.16.1.1.",
      "Hostname client.rhcsa.lab.",
      "Persistente tras reboot.",
    ],
    where: "client · 172.16.1.12",
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
        { cmd: "ip -br a", why: "Para saber cuál placa es la del lab. Muestra cada placa y su IP, en corto. La que tiene 172.16.1.12 es la del lab: en este Vagrant es enp0s8. Esa palabra se busca en la columna DEVICE de connection show. La NAME de esa misma fila es la que se modifica. La otra ethernet, enp0s3, suele ser la entrada (en el Vagrant, 10.0.2.15). Esa no se pasa a manual.", as: "root" },
        { cmd: "nmtui", why: "También se puede hacer por acá. En la conexión de enp0s8: IPv4 en Manual, Address 172.16.1.12/24, Gateway 172.16.1.1 y, en DNS servers, Add 172.16.1.1. Si dice <Add...>, el DNS no está puesto.", as: "root" },
        { cmd: "nmcli connection modify NOMBRE ipv4.method manual ipv4.addresses 172.16.1.12/24 ipv4.gateway 172.16.1.1 ipv4.dns 172.16.1.1", why: "NOMBRE es la columna NAME de la fila del lab, no la placa. Si esa fila dice hostonly y DEVICE enp0s8, el comando es modify hostonly. Guarda la IP, el gateway y el DNS en ese perfil. ipv4.dns es el pedazo que anota el DNS. Sin eso, el DNS no queda. sudo hace falta si el prompt es vagrant@. Si ya es root@, sudo no suma nada.", as: "root" },
        { cmd: "restorecon -v /etc/NetworkManager/system-connections/NOMBRE.nmconnection", why: "No es un paso de siempre. Solo si el modify anterior dice Permission denied al renombrar el .nmconnection, aunque el prompt ya sea root@. El archivo se llama como la columna NAME: si el perfil es hostonly, el archivo es hostonly.nmconnection. SELinux no deja que NetworkManager lo reemplace. Este comando no guarda el DNS. Corrige la etiqueta y, si hacía falta, avisa Relabeled. Después se vuelve a correr el modify.", as: "root" },
        { cmd: "nmcli -f ipv4.dns connection show NOMBRE", why: "No cambia nada. NOMBRE es otra vez la columna NAME, por ejemplo hostonly. Muestra solo el DNS guardado en ese perfil. Si quedó, la línea dice ipv4.dns: 172.16.1.1. Si sale vacío, no quedó. ip a no muestra el DNS.", as: "root" },
        { cmd: "nmcli connection up NOMBRE", why: "Aplica ahora lo que el modify ya guardó en ese perfil. No es lo que lo hace persistente: el modify ya lo escribió en disco. up sirve para no esperar al reboot. NOMBRE sigue siendo la columna NAME.", as: "root" },
        { cmd: "hostnamectl set-hostname client.rhcsa.lab", why: "Cambia el hostname ya, y lo guarda. No hace falta nmcli connection up ni ningún otro up: el hostname no es parte del perfil de red. Después de un reboot, hostnamectl tiene que seguir diciendo client.rhcsa.lab.", as: "root" },
        { cmd: "man nmcli", why: "En el examen esto es legal. Buscá connection modify.", as: "root" },
      ],
    },
  },
  {
    id: "lab-02",
    track: "pdf",
    title: "Recuperar root y red del server",
    objective: [
      "Reset de la contraseña de root.",
      "IP 172.16.1.13/24, gateway y DNS 172.16.1.1.",
      "Hostname server.rhcsa.lab.",
      "Persistente tras reboot.",
    ],
    where: "server · consola de VirtualBox, no SSH",
    steps: [
      "Interrumpí el boot y recuperá el acceso de root. SELinux tiene que quedar coherente antes de volver al boot normal (autorelabel si hace falta).",
      "IP 172.16.1.13/24, gateway 172.16.1.1, DNS 172.16.1.1.",
      "Hostname server.rhcsa.lab.",
      "Tiene que seguir así después de reboot.",
    ],
    note: "Hay que saber los dos métodos. rd.break puede no funcionar en v10: si /sysroot no existe, ese método no entró y se usa init=/bin/bash. El mismo rescate también se practica en el client (lab anterior), con password student.",
    help: {
      tip: "Esto se hace en la ventana de la VM del server. SSH no sirve: no hay forma de editar GRUB desde afuera. En passwd las dos contraseñas tienen que ser iguales (para practicar, student también sirve). Si no coinciden, dice passwords do not match. Authentication token manipulation error también sale si el disco sigue en solo lectura.",
      videoHint: "Q22a es rd.break y puede no funcionar en v10. Q22b es init=/bin/bash, el que queda cuando /sysroot no existe. La red del server es la misma que Q01.",
      videos: [
        { title: "Q22a: Reset de root (rd.break)", url: YT.rootRdBreak },
        { title: "Q22b: Reset de root (init=/bin/bash)", url: YT.rootInitBash },
        { title: "Q01b: Red con nmcli y hostnamectl", url: YT.nmcli },
      ],
      commands: [
        { cmd: "Método rd.break. En GRUB: tecla e, al final de la línea que empieza con linux, agregar rd.break. Ctrl-x para arrancar.", why: "Es el ejemplo del video de rd.break. Puede no funcionar en v10.", as: "consola VM" },
        { cmd: "mount -o remount,rw /sysroot", why: "Pone escribible el sistema que rd.break dejó en /sysroot. Si dice que /sysroot no existe, este método no entró. Ahí se pasa a init=/bin/bash.", as: "root" },
        { cmd: "chroot /sysroot", why: "Entra al sistema real. passwd y touch de abajo corren ahí, no en el shell de afuera.", as: "root" },
        { cmd: "passwd", why: "Pide la contraseña dos veces y tienen que coincidir. Para practicar, usá student. No hace falta escribir root: en este shell ya sos root.", as: "root" },
        { cmd: "touch /.autorelabel", why: "SELinux reetiqueta en el próximo boot. Sin esto el sistema puede quedar inutilizable.", as: "root" },
        { cmd: "exit", why: "Sale del chroot y vuelve al shell de rd.break.", as: "root" },
        { cmd: "reboot", why: "Sigue el boot. En el video de rd.break el orden es exit y después reboot.", as: "root" },
        { cmd: "Método init=/bin/bash. En GRUB: tecla e, al final de la misma línea linux, agregar init=/bin/bash. Ctrl-x para arrancar.", why: "Es el ejemplo del otro video. Se usa cuando rd.break no arma /sysroot.", as: "consola VM" },
        { cmd: "mount -o remount,rw /", why: "Acá la raíz es /, no /sysroot. Arranca solo lectura. Sin este remount, passwd no puede guardar la contraseña.", as: "root" },
        { cmd: "passwd", why: "Otra vez las dos contraseñas tienen que ser la misma. Para practicar, student.", as: "root" },
        { cmd: "touch /.autorelabel", why: "Igual que en rd.break: sin esto SELinux puede dejar el sistema inutilizable al volver a un boot normal.", as: "root" },
        { cmd: "sync", why: "Baja a disco lo que todavía está en memoria, antes de cortar.", as: "root" },
        { cmd: "exec /sbin/reboot -f", why: "Reinicia desde este shell. exec lo reemplaza, así que un exit escrito debajo no llega a correr. No salgas con exit antes de este reboot.", as: "root" },
      ],
    },
  },
  {
    id: "lab-03",
    track: "pdf",
    title: "Repositorios DNF",
    objective: [
      "Repos BaseOS y AppStream enabled en client y server.",
      "gpgcheck=0 en esos dos.",
      "dnf list available tiene que listar paquetes.",
    ],
    where: "client y server",
    steps: [
      "En las dos máquinas, BaseOS y AppStream tienen que figurar en dnf repolist.",
      "gpgcheck desactivado en esos dos repos.",
      "La configuración queda en /etc/yum.repos.d/ y sobrevive un reboot.",
      "dnf list available tiene que devolver paquetes de los dos.",
    ],
    note: "El PDF apunta a un mirror de laboratorio que este Vagrant no trae. Usá los repos de Rocky 10 de la box, o un baseurl que sí responda desde la VM.",
    help: {
      tip: "Un .repo roto (baseurl que no existe) te deja dnf inutilizable. Probá con curl la URL antes de guardarla.",
      videoHint: "Video de este lab: Q03.",
      videos: [{ title: "Q03: Repositorios YUM/DNF", url: YT.repos }],
      commands: [
        { cmd: "dnf repolist", why: "Ver qué repos están enabled ahora.", as: "root" },
        { cmd: "ls /etc/yum.repos.d/", why: "Ahí vive la config que persiste.", as: "root" },
        { cmd: "dnf config-manager --setopt=REPOS.gpgcheck=0 --save", why: "Apagar GPG sin reescribir el archivo a ciegas. El nombre del repo sale de repolist.", as: "root" },
        { cmd: "man dnf.conf", why: "gpgcheck, enabled, baseurl.", as: "root" },
        { cmd: "dnf list available | head", why: "Comprobar que de verdad lista paquetes.", as: "root" },
      ],
    },
  },
  {
    id: "lab-04",
    track: "pdf",
    title: "Apache en el puerto 82",
    objective: [
      "httpd escucha en TCP 82.",
      "SELinux en enforcing.",
      "Persistente tras reboot.",
    ],
    where: "server (ahí el Vagrant instala httpd)",
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
        { cmd: "getenforce", why: "Tiene que decir Enforcing cuando termines.", as: "root" },
        { cmd: "semanage port -l | grep http", why: "Ver qué puertos ya son http_port_t.", as: "root" },
        { cmd: "semanage port -a -t http_port_t -p tcp 82", why: "Autorizar el puerto sin tocar los archivos de /var/www/html.", as: "root" },
        { cmd: "grep -n Listen /etc/httpd/conf/httpd.conf", why: "Cambiar el Listen a 82.", as: "root" },
        { cmd: "firewall-cmd --add-port=82/tcp --permanent && firewall-cmd --reload", why: "Abrir el puerto y dejarlo permanente.", as: "root" },
        { cmd: "systemctl restart httpd && ss -ltnp | grep 82", why: "Ver que quedó escuchando.", as: "root" },
      ],
    },
  },
  {
    id: "lab-05",
    track: "pdf",
    title: "Usuarios, grupo y sudo",
    objective: [
      "Grupo sysadm.",
      "Usuarios: felipe y erik en sysadm; diego con /sbin/nologin.",
      "Contraseña de los tres: lalala.",
      "sysadm puede sudo useradd.",
      "felipe puede sudo passwd sin que pida contraseña.",
    ],
    where: "client",
    steps: [
      "Grupo sysadm.",
      "Felipe: grupo secundario sysadm.",
      "Erik: grupo secundario sysadm.",
      "Diego: sin shell interactiva (/sbin/nologin) y fuera de sysadm.",
      "Contraseña del ejercicio para los tres: lalala.",
      "Quien esté en sysadm puede crear usuarios con sudo.",
      "Felipe puede cambiar la contraseña de otros usuarios sin que sudo le pida contraseña.",
      "Persistente.",
    ],
    help: {
      tip: "El grupo de este lab es sysadm, no wheel. Si el usuario ya existe, el secundario se suma con usermod -aG, no con otro useradd. La regla de sudo va con visudo: un error de sintaxis te deja sin sudo. Para borrar: userdel -r USUARIO (cuenta + home) y groupdel GRUPO (el grupo no puede ser primario de nadie).",
      videoHint: "Video de este lab: Q05.",
      videos: [{ title: "Q05: Usuarios, grupos y sudo", url: YT.users }],
      commands: [
        { cmd: "id felipe", why: "No cambia nada. Si el usuario existe, muestra uid, gid y grupos. getent passwd felipe también sirve: una línea con la cuenta. Si no existe, id dice no such user.", as: "root" },
        { cmd: "getent passwd", why: "Lista todas las cuentas. Solo nombres: getent passwd | cut -d: -f1. Usuarios de persona (UID 1000 o más, sin nobody): getent passwd | awk -F: '$3 >= 1000 && $3 < 65534 {print $1}'. Ahí tienen que aparecer felipe, erik y diego.", as: "root" },
        { cmd: "groupadd sysadm", why: "Crear el grupo del enunciado.", as: "root" },
        { cmd: "useradd -G sysadm felipe && useradd -G sysadm erik", why: "-G es secundario. No uses -g si no querés cambiar el grupo primario. Solo si el usuario todavía no existe.", as: "root" },
        { cmd: "usermod -aG sysadm felipe", why: "Si felipe ya existía, esto suma sysadm sin sacar los grupos secundarios que ya tenía. El grupo va primero, el usuario después. Sin -a, -G reemplaza la lista entera y se pierden los otros. Comprobar con id felipe. Lo mismo para erik.", as: "root" },
        { cmd: "useradd -s /sbin/nologin diego", why: "Diego no entra a una shell y no va a sysadm.", as: "root" },
        { cmd: "usermod -l erik Erik", why: "Renombra el login: el nombre nuevo va primero. Erik no puede estar logueado. El home y el grupo primario no cambian solos. Home y carpeta: usermod -l erik -d /home/erik -m Erik. Grupo primario: groupmod -n erik Erik.", as: "root" },
        { cmd: "man usermod | grep -- '-l'", why: "Busca la opción -l en el manual. man usermod | grep -l falla: -l es opción de grep, no el texto. El -- dice que lo de atrás es el patrón. Sale -l, --login NEW_LOGIN. También puede salir -L, --lock, porque --lock contiene -l.", as: "root" },
        { cmd: "passwd felipe", why: "Repetilo para erik y diego. La contraseña del ejercicio es lalala.", as: "root" },
        { cmd: "visudo -f /etc/sudoers.d/sysadm", why: "Ahí va la regla del grupo. El archivo queda en 440.", as: "root" },
        { cmd: "%sysadm ALL=(ALL) /usr/sbin/useradd", why: "El grupo puede crear usuarios. El % indica grupo.", as: "root" },
        { cmd: "felipe ALL=(ALL) NOPASSWD: /usr/bin/passwd", why: "Solo Felipe, solo passwd, sin contraseña de sudo.", as: "root" },
        { cmd: "sudo -l -U felipe", why: "Leer la regla antes de probar con su - felipe.", as: "root" },
        { cmd: "userdel -r erik", why: "Borrar un usuario: userdel -r NOMBRE. Quita la cuenta, el home (/home/erik) y el mail. Sin -r queda la carpeta home. El usuario no puede tener sesión abierta (loginctl terminate-user erik si hace falta). En XFS eso no se recupera: otro useradd deja el home vacío.", as: "root" },
        { cmd: "groupdel sysadm", why: "Borrar un grupo: groupdel NOMBRE. Tiene que estar vacío como grupo primario: primero borrá o cambiá de grupo a los usuarios que lo tengan de primario (usermod -g OTRO usuario). Si solo era secundario, userdel o usermod -G ya lo sacan de la lista. getent group sysadm comprueba que ya no está.", as: "root" },
      ],
    },
  },
  {
    id: "lab-06",
    track: "pdf",
    title: "Directorio compartido con setgid",
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
    title: "Cron de Erik",
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
    title: "NFS con autofs",
    objective: [
      "Usuario netuser1, home /home/guests/netuser1, pass arceprog.",
      "Export NFS en el server.",
      "Client: /netdir/netuser1 monta 172.16.1.13.",
    ],
    where: "server exporta · client monta",
    steps: [
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
        { cmd: "dnf install -y nfs-utils", why: "En server y en client.", as: "root" },
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
    title: "Zipear /etc",
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
        { cmd: "tar -tjf /root/myetcbackup.tar.bz2 | head", why: "Listar sin descomprimir, para verificar.", as: "root" },
        { cmd: "man tar", why: "Por si no te acordás qué letra es bzip2.", as: "root" },
      ],
    },
  },
  {
    id: "lab-10",
    track: "pdf",
    title: "ACL en /var/tmp/fstab",
    objective: [
      "Copia /etc/fstab → /var/tmp/fstab, dueño root:root.",
      "erik: lectura y escritura.",
      "felipe: sin acceso.",
      "others: solo lectura.",
    ],
    where: "client",
    steps: [
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
        { cmd: "dnf install -y acl", why: "setfacl no siempre está en la instalación mínima.", as: "root" },
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
    title: "Hora con chrony",
    objective: [
      "Server 172.16.1.13 ofrece NTP.",
      "Client 172.16.1.12 sincroniza contra ese server.",
      "Persistente en las dos.",
    ],
    where: "server ofrece hora · client es el cliente NTP",
    steps: [
      "El server (172.16.1.13) tiene que responder NTP.",
      "El client (172.16.1.12) usa ese server como fuente.",
      "Persistente en los dos.",
    ],
    help: {
      tip: "allow en el server y el firewall van juntos. chronyc sources en el client tiene que mostrar 172.16.1.13, no solo localhost.",
      videoHint: "Video de este lab: Q11.",
      videos: [{ title: "Q11: chrony / NTP", url: YT.chrony }],
      commands: [
        { cmd: "dnf install -y chrony", why: "En server y client si no está.", as: "root" },
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
    title: "Buscar archivos de Erik",
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
      tip: "Hay que conservar la ruta bajo /root/erikfiles. Dos formas válidas: cp --parents (como en el video) o find | cpio. Un cp sin --parents deja los archivos sueltos en el destino.",
      videoHint: "Video de este lab: Q12.",
      videos: [{ title: "Q12: find y copiar conservando rutas", url: YT.find }],
      commands: [
        { cmd: "find / -user erik -mtime -1 -type f 2>/dev/null", why: "Dueño erik, modificado hace menos de 1 día. El error de /proc se descarta.", as: "root" },
        { cmd: "mkdir -p /root/erikfiles", why: "Destino.", as: "root" },
        { cmd: "find / -user erik -mtime -1 -type f -exec cp --parents -p {} /root/erikfiles \\; 2>/dev/null", why: "Forma del video: find llama a cp por cada archivo. {} no es vacío ni una ruta que escribas vos: es un marcador. find lo reemplaza por la ruta real (ej. /home/erik/a.txt) y corre: cp --parents -p /home/erik/a.txt /root/erikfiles. --parents y -p son dos opciones distintas de cp (man cp): --parents recrea la ruta bajo el destino; -p conserva dueño, modo y fechas.", as: "root" },
        { cmd: "find / -user erik -mtime -1 -type f -print0 2>/dev/null | cpio -0pdm /root/erikfiles", why: "Otra forma: find lista y cpio copia el lote. -0 lee nombres con null, -p copia, -d crea dirs, -m conserva fechas. Elegí una de las dos, no hace falta las dos.", as: "root" },
        { cmd: "find /root/erikfiles -type f", why: "Ver que llegó la estructura, no un montón de archivos sueltos.", as: "root" },
      ],
    },
  },
  {
    id: "lab-13",
    track: "pdf",
    title: "Filtrar palabras con grep",
    objective: [
      "Fuente: /usr/share/dict/words.",
      "Líneas que contienen ich.",
      "Guardar en /root/lines.",
    ],
    where: "client",
    steps: [
      "Fuente: /usr/share/dict/words.",
      "Quedate con las palabras que contienen ich.",
      "Guardar el resultado en /root/lines.",
    ],
    help: {
      tip: "Si el diccionario no existe, no inventes el archivo: el paquete que lo provee se instala con dnf.",
      videoHint: "Video de este lab: Q13.",
      videos: [{ title: "Q13: grep en un diccionario", url: YT.grep }],
      commands: [
        { cmd: "ls /usr/share/dict/words || dnf provides /usr/share/dict/words", why: "Encontrar el paquete si la box no trae el diccionario.", as: "root" },
        { cmd: "grep ich /usr/share/dict/words > /root/lines", why: "ich en cualquier parte de la línea. No hace falta -E.", as: "root" },
        { cmd: "wc -l /root/lines && head /root/lines", why: "Tiene que haber líneas, y todas con ich.", as: "root" },
        { cmd: "man grep", why: "Por si el enunciado pide inicio de línea o palabra entera.", as: "root" },
      ],
    },
  },
  {
    id: "lab-14",
    track: "pdf",
    title: "Usuario con UID fijo",
    objective: [
      "Usuario arce.",
      "UID 1111.",
      "Contraseña rhcsa-exam.",
    ],
    where: "client",
    steps: [
      "Usuario: arce.",
      "UID: 1111.",
      "Contraseña del ejercicio: rhcsa-exam.",
    ],
    note: "En el PDF el usuario tenía otro nombre. Acá es arce, para no usar el hostname viejo del material original.",
    help: {
      tip: "Si el UID 1111 ya existe, id 1111 te lo dice antes de que useradd falle.",
      videoHint: "Video de este lab: Q14.",
      videos: [{ title: "Q14: Usuario con UID fijo", url: YT.uid }],
      commands: [
        { cmd: "getent passwd 1111", why: "Ver si el UID está libre.", as: "root" },
        { cmd: "useradd -u 1111 arce", why: "-u fija el UID.", as: "root" },
        { cmd: "echo 'rhcsa-exam' | passwd --stdin arce", why: "Contraseña del ejercicio, sin modo interactivo.", as: "root" },
        { cmd: "id arce", why: "Tiene que mostrar uid=1111.", as: "root" },
      ],
    },
  },
  {
    id: "lab-15",
    track: "pdf",
    title: "LVM wgroup / wshare",
    objective: [
      "VG wgroup, PE 8 MB.",
      "LV wshare de 50 extents, ext4.",
      "Montado en /mnt/wshare por UUID al boot.",
    ],
    where: "server · disco extra de 1 GB",
    steps: [
      "Volume group wgroup, extent físico de 8 MB.",
      "Logical volume wshare de 50 extents.",
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
        { cmd: "dnf install -y lvm2", why: "Si pvcreate no está.", as: "root" },
        { cmd: "pvcreate /dev/DISCO", why: "O una partición de ese disco, si preferís dejar lugar para el swap.", as: "root" },
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
    title: "Swap de 400 MB",
    objective: [
      "Partición swap de 400 MB.",
      "Activa ahora y en fstab.",
    ],
    where: "server · mismo disco extra",
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
    title: "Redimensionar el LV vo",
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
    title: "Perfil de tuned",
    objective: [
      "Perfil que diga tuned-adm recommend.",
      "Sigue activo después de reboot.",
    ],
    where: "client",
    steps: [
      "Instalar y activar tuned si no está.",
      "Aplicar el perfil recomendado.",
      "Tiene que quedar elegido después de reboot.",
    ],
    note: "El punto es cambiar el profile y que quede permanente. tuned-adm profile lo guarda. El servicio tuned tiene que estar enable, si no, al reboot vuelve atrás.",
    help: {
      tip: "recommend y profile no son el mismo comando. recommend te dice cuál. profile lo deja puesto, y queda guardado. Sin systemctl enable --now tuned, el reboot lo pierde.",
      videoHint: "Video de este lab: Q18.",
      videos: [{ title: "Q18: Perfil recomendado de tuned", url: YT.tuned }],
      commands: [
        { cmd: "dnf install -y tuned && systemctl enable --now tuned", why: "El servicio tiene que quedar habilitado.", as: "root" },
        { cmd: "tuned-adm recommend", why: "El perfil que pide el enunciado, no uno al azar.", as: "root" },
        { cmd: "tuned-adm profile NOMBRE", why: "Aplicar el que recommend imprimió.", as: "root" },
        { cmd: "tuned-adm active", why: "Confirmar, y de nuevo después de reboot.", as: "root" },
      ],
    },
  },
  {
    id: "lab-19",
    track: "pdf",
    title: "Saludo al entrar",
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
    title: "Imagen de contenedor",
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
    note: "Está en el PDF. En el EX200 v10 no es prioridad: entra Flatpak, y ese lab está en los extras. Si no hay salida a internet, este paso no se puede clonar.",
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
    title: "Correr el contenedor",
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
    title: "Contenedor al boot, como usuario",
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
    title: "Script de archivos .txt",
    objective: [
      "Script /usr/local/bin/gap-txt.sh.",
      "Mira /opt/lab/dir1, dir2 y dir3.",
    ],
    where: "client · después de correr el prep del repo",
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
    title: "Timer systemd de limpieza",
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
    title: "SELinux y FTP anonimo",
    objective: [
      "vsftpd en enforcing.",
      "Anónimo descarga de /srv/company-drop/pub.",
      "Anónimo sube a /srv/company-drop/incoming.",
    ],
    where: "server o client, donde corras el prep de vsftpd",
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
    title: "Flatpak de sistema y de usuario",
    objective: [
      "Remote Flatpak configurado.",
      "Una app de sistema.",
      "Otra app con --user en un usuario concreto.",
    ],
    where: "client",
    steps: [
      "Agregá un remote de Flatpak y dejalo configurado.",
      "Instalá una aplicación a nivel sistema.",
      "Instalá otra aplicación como un usuario concreto, con --user. Si lo corrés como root, queda en root y no en ese usuario.",
      "Las dos tienen que seguir listadas después de cerrar sesión.",
    ],
    note: "Entra por los objetivos nuevos de RHEL 10. Hace falta red para bajar las apps. El Flatpak de un usuario concreto conviene practicarlo con tiempo.",
    help: {
      tip: "--system y --user no se mezclan. flatpak --user de root no es el Flatpak de felipe. Entrá con sudo -u USUARIO, o el install --user queda en el usuario equivocado. flatpak list sin --user no muestra las de usuario.",
      videoHint: "Video de este lab: Q23.",
      videos: [{ title: "Q23: Flatpak (RHCSA 10)", url: YT.flatpak }],
      commands: [
        { cmd: "dnf install -y flatpak", why: "El comando no siempre viene en la mínima.", as: "root" },
        { cmd: "flatpak remotes", why: "Ver si ya hay un remote de sistema.", as: "root" },
        { cmd: "flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo", why: "Remote de sistema. man flatpak-remote-add.", as: "root" },
        { cmd: "flatpak install -y flathub APP_ID", why: "Instalación de sistema. El ID lo ves con flatpak remote-ls.", as: "root" },
        { cmd: "sudo -u felipe flatpak install --user -y flathub OTRA_APP", why: "Corre como felipe. --user de root instala en root, no en el usuario que pide el examen.", as: "felipe" },
        { cmd: "flatpak list && flatpak list --user", why: "Las dos listas, también después de un logout.", as: "root" },
      ],
    },
  },
];

export const PDF_COUNT = LABS.filter((lab) => lab.track === "pdf").length;

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
        })),
      },
    };
  });
}
