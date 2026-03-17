Para mi proyecto el stack ha sido Angular (frontend) y NestJS (backend). Son dos frameworks con filosofías similares.

Como base de datos PostgreSQL y para el acceso a datos Prisma.

Docker Compose para levantar la base de datos en loca.

He refinado un poco el contexto proporcionado pidíendole a Claude Code que me genere un project.md (descripción del proyecto), backend-stack.md (tecnologías del backend), frontend-stack.md (tecnologías del frontend) y project-structure.md (estructura del monorepo).

Una vez creados todos estos archivos en el directorio docs/ le he pedido a Claude Code que me genere la estructura del proyecto. Que me añada una página de bienvenida en el frontend y un endpoint /health en el backend.

Problemas encontrados y cómo los he solucionado:

- Problema al instalar las dependencias, por culpa de la versión de TypeScript. He ejecutado el comando que fallaba `! npm run install:all` en la CLI de Claude Code y lo ha solucionado sin problema
- Problemas varios al ejecutar el build en tanto en el backend como en el frontend. Le pido a Claude Code que los analice y los resuelva.
- Es muy frecuente que al arrancar los servicios los puertos ya estén ocupados. Le digo que si esto ocurre me pida permiso para matar los procesos que los están ocupando antes de arrancar.
- El arranque del backend falla, le digo a Claude Code que analice y corrija
