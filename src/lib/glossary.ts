import type { Locale } from "./i18n";

export interface TldrRef {
  /** Page name under tldr-pages, e.g. userdel */
  page: string;
  /** Folder in the repo: common or linux */
  platform?: "common" | "linux";
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  /** Link to usage examples on tldr-pages */
  tldr?: TldrRef;
}

export const TLDR_REPO = "https://github.com/tldr-pages/tldr";

export function tldrUrl(ref: TldrRef): string {
  const platform = ref.platform ?? "common";
  return `${TLDR_REPO}/blob/main/pages/${platform}/${ref.page}.md`;
}

const es: GlossaryEntry[] = [
  {
    term: "which",
    definition: "Dice la ruta del ejecutable que el shell va a correr. No busca archivos sueltos: busca comandos en el PATH.",
    example: "which logger → /usr/bin/logger",
    tldr: { page: "which" },
  },
  {
    term: "rpm",
    definition:
      "Consulta paquetes ya instalados. rpm -ql PAQUETE lista los archivos que dejó en el disco. Sirve cuando el paquete no trae un comando: which no lo va a encontrar. rpm -q PAQUETE solo dice si está instalado y qué versión.",
    example: "rpm -ql words → el diccionario queda en /usr/share/dict/words. which words no sirve: words no es un comando",
    tldr: { page: "rpm", platform: "linux" },
  },
  {
    term: "head",
    definition:
      "Muestra solo las primeras líneas de un archivo o de lo que llega por pipe (por defecto 10). Sirve para mirar un preview sin inundar la terminal. Con -n N cambiás cuántas líneas.",
    example: "tar -tjf /root/myetcbackup.tar.bz2 | head → lista el backup y head deja ver las primeras rutas sin tirar todo /etc",
    tldr: { page: "head" },
  },
  {
    term: "wc",
    definition:
      "Cuenta líneas, palabras y bytes de un archivo o de lo que llega por pipe. Sin opciones muestra las tres. -l = solo líneas, -w = palabras, -c = bytes. Sirve para verificar que un filtro (grep, etc.) dejó contenido.",
    example: "wc -l /root/lines → cuántas líneas tiene el archivo del lab de grep · grep ich /usr/share/dict/words | wc -l → cuenta sin guardar el archivo",
    tldr: { page: "wc" },
  },
  {
    term: "man",
    definition:
      "Abre la página del manual de un comando o de un archivo de configuración. El argumento es el nombre de la página. Adentro, /FRASE salta a ese texto y q cierra. Con un pipe el visor no se abre: el texto pasa al comando de la derecha, y grep deja solo las líneas de la frase.",
    example:
      "man dnf.conf | grep -E 'baseurl|gpgcheck|enabled' → solo las líneas de esas tres · man localectl → teclado de la consola · man nmcli → connection modify · man usermod | grep -- '-l' → renombrar el login · man auto.master → mapa de autofs · man tar → la letra de bzip2 · man chrony.conf → allow, pool, server · man grep → inicio de línea y palabra entera · man test → -d · man systemd.timer → OnCalendar y Persistent · man restorecon → aplicar el contexto · man flatpak-remote-add → LOCATION, --system, --user · man parted → mkpart · man podman-generate-systemd → la unidad del contenedor",
    tldr: { page: "man" },
  },
  {
    term: "grep",
    definition:
      "Filtra líneas. Imprime las que contienen el texto y descarta el resto. Lee un archivo (grep FRASE ARCHIVO) o lo que llega por un pipe (comando | grep FRASE). -E permite varias frases separadas por | dentro de las comillas: cada | es un «o». Sin -E, ese | es un carácter más. -i ignora mayúsculas. ^ al principio de la frase exige que la línea empiece así. -w exige la palabra entera.",
    example:
      "man dnf.conf | grep -E 'baseurl|gpgcheck|enabled' → de la página del manual, solo las líneas con una de esas tres · grep ich /usr/share/dict/words > /root/lines → palabras que contienen ich, guardadas en ese archivo · grep '^Listen' /etc/httpd/conf/httpd.conf → líneas que empiezan con Listen",
    tldr: { page: "grep" },
  },
  {
    term: "cp",
    definition:
      "Copia archivos o directorios. Orden: cp ORIGEN DESTINO. Primero lo que copiás, después a dónde. Si DESTINO es una carpeta que ya existe, el archivo entra adentro con el mismo nombre. Si DESTINO es una ruta con nombre de archivo, ahí queda con ese nombre (renombrás al copiar). -p conserva dueño/modo/fechas del origen (hace falta root para el dueño). --parents recrea la ruta del origen bajo el destino. No asigna un dueño nuevo: eso es chown después.",
    example:
      "cp /home/erik/foto.jpg /root/copia.jpg → origen /home/erik/foto.jpg, destino /root/copia.jpg (mismo contenido, otro nombre) · cp /home/erik/foto.jpg /root/erikfiles/ → entra en esa carpeta como foto.jpg · cp --parents -p /home/erik/a.txt /root/erikfiles → queda /root/erikfiles/home/erik/a.txt y conserva dueño",
    tldr: { page: "cp" },
  },
  {
    term: "umask",
    definition: "Máscara de permisos al crear archivos o directorios. Resta bits del permiso por defecto. Un umask alto deja menos permisos abiertos.",
    example: "umask 022 → archivos nuevos suelen quedar 644; umask → muestra la máscara actual",
    tldr: { page: "umask" },
  },
  {
    term: "ACL",
    definition:
      "Access Control List: permisos finos por usuario o grupo, además del dueño/grupo/otros del chmod. En el examen suelen pedirse con setfacl y getfacl. Los ejemplos de uso están en esas dos entradas.",
  },
  {
    term: "getfacl",
    definition: "Muestra las ACL de un archivo o directorio: user, group, other y mask. Sirve para verificar el lab, no solo el chmod.",
    example: "getfacl /var/tmp/fstab",
    tldr: { page: "getfacl", platform: "linux" },
  },
  {
    term: "setfacl",
    definition: "Pone o saca ACL. -m modifica, -x quita una entrada, -b borra todas las ACL extendidas.",
    example: "setfacl -m u:erik:rw /var/tmp/fstab",
    tldr: { page: "setfacl", platform: "linux" },
  },
  {
    term: "userdel",
    definition:
      "Borra un usuario. Con -r: cuenta + home + mail. Sin -r: el home queda. No borra crontab, archivos fuera del home, ACL en otros paths ni sudoers. Para limpiar todo en una VM de práctica hace falta más (crontab, find -nouser, carpetas de lab). El usuario no puede tener sesión abierta. En XFS el home no se recupera.",
    example: "userdel -r erik",
    tldr: { page: "userdel", platform: "linux" },
  },
  {
    term: "usermod",
    definition:
      "Modifica un usuario que ya existe. -aG suma un grupo secundario sin borrar los otros (sin -a, -G reemplaza toda la lista). -s cambia el shell. -l renombra el login. -g cambia el grupo primario. -d -m mueve el home.",
    example: "usermod -s /sbin/nologin diego · usermod -aG sysadm felipe",
    tldr: { page: "usermod", platform: "linux" },
  },
  {
    term: "groupdel",
    definition:
      "Borra un grupo. No puede ser el grupo primario de nadie: si falla, mirá getent group NOMBRE y cambiá el primario con usermod -g OTRO usuario, o borrá esos usuarios. Si el grupo solo era secundario (como sysadm en el lab), groupdel alcanza.",
    example: "groupdel sysadm",
    tldr: { page: "groupdel", platform: "linux" },
  },
  {
    term: "chmod",
    definition:
      "Cambia permisos de un archivo o directorio. En modo numérico: tres dígitos = dueño, grupo, otros. Cada dígito suma 4 lectura (r), 2 escritura (w), 1 ejecución/entrar (x). Un cuarto dígito al frente es bit especial (4 setuid, 2 setgid, 1 sticky). También acepta letras: u=dueño, g=grupo, o=otros, a=todos; + agrega, - saca, = fija.",
    example: "chmod 644 archivo · chmod 755 dir · chmod 2770 /shared/sysadm · chmod u+x script.sh · chmod g-w,o-rwx archivo",
    tldr: { page: "chmod" },
  },
  {
    term: "setuid",
    definition:
      "Bit especial 4 (el primer dígito de chmod). En un ejecutable, el proceso corre como el dueño del archivo (ejemplo clásico: passwd como root). En directorios casi no se usa. Se ve como s en el lugar de la x del dueño: rws---. Si es S mayúscula, el bit está pero falta la x del dueño.",
    example: "chmod 4755 /ruta/al/bin → 4 = setuid",
    tldr: { page: "chmod" },
  },
  {
    term: "setgid",
    definition:
      "Bit especial 2. En un directorio, los archivos y carpetas nuevos heredan el grupo dueño de esa carpeta (lab /shared/sysadm). En un ejecutable, el proceso corre con el grupo del archivo. Se ve como s en el grupo: drwxrws---. Si es S mayúscula, falta la x del grupo.",
    example: "chmod 2770 /shared/sysadm → 2 = setgid + 770",
    tldr: { page: "chmod" },
  },
  {
    term: "sticky",
    definition:
      "Bit especial 1. En un directorio escribible por varios (como /tmp), solo el dueño del archivo (o root) puede borrarlo. Se ve como t al final: drwxrwxrwt. Si es T mayúscula, el bit está pero falta la x de others. No es lo que pide el lab de setgid: ahí hace falta heredar el grupo, no proteger borrados.",
    example: "chmod 1777 /tmp → 1 = sticky + 777",
    tldr: { page: "chmod" },
  },
  {
    term: "bits especiales chmod",
    definition:
      "El primer dígito de chmod no es dueño/grupo/otros: es el bit especial. 4 setuid, 2 setgid, 1 sticky. Se pueden sumar (3 = setgid+sticky, 6 = setuid+setgid, 7 = los tres). Después van los tres dígitos normales (ej. 2770 = setgid + rwxrwx---).",
    example: "4 setuid · 2 setgid · 1 sticky",
  },
  {
    term: "LVM",
    definition:
      "Logical Volume Manager. Apila disco, grupo y volumen. Orden al crear: Physical Volume (PV), después Volume Group (VG), después Logical Volume (LV). El tamaño se cuenta en Physical Extent (PE). Encima del LV va el sistema de archivos (en el lab, ext4) y el montaje; eso ya no es LVM.",
    example: "disco extra → pvcreate → vgcreate wgroup → lvcreate wshare → mkfs.ext4 → montar /mnt/wshare",
  },
  {
    term: "Physical Volume (PV)",
    definition:
      "Volumen físico. Un disco o una partición marcados con pvcreate para que LVM los pueda usar. Todavía no tiene nombre de grupo ni de volumen. En el lab es el disco extra de 1 GB, no el disco que tiene / y /boot.",
    example: "pvcreate /dev/DISCO",
    tldr: { page: "pvcreate", platform: "linux" },
  },
  {
    term: "Volume Group (VG)",
    definition:
      "Grupo de volúmenes. Junta uno o más PV en un grupo con nombre. wgroup es el VG del lab. -s 8M fija el tamaño de cada PE de ese grupo.",
    example: "vgcreate -s 8M wgroup /dev/DISCO",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "Logical Volume (LV)",
    definition:
      "Volumen lógico. Se corta del VG. wshare es el LV del lab: 50 extents. El dispositivo queda en /dev/wgroup/wshare (VG/LV). -l pide extents, no megabytes.",
    example: "lvcreate -n wshare -l 50 wgroup → 50 × 8 MB = 400 MB",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "Physical Extent (PE)",
    definition:
      "Pedazo en el que se parte el VG. No es otro disco. En el lab cada PE mide 8 MB. 50 extents son 50 de esos pedazos (400 MB), no 50 MB.",
    example: "vgcreate -s 8M wgroup … → cada PE mide 8 MB · lvcreate -l 50 → usa 50 PE",
  },
  {
    term: "wgroup",
    definition:
      "El Volume Group de este lab. No es otro tipo de objeto: wgroup es el nombre del VG. vgcreate -s 8M lo crea y deja cada Physical Extent (PE) en 8 MB. El disco del sistema (el que tiene / y /boot) no entra acá.",
    example: "vgcreate -s 8M wgroup /dev/DISCO",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "wshare",
    definition:
      "El Logical Volume de este lab. Vive adentro de wgroup. -l 50 pide 50 extents, no 50 MB: 50 × 8 MB = 400 MB. El dispositivo es /dev/wgroup/wshare. Encima va ext4 y el punto de montaje /mnt/wshare.",
    example: "lvcreate -n wshare -l 50 wgroup",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "fstab",
    definition:
      "El archivo /etc/fstab. Ahí está escrito qué discos se montan al arrancar y dónde. Cada línea es un montaje, con seis campos en este orden: qué (UUID=…), dónde (/mnt/wshare), tipo (ext4, xfs o swap), opciones (defaults), dump (0) y el orden del chequeo (0 no chequea, 1 es la raíz, 2 el resto). Guardar el archivo no monta ahora: lo aplica el próximo boot. Para probarlo ya, mount -a. El UUID sale de blkid. No pongas /dev/sdX: ese nombre puede cambiar. La copia /var/tmp/fstab del lab de permisos es solo un archivo para practicar ACL: no monta nada.",
    example: "cat /etc/fstab · blkid /dev/wgroup/wshare · UUID=… /mnt/wshare ext4 defaults 0 0 · mount -a",
    tldr: { page: "fstab", platform: "linux" },
  },
  {
    term: "al boot",
    definition:
      "Que el montaje vuelva solo después de reiniciar. No es la partición /boot. En este lab es una línea de /etc/fstab con el UUID del LV (blkid /dev/wgroup/wshare), no con /dev/sdX, porque ese nombre puede cambiar. Sin esa línea el LV sigue existiendo, pero /mnt/wshare queda vacío al reiniciar.",
    example: "UUID=… /mnt/wshare ext4 defaults 0 0",
    tldr: { page: "fstab", platform: "linux" },
  },
  {
    term: "tuned",
    definition:
      "El paquete y el servicio. systemctl enable --now tuned lo arranca y lo deja para el próximo boot. Ese proceso es el que aplica el perfil. No es el comando: el comando es tuned-adm. Los dos vienen en el mismo paquete, no se instalan por separado.",
    example: "rpm -q tuned · systemctl enable --now tuned",
  },
  {
    term: "tuned-adm",
    definition:
      "El comando para hablarle al servicio tuned. recommend solo imprime un nombre y no lo guarda. profile NOMBRE lo aplica ahora y lo escribe en /etc/tuned/active_profile. active muestra el perfil que está puesto. Sin el servicio tuned corriendo, no tiene a quién aplicarle el perfil.",
    example: "tuned-adm recommend · tuned-adm profile NOMBRE · tuned-adm active",
    tldr: { page: "tuned-adm", platform: "linux" },
  },
  {
    term: "copiar y pegar",
    definition:
      "Hay tres portapapeles distintos y cada tecla habla con uno solo. Bash recorta la línea que estás escribiendo (Ctrl+K, Ctrl+U, Ctrl+W) y la devuelve con Ctrl+Y. La terminal del escritorio, la de la estación del examen, usa el del escritorio: Ctrl+Shift+C copia, Ctrl+Shift+V o Shift+Insert pegan; marcar con el botón izquierdo y pegar con el del medio usa ese mismo. Neovim guarda el suyo: yy o y copian, p pega, y el texto no sale del editor. En la consola pelada, sin escritorio, el del escritorio no existe.",
  },
  {
    term: "Ctrl+C",
    definition:
      "En la terminal manda una interrupción al comando que está corriendo. En un programa de escritorio, como el panel del enunciado o el navegador, copia el texto marcado. En el examen esa tecla sola a veces traba la terminal o el navegador. Para copiar desde la terminal del escritorio se usa Ctrl+Shift+C.",
  },
  {
    term: "Ctrl+V",
    definition:
      "En bash la próxima tecla se toma literal: no pega nada. En un programa de escritorio pega el portapapeles. En la terminal del escritorio pegar es Ctrl+Shift+V o Shift+Insert.",
  },
  {
    term: "Ctrl+Shift+C",
    definition:
      "Copia en la terminal del escritorio y deja el texto en el portapapeles del escritorio. El Shift deja Ctrl+C libre para interrumpir el comando. En la consola pelada esta combinación no existe.",
  },
  {
    term: "Ctrl+Shift+V",
    definition:
      "Pega en la terminal del escritorio el portapapeles del escritorio. Bash pega su recorte con Ctrl+Y. Neovim pega el suyo con p.",
  },
  {
    term: "Shift+Insert",
    definition:
      "Pega en la terminal del escritorio. Usa el mismo portapapeles que Ctrl+Shift+V.",
  },
  {
    term: "Ctrl+K",
    definition:
      "En bash corta desde el cursor hasta el final de la línea que estás escribiendo. Eso va al recorte de bash y vuelve con Ctrl+Y. El texto que ya se imprimió en la pantalla sigue ahí. En Neovim cortar una línea es dd.",
  },
  {
    term: "Ctrl+U",
    definition:
      "En bash corta desde el cursor hasta el principio de la línea que estás escribiendo. Vuelve con Ctrl+Y.",
  },
  {
    term: "Ctrl+W",
    definition:
      "En bash corta la palabra anterior de la línea que estás escribiendo. Vuelve con Ctrl+Y. En el navegador cierra la pestaña. En Neovim cortar es d o dd.",
  },
  {
    term: "Ctrl+Y",
    definition:
      "En bash pega lo último cortado de la línea con Ctrl+K, Ctrl+U o Ctrl+W. Alt+Y, justo después, cambia por un corte anterior. El portapapeles del escritorio se pega con Ctrl+Shift+V. Neovim pega con p.",
  },
  {
    term: "Alt+Y",
    definition:
      "En bash, después de un Ctrl+Y, cambia ese pegado por un corte anterior de la misma línea. Sigue siendo el recorte de bash.",
  },
  {
    term: "Ctrl+R",
    definition:
      "En bash busca para atrás en el historial de comandos. En Neovim, en modo inserción, Ctrl+R y después \" inserta lo que copiaste con y. La tecla es la misma y el programa decide cuál de las dos cosas hace.",
  },
  {
    term: "yy",
    definition:
      "En Neovim, modo normal, copia la línea del cursor y la deja en su lugar. p la pega debajo y P arriba, adentro de Neovim. dd corta esa línea: la copia y la borra. El portapapeles del escritorio es Ctrl+Shift+C.",
  },
  {
    term: "y (Neovim)",
    definition:
      "En Neovim, modo normal, copia sin borrar. yy copia la línea entera. Con v (caracteres) o V (la línea) marcado, y copia esa marca. p la pega adentro de Neovim.",
  },
  {
    term: "p (Neovim)",
    definition:
      "En Neovim, modo normal, pega debajo del cursor lo copiado con yy o y. P lo pega arriba. En bash el pegado de la línea es Ctrl+Y. En la terminal del escritorio es Ctrl+Shift+V.",
  },
  {
    term: "dd",
    definition:
      "En Neovim, modo normal, corta la línea: la copia y la borra. p la pega. yy copia esa línea y la deja escrita. En bash, cortar la línea que estás escribiendo es Ctrl+K o Ctrl+U.",
  },
  {
    term: "screen",
    definition:
      "Copia con el teclado texto que ya salió en la pantalla. No viene en una instalación mínima. Ctrl+A y después [ abre el modo copia, las flechas se mueven, Espacio marca el principio y otro Espacio el final, Ctrl+A y después ] pega. El recorte es de screen. Bash sigue pegando con Ctrl+Y.",
    tldr: { page: "screen" },
  },
];

