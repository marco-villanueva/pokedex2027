# ROADMAP

## Estrategia

El proyecto se desarrolla mediante Release Candidates secuenciales.

Cada RC tiene un objetivo claro y criterios de salida.

No avanzar automáticamente por cantidad de tareas completadas. Avanzar cuando los criterios de aceptación estén cumplidos.

---

# RC0 - Foundation

## Objetivo

Construir la base técnica correcta.

## Alcance

- Vite + React + TypeScript;
- router;
- TanStack Query;
- estructura de carpetas;
- API client;
- DTOs iniciales;
- domain models;
- mappers;
- query keys;
- lint;
- formatting;
- test runner;
- Playwright;
- estilos base;
- tokens iniciales;
- error boundary;
- route-level lazy loading base;
- documentación integrada.

## Criterios de salida

- build estable;
- lint estable;
- typecheck estable;
- tests iniciales;
- una ruta de listado funcional;
- una ruta de detalle funcional;
- datos no consumidos directamente desde UI;
- no hay errores de consola.

---

# RC1 - Visual Language

## Objetivo

Definir el lenguaje visual antes de escalar la aplicación.

## Alcance

Crear playground o ruta interna con:

- Button;
- TypeBadge;
- SearchField;
- FilterChip;
- GlassPanel;
- DataLabel;
- StatBar;
- PokemonCard;
- HolographicSurface;
- ScannerRing;
- estados de Fire;
- Water;
- Grass;
- Electric;
- Psychic;
- Ghost.

## Validaciones

- desktop;
- mobile;
- focus;
- reduced motion;
- contraste;
- composición.

## Criterios de salida

- PokemonCard tiene identidad clara;
- componentes mantienen coherencia;
- tipo principal modifica ambiente de forma reconocible;
- no parece dashboard genérico;
- motion tokens definidos;
- performance aceptable.

---

# RC2 - Pokédex Explorer

## Objetivo

Construir el núcleo de descubrimiento.

## Alcance

- grid;
- búsqueda;
- infinite scroll o paginación;
- filtros;
- tipo;
- generación;
- orden;
- URL state;
- loading skeletons;
- empty;
- error;
- retry;
- keyboard navigation;
- prefetch;
- card interactions;
- transition a detail.

## Criterios de salida

- filtros compartibles por URL;
- búsqueda robusta;
- scroll estable;
- no existe waterfall evidente;
- cards mantienen rendimiento;
- mobile completo;
- navegación teclado funcional.

---

# RC3 - Pokémon Experience

## Objetivo

Construir una ficha de Pokémon memorable.

## Alcance

- hero;
- scanner;
- artwork;
- shiny toggle;
- tipos;
- altura;
- peso;
- stats;
- especie;
- flavor text;
- legendary/mythical;
- habilidades;
- sprite gallery;
- previous/next;
- ambient type theme;
- 3D scene opcional;
- responsive.

## Criterios de salida

- carga progresiva;
- hero usable sin WebGL;
- reduced motion;
- no layout shifts severos;
- navegación previa/siguiente rápida;
- imágenes con fallback.

---

# RC4 - Evolution + Discovery

## Objetivo

Agregar profundidad de exploración.

## Alcance

- evolution tree;
- ramas;
- condiciones;
- generation explorer;
- forms;
- abilities detail;
- type relationships;
- related Pokémon.

## Criterios de salida

- cadenas complejas soportadas;
- responsive;
- navegación accesible;
- condiciones entendibles;
- no se asume evolución lineal.

---

# RC5 - Compare + Personalization

## Objetivo

Permitir comparación y selección personal.

## Alcance

- Compare;
- URL compartible;
- favorites;
- recently viewed opcional;
- Team Builder;
- máximo 6;
- persistencia;
- composición por tipos;
- random Pokémon.

## Criterios de salida

- estado persistente versionado;
- compare funciona por URL;
- team usable en mobile;
- no existe dependencia de cuenta.

---

# RC6 - Mobile Experience

## Objetivo

Auditoría específica para handheld.

## Viewports mínimos

- 360 px;
- 390 px;
- 430 px;
- 768 px.

## Alcance

- navegación;
- ergonomía;
- cards;
- hero;
- filters;
- evolution;
- compare;
- team;
- touch states;
- gestures cuando aporten valor;
- safe areas.

## Criterios de salida

- sin overflow horizontal;
- targets táctiles adecuados;
- no existen funciones críticas solo por hover;
- layout específico para móvil;
- canvas y efectos escalados.

---

# RC7 - Engineering Pass

## Objetivo

Cerrar deuda técnica y validar producción.

## Alcance

- performance;
- bundle analysis;
- cache;
- query tuning;
- code splitting;
- a11y;
- cross-browser;
- error boundaries;
- console audit;
- network audit;
- tests;
- memory;
- WebGL lifecycle;
- image loading.

## Criterios de salida

Ver `QUALITY_GATES.md`.

---

# RC8 - Showcase Release

## Objetivo

Preparar una versión pública de portfolio.

## Alcance

- intro;
- README final;
- screenshots;
- arquitectura;
- deployment;
- metadata;
- favicon;
- Open Graph;
- SEO básico;
- PWA opcional;
- polished loading;
- final QA.

## Criterios de salida

- deployment estable;
- README entendible;
- arquitectura documentada;
- no issues críticos conocidos;
- versión demostrable públicamente.

---

# Backlog posterior

Ideas que no deben bloquear V1:

- Type Matrix;
- Generation Timeline;
- silhouette quiz;
- stat radar avanzado;
- Pokémon size comparison;
- team analysis;
- battle effectiveness explorer;
- keyboard command palette;
- offline/PWA avanzada.
