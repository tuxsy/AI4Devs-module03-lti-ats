# Backend Stack — LTI ATS

## 🧰 Tecnologías principales

| Capa | Tecnología | Paquete |
|---|---|---|
| Framework | NestJS | `@nestjs/core`, `@nestjs/common` |
| Lenguaje | TypeScript | `typescript` (strict mode) |
| Base de datos | PostgreSQL | `pg` |
| ORM | Prisma | `prisma`, `@prisma/client` |
| Configuración | NestJS Config | `@nestjs/config` |
| Documentación API | Swagger | `@nestjs/swagger` |

---

## 📐 Arquitectura

Estructura modular por features, alineada con los principios de NestJS:

```
src/
├── main.ts                  # Bootstrap, configuración global
├── app.module.ts            # Módulo raíz
├── config/                  # Variables de entorno y configuración
├── common/
│   ├── decorators/          # Decoradores personalizados
│   ├── filters/             # Exception filters globales
│   ├── guards/              # Guards reutilizables
│   ├── interceptors/        # Interceptores globales
│   └── pipes/               # Pipes globales
├── database/
│   └── migrations/          # Migraciones de Prisma
└── modules/
    ├── auth/                # Autenticación y autorización
    ├── users/               # Gestión de usuarios
    ├── jobs/                # Ofertas de empleo
    ├── candidates/          # Candidatos
    └── interviews/          # Entrevistas
```

### Convenciones de módulo
Cada módulo de feature contiene:
- `*.module.ts` — Definición del módulo
- `*.controller.ts` — Controlador REST
- `*.service.ts` — Lógica de negocio (usa `PrismaService` para acceso a datos)
- `dto/` — Data Transfer Objects con validación

---

## 🗄️ Base de datos — Prisma + PostgreSQL

### Paquetes
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### Estructura de ficheros Prisma
```
prisma/
├── schema.prisma        # Definición del esquema y modelos
└── migrations/          # Migraciones generadas automáticamente
```

### Configuración de la conexión (`prisma/schema.prisma`)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

La variable `DATABASE_URL` sigue el formato:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### PrismaService — integración con NestJS
Prisma no tiene un módulo oficial de NestJS, por lo que se crea un servicio dedicado que extiende `PrismaClient` y gestiona el ciclo de vida de la conexión:

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

El `PrismaService` se declara en un `DatabaseModule` global y se inyecta en cualquier servicio que necesite acceso a datos:

```typescript
// src/modules/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.job.findMany();
  }
}
```

### Flujo de trabajo con migraciones
```bash
# 1. Modificar prisma/schema.prisma con los cambios de esquema
# 2. Generar y aplicar la migración
npx prisma migrate dev --name nombre_descriptivo

# 3. Aplicar migraciones en producción (sin generar nuevas)
npx prisma migrate deploy

# 4. Regenerar el cliente tras cambios en el esquema
npx prisma generate

# 5. Explorar la base de datos en local
npx prisma studio
```

### Reglas
- **Nunca usar `prisma db push`** en producción — siempre usar `prisma migrate deploy`.
- Todos los cambios de esquema se hacen en `schema.prisma` y se versionan con migraciones.
- El `PrismaService` es la **única vía de acceso a la base de datos** — no instanciar `PrismaClient` directamente en los módulos.
- Usar las **relaciones de Prisma** (`@relation`) para definir asociaciones entre modelos.
- Activar el **query logging** solo en entorno de desarrollo:
  ```typescript
  super({ log: process.env.NODE_ENV === 'development' ? ['query'] : [] });
  ```
- Aprovechar el tipado generado de `@prisma/client` — nunca usar `any` en las queries.

---

## 🔐 Autenticación — JWT + Passport

### Paquetes
```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### Estrategia
- **JWT (JSON Web Tokens)** como mecanismo de autenticación stateless.
- **Bcrypt** para el hashing de contraseñas (saltRounds: 10 mínimo).
- **Access Token** de corta duración (15–60 min) + **Refresh Token** de larga duración.
- El JWT se envía en la cabecera `Authorization: Bearer <token>`.
- Proteger rutas con el guard `@UseGuards(JwtAuthGuard)`.

### Reglas
- **Nunca almacenar contraseñas en texto plano** — siempre bcrypt.
- Firmar los JWT con un secret fuerte definido en variables de entorno (`JWT_SECRET`).
- Definir `expiresIn` siempre — nunca tokens sin expiración.
- Validar el token en **cada petición** autenticada.
- Implementar **RBAC (Role-Based Access Control)** con un `RolesGuard` y el decorador `@Roles()`.

```typescript
// Ejemplo de protección de ruta con roles
@Get('admin')
@Roles('admin', 'recruiter')
@UseGuards(JwtAuthGuard, RolesGuard)
findAll() { ... }
```

---

## 🛡️ Seguridad HTTP — Helmet

### Paquete
```bash
npm install helmet
```

### Configuración (en `main.ts`)
```typescript
import helmet from 'helmet';

app.use(helmet());
```

Helmet configura automáticamente cabeceras HTTP de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`
- `X-XSS-Protection`
- `Referrer-Policy`

### Reglas
- Activar Helmet **siempre** antes de cualquier otra configuración.
- Para APIs JSON puras, la CSP (Content Security Policy) de Helmet aporta poco valor y puede desactivarse si genera conflictos.

---

## 🌐 CORS

### Configuración (en `main.ts`)
```typescript
app.enableCors({
  origin: configService.get<string>('ALLOWED_ORIGINS').split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### Reglas
- **Nunca usar `origin: '*'`** en producción.
- Definir los orígenes permitidos en variables de entorno (`ALLOWED_ORIGINS`).
- En desarrollo, permitir `http://localhost:4200` (Angular dev server).
- Incluir `credentials: true` si se usan cookies de autenticación.

