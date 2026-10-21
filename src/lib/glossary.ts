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
      "Borra un usuario. Con -r también borra el home y el mail. El usuario no puede tener sesión abierta. En XFS el home no se recupera: otro useradd deja la carpeta vacía.",
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
];

const en: GlossaryEntry[] = [
  {
    term: "which",
    definition: "Prints the path of the executable the shell will run. It does not search random files: it looks up commands on PATH.",
    example: "which logger → /usr/bin/logger",
    tldr: { page: "which" },
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
      "Deletes a user. With -r it also removes the home and mail. The user cannot have an open session. On XFS the home is gone: another useradd leaves an empty folder.",
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
];

export function glossaryFor(locale: Locale): GlossaryEntry[] {
  return locale === "en" ? en : es;
}
