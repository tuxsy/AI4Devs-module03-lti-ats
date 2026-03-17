# Setup del proyecto LTI-ATS

## Stack elegido

- frontend: Angular + TailwindCSS
- backend: NestJs + Prisma
- database: PostgreSQL
- Docker + Docker Compose

Angular y NestJS son dos frameworks con filosofías similares lo que reduce la carga cognitiva para desarrolladores Full Stack.

## Contexto del proyecto

Antes de empezar he refinado un poco el contexto proporcionado pidíendole a Claude Code que me los siguientes archivos:

- project.md: descripción del proyecto
- backend-stack.md: tecnologías del backend
- frontend-stack.md: tecnologías del frontend
- project-structure.md: estructura del monorepo.

Una vez creados todos estos archivos en el directorio docs/ le he pedido a Claude Code que me genere la estructura del proyecto teniendolos en cuentea.

También le he pedido que me añada una página de bienvenida en el frontend y un endpoint /health en el backend.

## Problemas encontrados y cómo los he solucionado

- Problema al instalar las dependencias, por culpa de la versión de TypeScript. He ejecutado el comando que fallaba `! npm run install:all` en la CLI de Claude Code y lo ha solucionado sin problema
- Problemas varios al ejecutar el build en tanto en el backend como en el frontend. Le pido a Claude Code que los analice y los resuelva.
- Es muy frecuente que al arrancar los servicios los puertos ya estén ocupados. Le digo que si esto ocurre me pida permiso para matar los procesos que los están ocupando antes de arrancar.
- El arranque del backend falla, le digo a Claude Code que analice y corrija
- Al revisar el procedimiento de arranque documentado en el README se creaba una migración de la BD, en vez de eso genero yo una primera migración y le digo a Claude Code que me cambie el script de generar migración por uno que haga un deploy de las migraciones pendientes.

## CLAUDE.md

Una vez terminado el setup y comprobado que todo es correcto, le he dicho a Claude Code que me genere el archivo CLAUDE.md mediane el comando `/init`.