---

## ⏱️ Rate Limiting — Throttler

### Paquete
```bash
npm install @nestjs/throttler
```

### Configuración
```typescript
// app.module.ts
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,    // 1 segundo
    limit: 5,     // 5 peticiones/segundo
  },
  {
    name: 'medium',
    ttl: 60000,   // 1 minuto
    limit: 100,   // 100 peticiones/minuto
  },
]),
```

### Reglas
- Aplicar `ThrottlerGuard` de forma **global** como provider.
- Usar `@SkipThrottle()` en endpoints que no necesiten limitación (e.g. health checks).
- Usar `@Throttle()` para definir límites específicos por endpoint (e.g. login: más restrictivo).
- En entornos con proxy/load balancer, habilitar `trust proxy` para leer correctamente la IP real del cliente mediante `X-Forwarded-For`.

```typescript
// Login más restrictivo: 5 intentos por minuto
@Throttle({ default: { ttl: 60000, limit: 5 } })
@Post('login')
login() { ... }
```

---

## ✅ Validación y Sanitización — class-validator + class-transformer

### Paquetes
```bash
npm install class-validator class-transformer
```

### Configuración global del ValidationPipe (en `main.ts`)
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Elimina campos no declarados en el DTO
    forbidNonWhitelisted: true, // Lanza error si llegan campos extra
    transform: true,           // Convierte automáticamente tipos primitivos
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Reglas de DTOs
- **Toda entrada de datos debe pasar por un DTO** con decoradores de `class-validator`.
- **`whitelist: true` siempre activo** — nunca procesar campos no declarados en el DTO.
- Usar `@IsString()`, `@IsEmail()`, `@IsUUID()`, `@IsNotEmpty()`, `@IsOptional()`, etc. en todos los campos.
- Usar `@Transform()` de `class-transformer` para sanitizar entradas (e.g. trim de strings, lowercase de emails).
- Usar `@Type()` para validar objetos anidados junto con `@ValidateNested()`.
- Separar DTOs de creación (`CreateJobDto`) y actualización (`UpdateJobDto`) usando `PartialType`.

```typescript
// Ejemplo de DTO con validación y sanitización
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  contactEmail: string;

  @IsEnum(ContractType)
  contractType: ContractType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;
}
```

---

## ⚙️ Variables de entorno — @nestjs/config

### Paquete
```bash
npm install @nestjs/config
```

### Configuración
```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  validationSchema: Joi.object({  // Validar variables obligatorias al arrancar
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    JWT_SECRET: Joi.string().min(32).required(),
    // ...
  }),
}),
```

### Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `NODE_ENV` | Entorno (`development`, `production`, `test`) |
| `PORT` | Puerto del servidor (default: 3000) |
| `DATABASE_URL` | URL de conexión completa a PostgreSQL |
| `JWT_SECRET` | Secret para firmar JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | Expiración del access token (e.g. `15m`) |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos (separados por coma) |

### Reglas
- **Nunca hardcodear** credenciales, secrets ni URLs en el código.
- El fichero `.env` **nunca debe commitearse** al repositorio (incluir en `.gitignore`).
- Proporcionar un fichero `.env.example` con todas las variables y valores de ejemplo.
- Validar las variables de entorno obligatorias al arrancar la aplicación (con Joi o Zod).

---

## 📄 Documentación API — Swagger

### Paquetes
```bash
npm install @nestjs/swagger swagger-ui-express
```

### Configuración (en `main.ts`)
```typescript
const config = new DocumentBuilder()
  .setTitle('LTI ATS API')
  .setDescription('API del sistema de seguimiento de candidatos de LTI')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Reglas
- Documentar todos los endpoints con `@ApiTags`, `@ApiOperation`, `@ApiResponse`.
- Documentar todos los DTOs con `@ApiProperty` en cada campo.
- La documentación Swagger debe estar **deshabilitada en producción** o protegida tras autenticación.

---

## 🧪 Testing

### Paquetes (incluidos por defecto en NestJS)
- **Jest** — framework de testing
- **Supertest** — tests e2e de endpoints HTTP

### Reglas
- Escribir **tests unitarios** para todos los servicios.
- Escribir **tests de integración (e2e)** para los controladores y flujos críticos.
- Usar mocks para repositorios y dependencias externas en tests unitarios.
- Mantener cobertura mínima del **80%** en servicios.

---

## 📦 Resumen de dependencias

```bash
# Core
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs

# Base de datos
npm install @prisma/client
npm install -D prisma

# Autenticación
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# Seguridad y red
npm install helmet @nestjs/throttler

# Validación
npm install class-validator class-transformer

# Configuración
npm install @nestjs/config joi

# Documentación
npm install @nestjs/swagger swagger-ui-express

# Dev dependencies
npm install -D @types/node typescript ts-node
```

---

## 📋 Checklist de seguridad antes de producción

- [ ] Migraciones de Prisma aplicadas con `prisma migrate deploy` (nunca `db push`)
- [ ] Variables de entorno validadas al arrancar
- [ ] Helmet activado
- [ ] CORS configurado con orígenes explícitos
- [ ] Rate limiting global activado con límites más estrictos en login
- [ ] `whitelist: true` y `forbidNonWhitelisted: true` en ValidationPipe
- [ ] JWT con `expiresIn` definido y secret de al menos 32 caracteres
- [ ] Contraseñas hasheadas con bcrypt
- [ ] Swagger deshabilitado o protegido en producción
- [ ] `.env` en `.gitignore` y `.env.example` disponible

---

*Documento de referencia para el stack backend de LTI ATS — NestJS + Prisma + PostgreSQL.*