const en: GlossaryEntry[] = [
  {
    term: "which",
    definition: "Prints the path of the executable the shell will run. It does not search random files: it looks up commands on PATH.",
    example: "which logger → /usr/bin/logger",
    tldr: { page: "which" },
  },
  {
    term: "rpm",
    definition:
      "Looks up packages that are already installed. rpm -ql PACKAGE lists the files it put on disk. Use it when the package does not ship a command: which will not find it. rpm -q PACKAGE only says whether it is installed and which version.",
    example: "rpm -ql words → the dictionary is /usr/share/dict/words. which words fails: words is not a command",
    tldr: { page: "rpm", platform: "linux" },
  },
  {
    term: "head",
    definition:
      "Shows only the first lines of a file or of what arrives on a pipe (10 by default). Use it for a preview without flooding the terminal. -n N changes how many lines.",
    example: "tar -tjf /root/myetcbackup.tar.bz2 | head → lists the backup and head shows the first paths without dumping all of /etc",
    tldr: { page: "head" },
  },
  {
    term: "wc",
    definition:
      "Counts lines, words, and bytes in a file or on a pipe. With no options it prints all three. -l = lines only, -w = words, -c = bytes. Handy to check that a filter (grep, etc.) left real content.",
    example: "wc -l /root/lines → how many lines the grep lab file has · grep ich /usr/share/dict/words | wc -l → count without saving the file",
    tldr: { page: "wc" },
  },
  {
    term: "man",
    definition:
      "Opens the manual page for a command or a configuration file. The argument is the page name. Inside, /PHRASE jumps to that text and q closes it. On a pipe the viewer does not open: the text goes to the command on the right, and grep keeps only the lines with the phrase.",
    example:
      "man dnf.conf | grep -E 'baseurl|gpgcheck|enabled' → only the lines for those three · man localectl → console keymap · man nmcli → connection modify · man usermod | grep -- '-l' → rename the login · man auto.master → autofs map · man tar → the bzip2 letter · man chrony.conf → allow, pool, server · man grep → start of line and whole word · man test → -d · man systemd.timer → OnCalendar and Persistent · man restorecon → apply the context · man flatpak-remote-add → LOCATION, --system, --user · man parted → mkpart · man podman-generate-systemd → the container unit",
    tldr: { page: "man" },
  },
  {
    term: "grep",
    definition:
      "Filters lines. It prints the ones that contain the text and drops the rest. It reads a file (grep PHRASE FILE) or whatever arrives on a pipe (command | grep PHRASE). -E allows several phrases split by | inside the quotes: each | is an \"or\". Without -E, that | is just another character. -i ignores case. ^ at the start of the phrase requires the line to begin that way. -w requires the whole word.",
    example:
      "man dnf.conf | grep -E 'baseurl|gpgcheck|enabled' → from the manual page, only the lines with one of those three · grep ich /usr/share/dict/words > /root/lines → words that contain ich, saved in that file · grep '^Listen' /etc/httpd/conf/httpd.conf → lines that start with Listen",
    tldr: { page: "grep" },
  },
  {
    term: "cp",
    definition:
      "Copies files or directories. Order: cp SOURCE DEST. First what you copy, then where. If DEST is an existing directory, the file goes inside with the same name. If DEST is a path with a file name, it lands there with that name (rename while copying). -p keeps owner/mode/timestamps from the source (root needed for ownership). --parents recreates the source path under the destination. It does not assign a new owner: that is chown afterwards.",
    example:
      "cp /home/erik/foto.jpg /root/copia.jpg → source /home/erik/foto.jpg, dest /root/copia.jpg (same content, new name) · cp /home/erik/foto.jpg /root/erikfiles/ → enters that folder as foto.jpg · cp --parents -p /home/erik/a.txt /root/erikfiles → becomes /root/erikfiles/home/erik/a.txt and keeps the owner",
    tldr: { page: "cp" },
  },
  {
    term: "umask",
    definition: "Permission mask when creating files or directories. It clears bits from the default mode. A higher umask leaves fewer open permissions.",
    example: "umask 022 → new files often end up 644; umask → shows the current mask",
    tldr: { page: "umask" },
  },
  {
    term: "ACL",
    definition:
      "Access Control List: fine-grained permissions per user or group, beyond owner/group/others from chmod. On the exam they usually ask for setfacl and getfacl. Usage examples live on those two entries.",
  },
  {
    term: "getfacl",
    definition: "Shows the ACLs on a file or directory: user, group, other, and mask. Use it to verify the lab, not only chmod.",
    example: "getfacl /var/tmp/fstab",
    tldr: { page: "getfacl", platform: "linux" },
  },
  {
    term: "setfacl",
    definition: "Sets or removes ACLs. -m modifies, -x removes one entry, -b clears all extended ACLs.",
    example: "setfacl -m u:erik:rw /var/tmp/fstab",
    tldr: { page: "setfacl", platform: "linux" },
  },
  {
    term: "userdel",
    definition:
      "Deletes a user. With -r: account + home + mail. Without -r: the home stays. Does not remove crontab, files outside the home, ACLs on other paths, or sudoers. To wipe everything on a practice VM you need more (crontab, find -nouser, lab folders). The user cannot have an open session. On XFS the home is gone.",
    example: "userdel -r erik",
    tldr: { page: "userdel", platform: "linux" },
  },
  {
    term: "usermod",
    definition:
      "Changes an existing user. -aG adds a secondary group without dropping the others (without -a, -G replaces the whole list). -s changes the shell. -l renames the login. -g changes the primary group. -d -m moves the home.",
    example: "usermod -s /sbin/nologin diego · usermod -aG sysadm felipe",
    tldr: { page: "usermod", platform: "linux" },
  },
  {
    term: "groupdel",
    definition:
      "Deletes a group. It cannot be anyone's primary group: if it fails, check getent group NAME and change the primary with usermod -g OTHER user, or delete those users. If the group was only secondary (like sysadm in the lab), groupdel is enough.",
    example: "groupdel sysadm",
    tldr: { page: "groupdel", platform: "linux" },
  },
  {
    term: "chmod",
    definition:
      "Changes permissions on a file or directory. Numeric mode: three digits = owner, group, others. Each digit adds 4 read (r), 2 write (w), 1 execute/enter (x). A leading fourth digit is the special bit (4 setuid, 2 setgid, 1 sticky). Letter form also works: u=owner, g=group, o=others, a=all; + adds, - removes, = sets.",
    example: "chmod 644 file · chmod 755 dir · chmod 2770 /shared/sysadm · chmod u+x script.sh · chmod g-w,o-rwx file",
    tldr: { page: "chmod" },
  },
  {
    term: "setuid",
    definition:
      "Special bit 4 (the first digit of chmod). On an executable, the process runs as the file's owner (classic example: passwd as root). Almost unused on directories. Shows as s in the owner's x place: rws---. A capital S means the bit is on but owner execute is missing.",
    example: "chmod 4755 /path/to/bin → 4 = setuid",
    tldr: { page: "chmod" },
  },
  {
    term: "setgid",
    definition:
      "Special bit 2. On a directory, new files and folders inherit that directory's owning group (lab /shared/sysadm). On an executable, the process runs as the file's group. Shows as s in the group: drwxrws---. A capital S means group execute is missing.",
    example: "chmod 2770 /shared/sysadm → 2 = setgid + 770",
    tldr: { page: "chmod" },
  },
  {
    term: "sticky",
    definition:
      "Special bit 1. On a directory writable by many (like /tmp), only the file's owner (or root) can delete it. Shows as t at the end: drwxrwxrwt. A capital T means the bit is on but others' execute is missing. Not what the setgid lab asks for: that one needs group inheritance, not delete protection.",
    example: "chmod 1777 /tmp → 1 = sticky + 777",
    tldr: { page: "chmod" },
  },
  {
    term: "special chmod bits",
    definition:
      "The first digit of chmod is not owner/group/others: it is the special bit. 4 setuid, 2 setgid, 1 sticky. They can be added (3 = setgid+sticky, 6 = setuid+setgid, 7 = all three). Then come the three normal digits (e.g. 2770 = setgid + rwxrwx---).",
    example: "4 setuid · 2 setgid · 1 sticky",
  },
  {
    term: "LVM",
    definition:
      "Logical Volume Manager. Stacks disk, group, and volume. Create order: Physical Volume (PV), then Volume Group (VG), then Logical Volume (LV). Size is counted in Physical Extents (PE). The filesystem (ext4 in the lab) and the mount sit on top of the LV; that part is no longer LVM.",
    example: "extra disk → pvcreate → vgcreate wgroup → lvcreate wshare → mkfs.ext4 → mount /mnt/wshare",
  },
  {
    term: "Physical Volume (PV)",
    definition:
      "A disk or partition marked with pvcreate so LVM can use it. It does not have a group or volume name yet. In the lab it is the extra 1 GB disk, not the disk that has / and /boot.",
    example: "pvcreate /dev/DISCO",
    tldr: { page: "pvcreate", platform: "linux" },
  },
  {
    term: "Volume Group (VG)",
    definition:
      "A named pool of one or more PVs. wgroup is the lab VG. -s 8M sets the size of each PE in that group.",
    example: "vgcreate -s 8M wgroup /dev/DISCO",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "Logical Volume (LV)",
    definition:
      "A slice cut from the VG. wshare is the lab LV: 50 extents. The device is /dev/wgroup/wshare (VG/LV). -l asks for extents, not megabytes.",
    example: "lvcreate -n wshare -l 50 wgroup → 50 × 8 MB = 400 MB",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "Physical Extent (PE)",
    definition:
      "The chunk the VG is split into. It is not another disk. In the lab each PE is 8 MB. 50 extents are 50 of those chunks (400 MB), not 50 MB.",
    example: "vgcreate -s 8M wgroup … → each PE is 8 MB · lvcreate -l 50 → uses 50 PE",
  },
  {
    term: "wgroup",
    definition:
      "This lab's Volume Group. It is not a different kind of object: wgroup is the VG's name. vgcreate -s 8M creates it and sets each Physical Extent (PE) to 8 MB. The system disk (the one with / and /boot) does not go here.",
    example: "vgcreate -s 8M wgroup /dev/DISCO",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "wshare",
    definition:
      "This lab's Logical Volume. It lives inside wgroup. -l 50 asks for 50 extents, not 50 MB: 50 × 8 MB = 400 MB. The device is /dev/wgroup/wshare. ext4 and the mount point /mnt/wshare go on top of it.",
    example: "lvcreate -n wshare -l 50 wgroup",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "fstab",
    definition:
      "The file /etc/fstab. It says which disks get mounted at boot and where. Each line is one mount, with six fields in this order: what (UUID=…), where (/mnt/wshare), type (ext4, xfs, or swap), options (defaults), dump (0), and the check order (0 skips the check, 1 is the root, 2 is the rest). Saving the file does not mount now: the next boot applies it. To try it immediately, mount -a. The UUID comes from blkid. Do not write /dev/sdX: that name can change. The /var/tmp/fstab copy in the permissions lab is only a file for ACL practice: it mounts nothing.",
    example: "cat /etc/fstab · blkid /dev/wgroup/wshare · UUID=… /mnt/wshare ext4 defaults 0 0 · mount -a",
    tldr: { page: "fstab", platform: "linux" },
  },
  {
    term: "al boot",
    definition:
      "The mount comes back by itself after a reboot. It is not the /boot partition. In this lab it is an /etc/fstab line with the LV's UUID (blkid /dev/wgroup/wshare), not /dev/sdX, because that name can change. Without that line the LV still exists, but /mnt/wshare is empty after reboot.",
    example: "UUID=… /mnt/wshare ext4 defaults 0 0",
    tldr: { page: "fstab", platform: "linux" },
  },
  {
    term: "tuned",
    definition:
      "The package and the service. systemctl enable --now tuned starts it and leaves it for the next boot. That process is what applies the profile. It is not the command: the command is tuned-adm. Both come in the same package. They are not installed separately.",
    example: "rpm -q tuned · systemctl enable --now tuned",
  },
  {
    term: "tuned-adm",
    definition:
      "The command that talks to the tuned service. recommend only prints a name and does not save it. profile NAME applies it now and writes it to /etc/tuned/active_profile. active shows the profile that is set. Without the tuned service running, there is nobody to apply the profile to.",
    example: "tuned-adm recommend · tuned-adm profile NAME · tuned-adm active",
    tldr: { page: "tuned-adm", platform: "linux" },
  },
  {
    term: "copy and paste",
    definition:
      "There are three clipboards, and each key talks to only one. Bash cuts the line you are typing (Ctrl+K, Ctrl+U, Ctrl+W) and puts it back with Ctrl+Y. The desktop terminal, the one on the exam workstation, uses the desktop clipboard: Ctrl+Shift+C copies, Ctrl+Shift+V or Shift+Insert pastes; selecting with the left button and pasting with the middle button uses that same one. Neovim keeps its own: yy or y copy, p pastes, and the text stays inside the editor. On a bare console, with no desktop, the desktop clipboard does not exist.",
  },
  {
    term: "Ctrl+C",
    definition:
      "In the terminal it interrupts the command that is running. In a desktop program, such as the task panel or the browser, it copies the selected text. On the exam that key alone can freeze the terminal or the browser. Copying from the desktop terminal is Ctrl+Shift+C.",
  },
  {
    term: "Ctrl+V",
    definition:
      "In bash the next key is taken literally: it pastes nothing. In a desktop program it pastes the clipboard. In the desktop terminal, paste is Ctrl+Shift+V or Shift+Insert.",
  },
  {
    term: "Ctrl+Shift+C",
    definition:
      "Copies in the desktop terminal and puts the text on the desktop clipboard. Shift leaves Ctrl+C free to interrupt the command. On a bare console this combination does not exist.",
  },
  {
    term: "Ctrl+Shift+V",
    definition:
      "Pastes the desktop clipboard into the desktop terminal. Bash pastes its own cut with Ctrl+Y. Neovim pastes its own with p.",
  },
  {
    term: "Shift+Insert",
    definition:
      "Pastes in the desktop terminal. It uses the same clipboard as Ctrl+Shift+V.",
  },
  {
    term: "Ctrl+K",
    definition:
      "In bash it cuts from the cursor to the end of the line you are typing. That goes to bash's cut buffer and comes back with Ctrl+Y. Text already printed on the screen stays there. In Neovim, cutting a line is dd.",
  },
  {
    term: "Ctrl+U",
    definition:
      "In bash it cuts from the cursor to the start of the line you are typing. It comes back with Ctrl+Y.",
  },
  {
    term: "Ctrl+W",
    definition:
      "In bash it cuts the previous word of the line you are typing. It comes back with Ctrl+Y. In the browser it closes the tab. In Neovim, cutting is d or dd.",
  },
  {
    term: "Ctrl+Y",
    definition:
      "In bash it pastes the last piece cut from the line with Ctrl+K, Ctrl+U, or Ctrl+W. Alt+Y, right after that, swaps in an older cut. The desktop clipboard pastes with Ctrl+Shift+V. Neovim pastes with p.",
  },
  {
    term: "Alt+Y",
    definition:
      "In bash, after a Ctrl+Y, it swaps that paste for an older cut from the same line. It is still bash's cut buffer.",
  },
  {
    term: "Ctrl+R",
    definition:
      "In bash it searches backward through command history. In Neovim insert mode, Ctrl+R then \" inserts what you copied with y. The key is the same and the program decides which of the two it does.",
  },
  {
    term: "yy",
    definition:
      "In Neovim normal mode it copies the cursor's line and leaves it in place. p pastes it below and P pastes it above, inside Neovim. dd cuts that line: it copies and deletes it. The desktop clipboard is Ctrl+Shift+C.",
  },
  {
    term: "y (Neovim)",
    definition:
      "In Neovim normal mode it copies without deleting. yy copies the whole line. After v (characters) or V (the line), y copies that selection. p pastes it inside Neovim.",
  },
  {
    term: "p (Neovim)",
    definition:
      "In Neovim normal mode it pastes below the cursor what you copied with yy or y. P pastes it above. In bash, pasting the line is Ctrl+Y. In the desktop terminal it is Ctrl+Shift+V.",
  },
  {
    term: "dd",
    definition:
      "In Neovim normal mode it cuts the line: it copies and deletes it. p pastes it. yy copies that line and leaves it written. In bash, cutting the line you are typing is Ctrl+K or Ctrl+U.",
  },
  {
    term: "screen",
    definition:
      "Copies, with the keyboard, text that has already been printed on the screen. It is not part of a minimal install. Ctrl+A then [ opens copy mode, the arrows move, Space marks the start and Space again marks the end, Ctrl+A then ] pastes. The buffer belongs to screen. Bash still pastes with Ctrl+Y.",
    tldr: { page: "screen" },
  },
];

export function glossaryFor(locale: Locale): GlossaryEntry[] {
  return locale === "en" ? en : es;
}
