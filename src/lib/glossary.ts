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
];

const en: GlossaryEntry[] = [
  {
    term: "which",
    definition: "Prints the path of the executable the shell will run. It does not search random files: it looks up commands on PATH.",
    example: "which logger → /usr/bin/logger",
    tldr: { page: "which" },
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
];

export function glossaryFor(locale: Locale): GlossaryEntry[] {
  return locale === "en" ? en : es;
}
