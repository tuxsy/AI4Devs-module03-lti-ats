# LTI ATS — Applicant Tracking System

Sistema de seguimiento de candidatos de nueva generación desarrollado por LTI.

## 📋 Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu máquina:

- [nvm](https://github.com/nvm-sh/nvm) — gestor de versiones de Node.js
- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose

---

## 🚀 Arranque rápido

### 1. Clona el repositorio

```bash
git clone https://github.com/lti/lti-ats.git
cd lti-ats
```

### 2. Instala la versión de Node.js requerida

```bash
nvm install
nvm use
```

> El proyecto requiere Node.js **v22.12.0**. El fichero `.nvmrc` en la raíz lo gestiona automáticamente.

### 3. Instala todas las dependencias

```bash
npm run install:all
```

> Instala las dependencias de la raíz, el frontend y el backend en un solo comando. Al instalar el backend se ejecuta automáticamente `prisma generate` para generar el cliente de Prisma.

### 4. Configura las variables de entorno

```bash
cp .env.example .env
```

Abre el fichero `.env` y revisa los valores. Para desarrollo local los valores por defecto funcionan sin cambios.

### 5. Levanta la base de datos

```bash
npm run db:up
```

> Arranca PostgreSQL en Docker en segundo plano. La primera vez descargará la imagen automáticamente.

### 6. Aplica las migraciones

```bash
npm run db:migrate
```

### 7. Arranca el proyecto

```bash
npm run dev
```

Esto arranca en paralelo:

| Servicio | URL |
|---|---|
| Frontend (Angular) | http://localhost:4200 |
| Backend (NestJS) | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:3000/api/docs |

---

## 🗄️ Gestión de la base de datos

```bash
npm run db:up       # Levanta PostgreSQL
npm run db:down     # Para PostgreSQL
npm run db:reset    # Elimina los datos y reinicia (¡borra todo!)
npm run db:migrate  # Aplica las migraciones pendientes
npm run db:studio   # Abre Prisma Studio en http://localhost:5555
```

---

## 🧪 Tests

```bash
npm run test             # Ejecuta todos los tests
npm run test:frontend    # Solo tests del frontend
npm run test:backend     # Solo tests del backend
```

---

## 🏗️ Build de producción

```bash
npm run build            # Compila frontend y backend
npm run build:frontend   # Solo frontend
npm run build:backend    # Solo backend
```

---

## 📁 Estructura del proyecto

```
lti-ats/
├── frontend/       # Aplicación Angular
├── backend/        # API NestJS + Prisma
├── docs/           # Documentación técnica
└── docker-compose.yml
```

Para más detalles consulta [`docs/project-structure.md`](docs/project-structure.md).

---

## 📚 Documentación técnica

| Documento | Descripción |
|---|---|
| [`docs/project.md`](docs/project.md) | Descripción general del proyecto |
| [`docs/frontend-stack.md`](docs/frontend-stack.md) | Stack y reglas del frontend |
| [`docs/backend-stack.md`](docs/backend-stack.md) | Stack y reglas del backend |
| [`docs/project-structure.md`](docs/project-structure.md) | Estructura del monorepo |