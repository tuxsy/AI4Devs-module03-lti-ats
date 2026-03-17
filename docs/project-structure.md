# Project Structure — LTI ATS Monorepo

## 📁 Estructura completa del repositorio

```
lti-ats/
│
├── .nvmrc                          # Versión de Node.js pinada para el proyecto
├── .gitignore                      # Ficheros ignorados por Git
├── .prettierrc                     # Configuración de Prettier (compartida)
├── .prettierignore                 # Exclusiones de Prettier
├── .husky/                         # Pre-commit hooks
│   └── pre-commit                  # Hook: formatea los archivos modificados
│
├── package.json                    # Gestor raíz del monorepo (scripts globales)
│
├── docker-compose.yml              # Base de datos PostgreSQL en local
├── .env.example                    # Variables de entorno de ejemplo
│
├── frontend/                       # Módulo Angular
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── src/
│       └── ...
│
├── backend/                        # Módulo NestJS
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       └── ...
│
└── docs/                           # Documentación del proyecto
    ├── project.md
    ├── frontend-stack.md
    ├── backend-stack.md
    └── project-structure.md
```

---

## 📌 `.nvmrc` — Versión de Node.js

El fichero `.nvmrc` en la raíz pina la versión de Node.js requerida por el proyecto.
Con él, cualquier desarrollador puede activar la versión correcta con un solo comando.

```
# .nvmrc
22.12.0
```

> Se usa Node.js **v22.12.0 LTS**, que es la versión mínima requerida por el proyecto, compatible con NestJS 11 (requiere v20+) y Angular v21+.

**Uso:**
```bash
nvm install    # Instala la versión especificada en .nvmrc (si no está instalada)
nvm use        # Activa la versión del .nvmrc en la sesión actual
```

---

## 📦 `package.json` raíz — Gestor del monorepo

El `package.json` raíz no contiene código de aplicación. Su único propósito es:
- Orquestar los scripts de arranque, build y test de ambos módulos.
- Instalar las herramientas de desarrollo compartidas (Husky, Prettier).
- Servir de punto de entrada único para cualquier desarrollador que clone el repo.

```json
{
  "name": "lti-ats",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=22.12.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "prepare": "husky",

    "install:all": "npm install && npm install --prefix frontend && npm install --prefix backend",

    "dev": "npm run dev:backend & npm run dev:frontend",
    "dev:frontend": "npm run --prefix frontend start",
    "dev:backend": "npm run --prefix backend start:dev",

    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "npm run --prefix frontend build",
    "build:backend": "npm run --prefix backend build",

    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "npm run --prefix frontend test",
    "test:backend": "npm run --prefix backend test",

    "lint": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "npm run --prefix frontend lint",
    "lint:backend": "npm run --prefix backend lint",

    "format": "prettier --write \"**/*.{ts,html,scss,css,json,md}\"",

    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
    "db:reset": "docker compose down -v && docker compose up -d",
    "db:migrate": "npm run --prefix backend prisma:migrate",
    "db:studio": "npm run --prefix backend prisma:studio"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

> **Nota:** El script `dev` arranca ambos módulos en paralelo con `&`. En Windows se recomienda usar `concurrently` en su lugar: `npm install -D concurrently` y reemplazar `&` por `concurrently \"...\" \"...\"`

---

## 🐳 `docker-compose.yml` — Base de datos

PostgreSQL corre en Docker exclusivamente en local. En producción se usará una instancia de base de datos gestionada.

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: lti-ats-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-lti}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-lti_secret}
      POSTGRES_DB: ${POSTGRES_DB:-lti_ats}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-lti}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Comandos rápidos (desde la raíz):**
```bash
npm run db:up       # Levanta PostgreSQL en segundo plano
npm run db:down     # Para el contenedor
npm run db:reset    # Elimina el volumen y vuelve a levantar (BD limpia)
npm run db:migrate  # Aplica migraciones de Prisma
npm run db:studio   # Abre Prisma Studio en el navegador
```

---

## 🪝 Pre-commit hook — Husky + lint-staged

El hook de pre-commit formatea automáticamente **solo los ficheros modificados** en el commit usando `lint-staged`. Esto garantiza que el código commiteado siempre esté formateado, sin ralentizar el flujo de trabajo.

### Configuración de Husky

```bash
# Inicialización (solo una vez al configurar el proyecto)
npx husky init
```

```bash
# .husky/pre-commit
npx lint-staged
```

### Configuración de lint-staged

Añadir en el `package.json` raíz:

```json
{
  "lint-staged": {
    "**/*.{ts,html}": [
      "prettier --write"
    ],
    "**/*.{scss,css}": [
      "prettier --write"
    ],
    "**/*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Configuración de Prettier

```json
// .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

```
# .prettierignore
node_modules/
dist/
.angular/
coverage/
backend/prisma/migrations/
*.min.js
```

---

## ⚙️ Flujo de configuración inicial (onboarding)

Pasos para que un nuevo desarrollador tenga el proyecto funcionando desde cero:

```bash
# 1. Clonar el repositorio
git clone https://github.com/lti/lti-ats.git
cd lti-ats

# 2. Instalar la versión correcta de Node.js
nvm install
nvm use

# 3. Instalar todas las dependencias (raíz + frontend + backend)
npm run install:all

# 4. Configurar las variables de entorno
cp .env.example .env
# Editar .env con los valores locales

# 5. Levantar la base de datos
npm run db:up

# 6. Aplicar migraciones de Prisma
npm run db:migrate

# 7. Arrancar frontend y backend en paralelo
npm run dev
```

---

## 🔑 `.env.example`

```bash
# Base de datos (Docker local)
POSTGRES_USER=lti
POSTGRES_PASSWORD=lti_secret
POSTGRES_DB=lti_ats
DB_PORT=5432

# Prisma — construida a partir de las variables anteriores
DATABASE_URL="postgresql://lti:lti_secret@localhost:5432/lti_ats?schema=public"

# Backend (NestJS)
NODE_ENV=development
PORT=3000
JWT_SECRET=cambiar_por_un_secret_de_al_menos_32_caracteres
JWT_EXPIRES_IN=15m
ALLOWED_ORIGINS=http://localhost:4200
```

---

## 🌐 Puertos por defecto en local

| Servicio | Puerto |
|---|---|
| Angular (frontend) | `4200` |
| NestJS (backend) | `3000` |
| PostgreSQL (Docker) | `5432` |
| Prisma Studio | `5555` |

---

*Documento de referencia para la estructura del monorepo LTI ATS.*