# Trabajo (Windows): VMs en VirtualBox, sin Vagrant

En esta PC Vagrant se traba. Las máquinas del simulacro se crean **solo en VirtualBox**.

VMs instaladas con VirtualBox unattended (sin Vagrant), 21 oct 2026:

| VM | Hostname | RAM | Disco | Red |
|---|---|---|---|---|
| `ClienteRocky-Cursor` | `client.rhcsa.lab` | 2048 MB | 25 GB | NAT + host-only `#2` (`172.16.1.1`) |
| `ServerRocky-Cursor` | `server.rhcsa.lab` | 2048 MB | 25 GB + 2 GB | igual |

ISO: `Downloads\Rocky-10.2-x86_64-minimal.iso`.  
Login de instalación: usuario `felipe` — ver `cheatsheets/creds-rocky-cursor.txt` en el repo de labs (no commitear).

## Instalar Rocky 10 (una vez)

1. Bajá el ISO **Minimal** o **Boot** de Rocky 10:  
   https://download.rockylinux.org/pub/rocky/10/isos/x86_64/
2. En VirtualBox → cada VM → Configuración → Almacenamiento → unidad óptica vacía → elegí el ISO.
3. Iniciar e instalar:
   - **client:** hostname `client.rhcsa.lab`, usuario `felipe` (o el que uses), root con una clave que **después vas a “olvidar”** en el server.
   - **server:** hostname `server.rhcsa.lab`, mismo criterio. El disco de 2 GB lo dejás sin usar para labs de LVM.
4. Tras instalar, en cada VM la interfaz del lab (`enp0s8` o similar) queda para el lab-01 / lab-02:
   - client → `172.16.1.12/24`, gw/DNS `172.16.1.1`
   - server → `172.16.1.13/24`, gw/DNS `172.16.1.1`
5. En el **server**, cuando quieras practicar reset: cambiá root a una clave random y no la anotes; el reset se hace por **consola** de VirtualBox.

## Snapshot limpio

Cuando las dos queden instaladas y antes de ensuciarlas:

Máquina → Tomar instantánea → nombre `vanilla-limpia`.

Para volver a cero: restaurar esa instantánea (sin Vagrant).

## Casa

Ahí sí podés usar el `Vagrantfile` de esta misma carpeta. En el trabajo, solo estas dos VMs.
