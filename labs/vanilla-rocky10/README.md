# Vanilla Rocky 10 — lab para el simulacro arceprog

Alineado a [rhcsa.arceprog.dev](https://rhcsa.arceprog.dev) / `c:\dev\rhcsa`:

| VM | Hostname | IP lab |
|---|---|---|
| client | `client.rhcsa.lab` | `172.16.1.12/24` |
| server | `server.rhcsa.lab` | `172.16.1.13/24` |

Gateway / DNS del lab: `172.16.1.1` (interfaz host-only de VirtualBox en el host).

## Dónde levantarlo

- **PC de casa (Rocky + VirtualBox + Vagrant):** acá sí.
- **Windows del trabajo:** Vagrant suele ir mal (Hyper-V / sin VT-x). Usá las VMs que ya tenés en VirtualBox, o un clon limpio. Este `Vagrantfile` es para casa.

```bash
cd /ruta/a/rhcsa/labs/vanilla-rocky10   # o la copia en la PC de casa
vagrant up
vagrant ssh client
vagrant ssh server
```

Volver a vanilla (borra las VMs y el estado):

```bash
vagrant destroy -f
vagrant up
```

## Contraseña de root (lab-02)

En el **server**, el provisioning pone una contraseña de root **aleatoria y no la guarda**. No la vas a saber: practicás `rd.break` o `init=/bin/bash` en la **consola de VirtualBox**, no por SSH.

`vagrant ssh server` sigue andando (clave SSH de Vagrant). Para el reset, no uses `sudo passwd root`: eso se salta el ejercicio.

## Relación con la web

Los labs de `src/lib/labs.ts` asumen este par client/server. Nombres de ejemplo en la web: Felipe, Erik, Diego, Joaquin. Marca: arceprog.
