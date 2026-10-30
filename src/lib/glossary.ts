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
  {
    term: "ls",
    definition:
      "Lista lo que hay en una carpeta. Sin opciones, solo nombres. -l es el listado largo: permisos, dueño, grupo y tamaño. -a incluye los que empiezan con punto. -n muestra UID y GID en número. -d no entra: muestra la carpeta misma. -Z agrega el contexto de SELinux.",
    example: "ls -lan → largo, ocultos, UID y GID numéricos · ls -ld /shared/sysadm → la carpeta, no el contenido · ls -Zd RUTA → el contexto de esa carpeta",
    tldr: { page: "ls" },
  },
  {
    term: "ls -lan",
    definition:
      "Listado largo, con ocultos, y el dueño y el grupo en número. -l es largo, -a incluye . y .., -n cambia el nombre del dueño y del grupo por el UID y el GID. Sirve cuando el nombre no alcanza para ver de quién es el archivo.",
    example: "ls -lan /home/thiago",
    tldr: { page: "ls" },
  },
  {
    term: "ls -ld",
    definition:
      "Muestra la carpeta misma, no lo que tiene adentro. Sin -d, ls entra y lista el contenido. Con -l se lee el setgid: drwxrws--- tiene la s en el lugar de la x del grupo.",
    example: "ls -ld /shared/sysadm",
    tldr: { page: "ls" },
  },
  {
    term: "ls -Zd",
    definition:
      "Muestra el contexto de SELinux de la carpeta misma. -Z es el contexto y -d no entra adentro. Sin -d, -Z lista el contexto de cada archivo de adentro.",
    example: "ls -Zd /srv/company-drop",
    tldr: { page: "ls" },
  },
  {
    term: "cd",
    definition: "Cambia de carpeta. Sin argumento va al home de quien está logueado. cd - vuelve a la carpeta anterior.",
    example: "cd /etc/yum.repos.d/ && ls",
    tldr: { page: "cd" },
  },
  {
    term: "cat",
    definition: "Imprime un archivo entero en la terminal. No pagina: si es largo, se va para arriba. Para mirar una parte, head o grep.",
    example: "cat /etc/vconsole.conf",
    tldr: { page: "cat" },
  },
  {
    term: "echo",
    definition: "Imprime el texto que le pasás. Con >> lo agrega al final de un archivo. Con > lo pisa. Dentro de comillas simples el shell no toca el texto.",
    example: "echo prueba >> /var/tmp/fstab",
    tldr: { page: "echo" },
  },
  {
    term: "mkdir",
    definition: "Crea una carpeta. -p crea también las de arriba si no existen y no se queja si la última ya está. Sin -p, una ruta con un padre que no existe falla.",
    example: "mkdir -p /shared/sysadm",
    tldr: { page: "mkdir" },
  },
  {
    term: "touch",
    definition: "Crea un archivo vacío si no existe. Si existe, le actualiza la fecha. También sirve para dejar un archivo vacío que otro programa va a leer, como /.autorelabel.",
    example: "touch /.autorelabel",
    tldr: { page: "touch" },
  },
  {
    term: "id",
    definition: "Muestra UID, grupo primario y grupos secundarios de un usuario. Sin argumento, los de quien está en el prompt. Sirve para comprobar un useradd o un usermod -aG.",
    example: "id thiago",
    tldr: { page: "id" },
  },
  {
    term: "useradd",
    definition:
      "Crea un usuario. -m crea el home. -u fija el UID. -g es el grupo primario. -G suma grupos secundarios en el alta. La contraseña no se pone acá: después va passwd.",
    example: "useradd -m -G developer thiago",
    tldr: { page: "useradd", platform: "linux" },
  },
  {
    term: "groupadd",
    definition: "Crea un grupo. El usuario se suma después con useradd -G o con usermod -aG. groupadd no mete a nadie adentro.",
    example: "groupadd developer",
    tldr: { page: "groupadd", platform: "linux" },
  },
  {
    term: "passwd",
    definition: "Cambia la contraseña. Sin argumento, la de quien está logueado: la pide dos veces. passwd USUARIO, como root, cambia la de esa cuenta. No crea el usuario.",
    example: "passwd thiago",
    tldr: { page: "passwd" },
  },
  {
    term: "chown",
    definition: "Cambia dueño y grupo de un archivo. Dueño y grupo van juntos: USUARIO:GRUPO. -R baja por la carpeta. No pone permisos: eso es chmod.",
    example: "chown erik:erik /var/tmp/fstab",
    tldr: { page: "chown" },
  },
  {
    term: "getent",
    definition: "Lee una base del sistema: passwd, group o shadow. Muestra la línea de esa cuenta, venga de un archivo local o de otra fuente. getent group NOMBRE dice si el grupo existe y quién está.",
    example: "getent passwd thiago · getent group developer",
    tldr: { page: "getent" },
  },
  {
    term: "su -",
    definition:
      "Abre un login de ese usuario: carga su home y su entorno. El guion no se saca. su USUARIO sin guion no es un login. su - -c 'COMANDO' corre eso y vuelve. Para probar un permiso, el comando tiene que ir adentro de las comillas.",
    example: "su - felipe · su - erik -c 'echo prueba >> /var/tmp/fstab'",
    tldr: { page: "su" },
  },
  {
    term: "dnf",
    definition:
      "Instala y consulta paquetes. repolist muestra los repos enabled. install -y instala sin preguntar. --repo= limita a esos repos. provides RUTA dice qué paquete trae ese archivo. clean all tira la caché. list available lista lo que se puede instalar.",
    example: "dnf repolist · dnf install -y --repo=BaseOS --repo=AppStream words · dnf provides /usr/sbin/semanage",
    tldr: { page: "dnf", platform: "linux" },
  },
  {
    term: "find",
    definition:
      "Busca archivos por nombre, dueño, tipo o fecha. -user es el dueño, -type f es archivo, -mtime -1 es el último día. -exec COMANDO {} \\; corre ese comando con cada resultado. 2>/dev/null esconde los Permission denied.",
    example: "find / -user erik -mtime -1 -type f",
    tldr: { page: "find" },
  },
  {
    term: "tar",
    definition:
      "Empaqueta o lista un tar. -c crea, -t lista, -x extrae. -j es bzip2, -z es gzip, -f es el archivo. El orden que se usa acá es la letra de la acción, después la del compresor y -f al final, pegado al nombre.",
    example: "tar -tjf /root/myetcbackup.tar.bz2 | head",
    tldr: { page: "tar" },
  },
  {
    term: "systemctl",
    definition:
      "Maneja unidades de systemd. status no cambia nada. start y stop son de ahora. enable lo deja para el próximo boot y disable lo saca. enable --now arranca ya y lo deja para el boot. restart vuelve a leer la configuración.",
    example: "systemctl enable --now httpd · systemctl status httpd",
    tldr: { page: "systemctl", platform: "linux" },
  },
  {
    term: "journalctl",
    definition: "Lee el diario de systemd. -u UNIDAD deja solo ese servicio. -b es este boot. -f sigue las líneas nuevas. No reemplaza a ausearch: el de SELinux es otro registro.",
    example: "journalctl -u httpd -b",
    tldr: { page: "journalctl", platform: "linux" },
  },
  {
    term: "hostnamectl",
    definition: "Muestra o cambia el hostname. set-hostname lo cambia ya y lo guarda. No es un perfil de red: no hace falta nmcli connection up. status, o hostnamectl solo, muestra el nombre actual.",
    example: "hostnamectl set-hostname client.rhcsa.lab",
    tldr: { page: "hostnamectl", platform: "linux" },
  },
  {
    term: "localectl",
    definition:
      "Teclado de la consola y del gráfico. status muestra VC Keymap y X11 Layout. set-keymap es la consola. set-x11-keymap es el gráfico. list-keymaps y list-x11-keymap-layouts son las listas. No cambia lo que escribís en una SSH.",
    example: "localectl status · localectl list-keymaps",
    tldr: { page: "localectl", platform: "linux" },
  },
  {
    term: "loginctl",
    definition: "Lista sesiones de login. Sirve para ver si un usuario sigue adentro antes de borrarlo: userdel no puede con una sesión abierta.",
    example: "loginctl list-sessions",
    tldr: { page: "loginctl", platform: "linux" },
  },
  {
    term: "reboot",
    definition: "Reinicia. En un arranque normal alcanza reboot. Si bash quedó como proceso 1, hace falta exec /sbin/reboot -f: sin -f el kernel entra en panic.",
    example: "reboot · exec /sbin/reboot -f",
    tldr: { page: "reboot" },
  },
  {
    term: "mount",
    definition:
      "Muestra o monta sistemas de archivos. Sin argumentos, lista lo que está montado. -o remount,rw vuelve a montar escribible una raíz que arrancó solo lectura. El punto de montaje es el último argumento.",
    example: "mount -o remount,rw / · mount -o remount,rw /sysroot",
    tldr: { page: "mount" },
  },
  {
    term: "nmcli",
    definition:
      "Configura NetworkManager desde la terminal. connection show lista perfiles: NAME es el nombre que va en modify, DEVICE es la placa. connection modify guarda IP, gateway y DNS. connection up aplica ahora. -f muestra un solo campo. ip a no muestra el DNS.",
    example: "nmcli connection show · nmcli -f ipv4.dns connection show hostonly · nmcli connection up hostonly",
    tldr: { page: "nmcli", platform: "linux" },
  },
  {
    term: "ip",
    definition: "Mira la red. ip -br a es la lista corta de placas y direcciones. ip a es la misma, más larga. No cambia el perfil: eso es nmcli. lo es la máquina consigo misma y no se edita.",
    example: "ip -br a",
    tldr: { page: "ip" },
  },
  {
    term: "curl",
    definition: "Pide una URL y muestra la respuesta. -I pide solo las cabeceras. Sirve para ver si un puerto o un servicio responde, sin abrir el navegador.",
    example: "curl -I http://127.0.0.1:82/",
    tldr: { page: "curl" },
  },
  {
    term: "firewall-cmd",
    definition:
      "Abre o cierra puertos en firewalld. --add-port=PUERTO/tcp abre. --permanent lo guarda. Sin --permanent, al reboot se pierde. --reload aplica ahora lo que quedó guardado. Hasta el reload, lo permanente no entra.",
    example: "firewall-cmd --add-port=82/tcp --permanent && firewall-cmd --reload",
    tldr: { page: "firewall-cmd", platform: "linux" },
  },
  {
    term: "getenforce",
    definition: "Dice el modo de SELinux ahora: Enforcing, Permissive o Disabled. No lo cambia. Enforcing bloquea. Permissive avisa y deja pasar.",
    example: "getenforce",
    tldr: { page: "getenforce", platform: "linux" },
  },
  {
    term: "semanage",
    definition:
      "Cambia la política de SELinux y lo guarda. port -l lista puertos etiquetados. port -a -t TIPO -p tcp PUERTO agrega uno. fcontext anota el contexto de una ruta para después de restorecon. No viene en una mínima: el paquete es policycoreutils-python-utils.",
    example: "semanage port -l | grep http · semanage port -a -t http_port_t -p tcp 82",
    tldr: { page: "semanage", platform: "linux" },
  },
  {
    term: "restorecon",
    definition: "Aplica a los archivos el contexto que la política ya tiene anotado. -v avisa si reetiquetó. No inventa una etiqueta nueva: si falta la regla, primero va semanage fcontext.",
    example: "restorecon -v /etc/NetworkManager/system-connections/hostonly.nmconnection",
    tldr: { page: "restorecon", platform: "linux" },
  },
  {
    term: "getsebool",
    definition: "Muestra un booleano de SELinux. -a lista todos. No lo cambia: eso es setsebool. on permite, off no.",
    example: "getsebool -a | grep ftp",
    tldr: { page: "getsebool", platform: "linux" },
  },
  {
    term: "ausearch",
    definition: "Busca en el registro de auditoría. -m avc deja los bloqueos de SELinux. -ts recent es lo de recién. No es journalctl: el AVC de SELinux está acá.",
    example: "ausearch -m avc -ts recent",
    tldr: { page: "ausearch", platform: "linux" },
  },
  {
    term: "podman",
    definition:
      "Corre contenedores sin un demonio. run crea y arranca. -d lo deja atrás. --name le pone nombre. -v ORIGEN:DESTINO:Z monta una carpeta y la Z ajusta el contexto. generate systemd escribe la unidad para que systemd lo levante.",
    example: "podman run -d --name mycontainer localhost/text2pdf:latest · man podman-generate-systemd",
    tldr: { page: "podman", platform: "linux" },
  },
  {
    term: "flatpak",
    definition:
      "Instala aplicaciones aparte de dnf. remote-add agrega un origen. install baja una app. --user es de esa cuenta, --system es de la máquina. list muestra lo instalado. uninstall saca una. El remote de sistema no le aparece a otro usuario cuando usa --user.",
    example: "flatpak list · flatpak install --user -y NOMBRE APP · man flatpak-remote-add",
    tldr: { page: "flatpak", platform: "linux" },
  },
  {
    term: "lsblk",
    definition: "Lista discos y particiones en árbol. -f agrega el sistema de archivos y el UUID. El disco que tiene / y /boot no se reparte de nuevo.",
    example: "lsblk -f",
    tldr: { page: "lsblk", platform: "linux" },
  },
  {
    term: "blkid",
    definition: "Muestra UUID y tipo de un dispositivo. Ese UUID es el que va en fstab si la línea no usa el nombre /dev, que puede cambiar de orden.",
    example: "blkid /dev/sdb1",
    tldr: { page: "blkid", platform: "linux" },
  },
  {
    term: "parted",
    definition: "Reparte un disco. mklabel escribe la tabla. mkpart crea una partición. La unidad va en el número: 400MiB no es 400MB. El disco de / no se toca.",
    example: "parted /dev/sdb --script mklabel gpt mkpart primary 1MiB 401MiB",
    tldr: { page: "parted", platform: "linux" },
  },
  {
    term: "pvcreate",
    definition: "Marca una partición como Physical Volume para LVM. No crea el grupo ni el volumen lógico: eso es vgcreate y lvcreate. Antes tiene que existir la partición.",
    example: "pvcreate /dev/sdb1",
    tldr: { page: "pvcreate", platform: "linux" },
  },
  {
    term: "vgcreate",
    definition: "Crea un Volume Group con uno o más PV. El primer argumento es el nombre del grupo. El resto son los discos.",
    example: "vgcreate wgroup /dev/sdb1",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "lvcreate",
    definition: "Crea un Logical Volume dentro de un VG. -n es el nombre. -L es el tamaño. El último argumento es el grupo.",
    example: "lvcreate -n wshare -L 400M wgroup",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "lvs",
    definition: "Lista Logical Volumes. No cambia nada. Ahí se lee el tamaño y el grupo antes de un lvresize.",
    example: "lvs",
    tldr: { page: "lvs", platform: "linux" },
  },
  {
    term: "vgs",
    definition: "Lista Volume Groups y cuánto espacio libre les queda. No cambia nada.",
    example: "vgs",
    tldr: { page: "vgs", platform: "linux" },
  },
  {
    term: "mkfs.ext4",
    definition: "Formatea un volumen en ext4. El argumento es el dispositivo, no el punto de montaje. Formatear borra lo que había.",
    example: "mkfs.ext4 /dev/wgroup/wshare",
    tldr: { page: "mkfs.ext4", platform: "linux" },
  },
  {
    term: "mkswap",
    definition: "Marca una partición como swap. No la activa: eso es swapon. Después la línea va en fstab para que vuelva sola.",
    example: "mkswap /dev/sdb2",
    tldr: { page: "mkswap", platform: "linux" },
  },
  {
    term: "swapon",
    definition: "Activa un swap ya marcado con mkswap. swapon --show lista los que están activos. Sin la línea en fstab, al reboot no vuelve.",
    example: "swapon /dev/sdb2 · swapon --show",
    tldr: { page: "swapon", platform: "linux" },
  },
  {
    term: "crontab",
    definition: "Edita o lista la tabla de tareas de un usuario. -l lista, -e edita, -r borra. -u USUARIO, como root, es la tabla de esa cuenta. No es el timer de systemd.",
    example: "crontab -l -u erik",
    tldr: { page: "crontab" },
  },
  {
    term: "exportfs",
    definition: "Publica o revisa lo que NFS está exportando. -v lista con las opciones. -r vuelve a leer /etc/exports. No alcanza con editar el archivo: hay que publicarlo.",
    example: "exportfs -v · exportfs -r",
    tldr: { page: "exportfs", platform: "linux" },
  },
  {
    term: "showmount",
    definition: "Pregunta a un servidor NFS qué exporta. -e HOST lista las exportaciones. Sirve para comprobar desde el cliente, sin montar todavía.",
    example: "showmount -e server",
    tldr: { page: "showmount", platform: "linux" },
  },
  {
    term: "sed",
    definition:
      "Edita texto por línea. -i cambia el archivo. Sin -i, solo imprime. La s cambia la primera coincidencia de cada línea. ^ exige el principio de la línea. No es set: set es otra orden de bash.",
    example: "sed -i 's/^Listen 80$/Listen 82/' /etc/httpd/conf/httpd.conf",
    tldr: { page: "sed" },
  },
  {
    term: "visudo",
    definition: "Abre sudoers y no lo guarda si la sintaxis está mal. Es el editor seguro. No se edita /etc/sudoers con vim directo: un error te deja sin sudo.",
    example: "visudo",
    tldr: { page: "visudo", platform: "linux" },
  },
  {
    term: "chroot",
    definition: "Entra a otro árbol de directorios y lo toma como /. En el rescate con rd.break, chroot /sysroot entra al sistema real. exit sale de ahí.",
    example: "chroot /sysroot",
    tldr: { page: "chroot" },
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
  {
    term: "ls",
    definition:
      "Lists what is in a directory. With no options, names only. -l is the long list: mode, owner, group, and size. -a includes names that start with a dot. -n prints UID and GID as numbers. -d does not enter: it shows the directory itself. -Z adds the SELinux context.",
    example: "ls -lan → long, hidden, numeric UID and GID · ls -ld /shared/sysadm → the directory, not its contents · ls -Zd PATH → that directory's context",
    tldr: { page: "ls" },
  },
  {
    term: "ls -lan",
    definition:
      "Long listing, including hidden names, with owner and group as numbers. -l is long, -a includes . and .., -n replaces the owner and group names with the UID and the GID. Use it when the name is not enough to see who owns the file.",
    example: "ls -lan /home/thiago",
    tldr: { page: "ls" },
  },
  {
    term: "ls -ld",
    definition:
      "Shows the directory itself, not what is inside. Without -d, ls enters and lists the contents. With -l you can read setgid: drwxrws--- has s in the group's execute slot.",
    example: "ls -ld /shared/sysadm",
    tldr: { page: "ls" },
  },
  {
    term: "ls -Zd",
    definition:
      "Shows the SELinux context of the directory itself. -Z is the context and -d does not enter. Without -d, -Z lists the context of each file inside.",
    example: "ls -Zd /srv/company-drop",
    tldr: { page: "ls" },
  },
  {
    term: "cd",
    definition: "Changes directory. With no argument it goes to the home of whoever is logged in. cd - returns to the previous directory.",
    example: "cd /etc/yum.repos.d/ && ls",
    tldr: { page: "cd" },
  },
  {
    term: "cat",
    definition: "Prints a whole file on the terminal. It does not page: a long file scrolls away. To see a piece, use head or grep.",
    example: "cat /etc/vconsole.conf",
    tldr: { page: "cat" },
  },
  {
    term: "echo",
    definition: "Prints the text you give it. >> appends that text to a file. > overwrites the file. Inside single quotes the shell does not touch the text.",
    example: "echo prueba >> /var/tmp/fstab",
    tldr: { page: "echo" },
  },
  {
    term: "mkdir",
    definition: "Creates a directory. -p also creates parents that are missing and stays quiet if the last one already exists. Without -p, a path whose parent is missing fails.",
    example: "mkdir -p /shared/sysadm",
    tldr: { page: "mkdir" },
  },
  {
    term: "touch",
    definition: "Creates an empty file if it does not exist. If it exists, it updates the timestamp. Also used to leave an empty file another program will read, such as /.autorelabel.",
    example: "touch /.autorelabel",
    tldr: { page: "touch" },
  },
  {
    term: "id",
    definition: "Shows the UID, primary group, and secondary groups of a user. With no argument, those of whoever is at the prompt. Use it to check a useradd or a usermod -aG.",
    example: "id thiago",
    tldr: { page: "id" },
  },
  {
    term: "useradd",
    definition:
      "Creates a user. -m creates the home. -u sets the UID. -g is the primary group. -G adds secondary groups at creation. The password is not set here: passwd comes after.",
    example: "useradd -m -G developer thiago",
    tldr: { page: "useradd", platform: "linux" },
  },
  {
    term: "groupadd",
    definition: "Creates a group. The user is added later with useradd -G or usermod -aG. groupadd does not put anyone in the group.",
    example: "groupadd developer",
    tldr: { page: "groupadd", platform: "linux" },
  },
  {
    term: "passwd",
    definition: "Changes a password. With no argument, the password of whoever is logged in: it asks twice. passwd USER, as root, changes that account. It does not create the user.",
    example: "passwd thiago",
    tldr: { page: "passwd" },
  },
  {
    term: "chown",
    definition: "Changes the owner and group of a file. Owner and group go together: USER:GROUP. -R walks down the directory. It does not set mode: that is chmod.",
    example: "chown erik:erik /var/tmp/fstab",
    tldr: { page: "chown" },
  },
  {
    term: "getent",
    definition: "Reads a system database: passwd, group, or shadow. It prints that account's line, from a local file or from another source. getent group NAME says whether the group exists and who is in it.",
    example: "getent passwd thiago · getent group developer",
    tldr: { page: "getent" },
  },
  {
    term: "su -",
    definition:
      "Opens a login as that user: it loads their home and their environment. Do not drop the dash. su USER without the dash is not a login. su - -c 'COMMAND' runs that and returns. To test a permission, the command has to stay inside the quotes.",
    example: "su - felipe · su - erik -c 'echo prueba >> /var/tmp/fstab'",
    tldr: { page: "su" },
  },
  {
    term: "dnf",
    definition:
      "Installs and looks up packages. repolist shows enabled repos. install -y installs without asking. --repo= limits the search to those repos. provides PATH says which package ships that file. clean all drops the cache. list available lists what can be installed.",
    example: "dnf repolist · dnf install -y --repo=BaseOS --repo=AppStream words · dnf provides /usr/sbin/semanage",
    tldr: { page: "dnf", platform: "linux" },
  },
  {
    term: "find",
    definition:
      "Finds files by name, owner, type, or age. -user is the owner, -type f is a file, -mtime -1 is the last day. -exec COMMAND {} \\; runs that command on each result. 2>/dev/null hides Permission denied.",
    example: "find / -user erik -mtime -1 -type f",
    tldr: { page: "find" },
  },
  {
    term: "tar",
    definition:
      "Packs or lists a tar archive. -c creates, -t lists, -x extracts. -j is bzip2, -z is gzip, -f is the file. The order used here is the action letter, then the compressor, and -f at the end, next to the name.",
    example: "tar -tjf /root/myetcbackup.tar.bz2 | head",
    tldr: { page: "tar" },
  },
  {
    term: "systemctl",
    definition:
      "Manages systemd units. status changes nothing. start and stop are for now. enable leaves it for the next boot and disable removes that. enable --now starts it now and leaves it for boot. restart makes it read the configuration again.",
    example: "systemctl enable --now httpd · systemctl status httpd",
    tldr: { page: "systemctl", platform: "linux" },
  },
  {
    term: "journalctl",
    definition: "Reads the systemd journal. -u UNIT keeps only that service. -b is this boot. -f follows new lines. It does not replace ausearch: SELinux denials are a different log.",
    example: "journalctl -u httpd -b",
    tldr: { page: "journalctl", platform: "linux" },
  },
  {
    term: "hostnamectl",
    definition: "Shows or changes the hostname. set-hostname changes it now and saves it. It is not a network profile: nmcli connection up is not required. status, or hostnamectl alone, shows the current name.",
    example: "hostnamectl set-hostname client.rhcsa.lab",
    tldr: { page: "hostnamectl", platform: "linux" },
  },
  {
    term: "localectl",
    definition:
      "Console and graphical keymap. status shows VC Keymap and X11 Layout. set-keymap is the console. set-x11-keymap is the graphical one. list-keymaps and list-x11-keymap-layouts are the lists. It does not change what you type over SSH.",
    example: "localectl status · localectl list-keymaps",
    tldr: { page: "localectl", platform: "linux" },
  },
  {
    term: "loginctl",
    definition: "Lists login sessions. Use it to see whether a user is still logged in before deleting them: userdel cannot remove an open session.",
    example: "loginctl list-sessions",
    tldr: { page: "loginctl", platform: "linux" },
  },
  {
    term: "reboot",
    definition: "Reboots. On a normal boot, reboot is enough. If bash is process 1, you need exec /sbin/reboot -f: without -f the kernel panics.",
    example: "reboot · exec /sbin/reboot -f",
    tldr: { page: "reboot" },
  },
  {
    term: "mount",
    definition:
      "Shows or mounts filesystems. With no arguments it lists what is mounted. -o remount,rw mounts a root that booted read-only so it can be written. The mount point is the last argument.",
    example: "mount -o remount,rw / · mount -o remount,rw /sysroot",
    tldr: { page: "mount" },
  },
  {
    term: "nmcli",
    definition:
      "Configures NetworkManager from the terminal. connection show lists profiles: NAME is what you pass to modify, DEVICE is the NIC. connection modify saves the address, gateway, and DNS. connection up applies it now. -f prints one field. ip a does not show DNS.",
    example: "nmcli connection show · nmcli -f ipv4.dns connection show hostonly · nmcli connection up hostonly",
    tldr: { page: "nmcli", platform: "linux" },
  },
  {
    term: "ip",
    definition: "Looks at the network. ip -br a is the short list of NICs and addresses. ip a is the same list, longer. It does not change the profile: that is nmcli. lo is the machine talking to itself and is not edited.",
    example: "ip -br a",
    tldr: { page: "ip" },
  },
  {
    term: "curl",
    definition: "Requests a URL and prints the answer. -I asks for headers only. Use it to see whether a port or a service answers, without a browser.",
    example: "curl -I http://127.0.0.1:82/",
    tldr: { page: "curl" },
  },
  {
    term: "firewall-cmd",
    definition:
      "Opens or closes ports in firewalld. --add-port=PORT/tcp opens one. --permanent saves it. Without --permanent, a reboot drops it. --reload applies what was saved. Until the reload, the permanent change is not active.",
    example: "firewall-cmd --add-port=82/tcp --permanent && firewall-cmd --reload",
    tldr: { page: "firewall-cmd", platform: "linux" },
  },
  {
    term: "getenforce",
    definition: "Prints the SELinux mode right now: Enforcing, Permissive, or Disabled. It does not change it. Enforcing blocks. Permissive warns and allows.",
    example: "getenforce",
    tldr: { page: "getenforce", platform: "linux" },
  },
  {
    term: "semanage",
    definition:
      "Changes SELinux policy and saves it. port -l lists labeled ports. port -a -t TYPE -p tcp PORT adds one. fcontext records the context of a path for a later restorecon. It is not in a minimal install: the package is policycoreutils-python-utils.",
    example: "semanage port -l | grep http · semanage port -a -t http_port_t -p tcp 82",
    tldr: { page: "semanage", platform: "linux" },
  },
  {
    term: "restorecon",
    definition: "Applies the context the policy already has recorded. -v says when it relabeled. It does not invent a new label: if the rule is missing, semanage fcontext comes first.",
    example: "restorecon -v /etc/NetworkManager/system-connections/hostonly.nmconnection",
    tldr: { page: "restorecon", platform: "linux" },
  },
  {
    term: "getsebool",
    definition: "Shows one SELinux boolean. -a lists them all. It does not change one: that is setsebool. on allows, off does not.",
    example: "getsebool -a | grep ftp",
    tldr: { page: "getsebool", platform: "linux" },
  },
  {
    term: "ausearch",
    definition: "Searches the audit log. -m avc keeps SELinux denials. -ts recent is what just happened. It is not journalctl: SELinux AVCs are here.",
    example: "ausearch -m avc -ts recent",
    tldr: { page: "ausearch", platform: "linux" },
  },
  {
    term: "podman",
    definition:
      "Runs containers without a daemon. run creates and starts one. -d leaves it in the background. --name sets the name. -v SOURCE:DEST:Z mounts a directory and Z fixes the context. generate systemd writes the unit so systemd can start it.",
    example: "podman run -d --name mycontainer localhost/text2pdf:latest · man podman-generate-systemd",
    tldr: { page: "podman", platform: "linux" },
  },
  {
    term: "flatpak",
    definition:
      "Installs applications apart from dnf. remote-add adds a source. install downloads an app. --user is that account, --system is the machine. list shows what is installed. uninstall removes one. A system remote does not show up for another user when they use --user.",
    example: "flatpak list · flatpak install --user -y NAME APP · man flatpak-remote-add",
    tldr: { page: "flatpak", platform: "linux" },
  },
  {
    term: "lsblk",
    definition: "Lists disks and partitions as a tree. -f adds the filesystem and the UUID. The disk that holds / and /boot is not partitioned again.",
    example: "lsblk -f",
    tldr: { page: "lsblk", platform: "linux" },
  },
  {
    term: "blkid",
    definition: "Prints the UUID and type of a device. That UUID is what goes in fstab when the line does not use the /dev name, which can change order.",
    example: "blkid /dev/sdb1",
    tldr: { page: "blkid", platform: "linux" },
  },
  {
    term: "parted",
    definition: "Partitions a disk. mklabel writes the table. mkpart creates a partition. The unit belongs on the number: 400MiB is not 400MB. The disk that holds / is left alone.",
    example: "parted /dev/sdb --script mklabel gpt mkpart primary 1MiB 401MiB",
    tldr: { page: "parted", platform: "linux" },
  },
  {
    term: "pvcreate",
    definition: "Marks a partition as a Physical Volume for LVM. It does not create the group or the logical volume: those are vgcreate and lvcreate. The partition has to exist first.",
    example: "pvcreate /dev/sdb1",
    tldr: { page: "pvcreate", platform: "linux" },
  },
  {
    term: "vgcreate",
    definition: "Creates a Volume Group from one or more PVs. The first argument is the group name. The rest are the disks.",
    example: "vgcreate wgroup /dev/sdb1",
    tldr: { page: "vgcreate", platform: "linux" },
  },
  {
    term: "lvcreate",
    definition: "Creates a Logical Volume inside a VG. -n is the name. -L is the size. The last argument is the group.",
    example: "lvcreate -n wshare -L 400M wgroup",
    tldr: { page: "lvcreate", platform: "linux" },
  },
  {
    term: "lvs",
    definition: "Lists Logical Volumes. It changes nothing. That is where you read the size and the group before an lvresize.",
    example: "lvs",
    tldr: { page: "lvs", platform: "linux" },
  },
  {
    term: "vgs",
    definition: "Lists Volume Groups and how much free space they have left. It changes nothing.",
    example: "vgs",
    tldr: { page: "vgs", platform: "linux" },
  },
  {
    term: "mkfs.ext4",
    definition: "Formats a volume as ext4. The argument is the device, not the mount point. Formatting erases what was there.",
    example: "mkfs.ext4 /dev/wgroup/wshare",
    tldr: { page: "mkfs.ext4", platform: "linux" },
  },
  {
    term: "mkswap",
    definition: "Marks a partition as swap. It does not turn it on: that is swapon. The fstab line comes after, so it comes back by itself.",
    example: "mkswap /dev/sdb2",
    tldr: { page: "mkswap", platform: "linux" },
  },
  {
    term: "swapon",
    definition: "Turns on swap that mkswap already marked. swapon --show lists the ones that are active. Without the fstab line, a reboot drops it.",
    example: "swapon /dev/sdb2 · swapon --show",
    tldr: { page: "swapon", platform: "linux" },
  },
  {
    term: "crontab",
    definition: "Edits or lists one user's job table. -l lists, -e edits, -r deletes. -u USER, as root, is that account's table. It is not a systemd timer.",
    example: "crontab -l -u erik",
    tldr: { page: "crontab" },
  },
  {
    term: "exportfs",
    definition: "Publishes or reviews what NFS is exporting. -v lists them with the options. -r rereads /etc/exports. Editing the file is not enough: it has to be published.",
    example: "exportfs -v · exportfs -r",
    tldr: { page: "exportfs", platform: "linux" },
  },
  {
    term: "showmount",
    definition: "Asks an NFS server what it exports. -e HOST lists the exports. Use it to check from the client, before mounting.",
    example: "showmount -e server",
    tldr: { page: "showmount", platform: "linux" },
  },
  {
    term: "sed",
    definition:
      "Edits text line by line. -i changes the file. Without -i it only prints. s replaces the first match on each line. ^ requires the start of the line. It is not set: set is a different bash builtin.",
    example: "sed -i 's/^Listen 80$/Listen 82/' /etc/httpd/conf/httpd.conf",
    tldr: { page: "sed" },
  },
  {
    term: "visudo",
    definition: "Opens sudoers and does not save it if the syntax is wrong. It is the safe editor. Do not edit /etc/sudoers with vim directly: one mistake can leave you without sudo.",
    example: "visudo",
    tldr: { page: "visudo", platform: "linux" },
  },
  {
    term: "chroot",
    definition: "Enters another directory tree and treats it as /. In an rd.break rescue, chroot /sysroot enters the real system. exit leaves it.",
    example: "chroot /sysroot",
    tldr: { page: "chroot" },
  },
];

export function glossaryFor(locale: Locale): GlossaryEntry[] {
  return locale === "en" ? en : es;
}
