# Frontend Stack — LTI ATS

## 🧰 Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Angular | Última (v21+) |
| Lenguaje | TypeScript | Strict mode activado |
| Estilos | TailwindCSS | v4+ |
| Componentes UI | Angular Material | Última (alineada con Angular) |
| Gestión de estado | Angular Signals | Nativo (sin librerías externas) |
| Formularios | Reactive Forms | Angular nativo |
| Routing | Angular Router | Con lazy loading por defecto |

---

## 📐 Arquitectura

- **Standalone components** como unidad base. No se usan NgModules.
- **Feature-based folder structure**: cada funcionalidad tiene su propia carpeta con componentes, servicios y rutas.
- **Lazy loading** obligatorio en todas las rutas de feature.
- **Servicios singleton** declarados con `providedIn: 'root'`.

```
src/
├── app/
│   ├── core/            # Guards, interceptors, servicios globales
│   ├── shared/          # Componentes y pipes reutilizables
│   ├── features/
│   │   ├── jobs/        # Gestión de ofertas de empleo
│   │   ├── candidates/  # Gestión de candidatos
│   │   └── interviews/  # Gestión de entrevistas
│   └── app.routes.ts
```

---

## ✅ Reglas de TypeScript

Siguiendo las recomendaciones oficiales de Angular para desarrollo con IA ([angular.dev/ai/develop-with-ai](https://angular.dev/ai/develop-with-ai)):

- **Activar `strict: true`** en `tsconfig.json` siempre.
- **Preferir inferencia de tipos** cuando el tipo es obvio.
- **Prohibido usar `any`**; usar `unknown` cuando el tipo sea incierto.
- Usar tipos explícitos en parámetros de funciones y valores de retorno.

---

## ✅ Reglas de Angular

Extraídas directamente del archivo oficial de buenas prácticas de Angular para LLMs:

### Componentes
- Usar siempre **standalone components**. NO establecer `standalone: true` explícitamente (es el valor por defecto en v20+).
- Mantener componentes **pequeños y con responsabilidad única**.
- Usar **`input()` y `output()`** en lugar de los decoradores `@Input` y `@Output`.
- Usar **`computed()`** para estado derivado.
- Establecer **`changeDetection: ChangeDetectionStrategy.OnPush`** en todos los componentes.
- Preferir **templates inline** para componentes pequeños.
- NO usar `@HostBinding` ni `@HostListener`; usar el objeto `host` dentro del decorador `@Component` o `@Directive`.
- Usar **`NgOptimizedImage`** para todas las imágenes estáticas.

### Templates
- Mantener los templates simples, sin lógica compleja.
- Usar el **control flow nativo** (`@if`, `@for`, `@switch`) en lugar de `*ngIf`, `*ngFor`, `*ngSwitch`.
- NO usar `ngClass`; usar **bindings de `class`** directamente.
- NO usar `ngStyle`; usar **bindings de `style`** directamente.
- Usar el **async pipe** para manejar observables en el template.

### Estado
- Usar **signals** para el estado local del componente.
- Usar **`computed()`** para estado derivado.
- Mantener las transformaciones de estado **puras y predecibles**.
- NO usar `mutate` en signals; usar **`update()` o `set()`**.

### Formularios
- Usar siempre **Reactive Forms** en lugar de Template-driven Forms.

### Servicios
- Diseñar servicios con **responsabilidad única**.
- Usar la función **`inject()`** en lugar de inyección por constructor.

---

## 🎨 TailwindCSS + Angular Material

### Convivencia
Angular Material y TailwindCSS se usan de forma complementaria:
- **Angular Material** para componentes complejos: inputs, selects, datepickers, tablas, diálogos, snackbars.
- **TailwindCSS** para layout, espaciado, tipografía y utilidades visuales.

### Reglas de uso
- No duplicar estilos: si Angular Material ya provee un componente, no recrearlo con Tailwind.
- Customizar el tema de Angular Material mediante **Design Tokens** (CSS custom properties), no sobreescribiendo clases directamente.
- Usar las clases de Tailwind preferentemente en el template HTML; evitar `@apply` salvo en casos justificados.
- Configurar el tema de colores de Tailwind en `tailwind.config.ts` alineado con la paleta de Angular Material del proyecto.

---

## 🤖 Configuración para desarrollo con IA

Angular proporciona ficheros de contexto oficiales para que los LLMs generen código moderno y correcto. Se recomienda configurar el IDE con los siguientes recursos:

| IDE / Herramienta | Fichero de configuración |
|---|---|
| VS Code (Copilot) | `.github/copilot-instructions.md` → usar [guidelines.md](https://angular.dev/assets/context/guidelines.md) |
| Cursor | `.cursor/rules` → usar [angular-20.mdc](https://angular.dev/assets/context/angular-20.mdc) |
| JetBrains | `guidelines.md` → usar [guidelines.md](https://angular.dev/assets/context/guidelines.md) |
| Windsurf | `guidelines.md` → usar [guidelines.md](https://angular.dev/assets/context/guidelines.md) |
| Firebase Studio | `airules.md` → usar [airules.md](https://angular.dev/assets/context/airules.md) |

Recursos adicionales:
- [`llms.txt`](https://angular.dev/llms.txt) — índice de recursos clave para LLMs.
- [`llms-full.txt`](https://angular.dev/assets/context/llms-full.txt) — guía completa de Angular para LLMs.
- [Angular CLI MCP Server](https://angular.dev/ai/mcp) — permite a los agentes de IA interactuar directamente con el CLI de Angular.

---

## ♿ Accesibilidad

- Todo el código generado debe **pasar los checks de AXE**.
- Cumplir los mínimos **WCAG AA**: contraste de color, gestión del foco y atributos ARIA.
- Angular Material ya incluye soporte de accesibilidad en sus componentes; no sobreescribir comportamientos ARIA por defecto.

---

## 📦 Scripts de proyecto

```bash
# Desarrollo
ng serve

# Build de producción
ng build --configuration production

# Tests unitarios
ng test

# Lint
ng lint

# Generar componente (standalone por defecto)
ng generate component features/jobs/job-form

# Generar servicio
ng generate service core/services/job
```

---

*Documento de referencia para el stack frontend de LTI ATS. Basado en las recomendaciones oficiales de Angular v21+ para desarrollo con IA ([angular.dev/ai](https://angular.dev/ai)).*