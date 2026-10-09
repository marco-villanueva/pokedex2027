# DECISIONS

Registro ligero de decisiones.

Añadir entradas cuando una decisión afecte arquitectura, diseño, alcance o mantenimiento.

---

## D-001 - Frontend puro

**Estado:** aceptada

La V1 será frontend puro y consumirá PokéAPI directamente.

No se añade backend propio.

**Razón:**

El objetivo principal es frontend, visualización y arquitectura cliente.

---

## D-002 - React + Vite

**Estado:** aceptada

React con Vite como base.

**Razón:**

Permite concentrarse en frontend sin introducir requisitos de SSR.

---

## D-003 - TanStack Query para server state

**Estado:** aceptada

Los datos remotos se manejan con TanStack Query.

**Consecuencia:**

No duplicar server state en stores globales.

---

## D-004 - CSS moderno sin Tailwind como base

**Estado:** aceptada

La mayor parte del sistema visual se implementa con CSS moderno.

**Razón:**

El proyecto funciona también como laboratorio de CSS.

---

## D-005 - 3D complementario

**Estado:** aceptada

Three.js / React Three Fiber se usan como capa visual complementaria.

**Restricción:**

Contenido y controles esenciales permanecen en DOM.

---

## D-006 - No exigir modelos 3D de Pokémon

**Estado:** aceptada

La V1 utiliza artwork 2D dentro de composiciones espaciales.

**Razón:**

PokéAPI proporciona artworks y sprites, pero no una colección completa de modelos 3D.

---

## D-007 - Diseño adaptable por tipo

**Estado:** aceptada

El tipo principal modifica tokens y ambiente.

**Restricción:**

El tipo no debe comprometer contraste o usabilidad.

---

## D-008 - URL como estado navegable

**Estado:** aceptada

Búsqueda, filtros y compare deben representarse en URL cuando sea razonable.

---

## D-009 - Versiones base RC0

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

Inicialización RC0: elegir versiones compatibles del stack objetivo.

### Decisión

React 19 + Vite 8 + TypeScript 5.9 + React Router 8 + TanStack Query 5 + Motion 14 + Three 0.186 + R3F 9 + Drei 10. Vitest 4 + Testing Library 16 + Playwright 1.57 + ESLint 9 (typescript-eslint) + Prettier 3.

### Consecuencias

`typescript-eslint` entra como dependencia de lint (el gate RC0 exige lint con TS). `@types/three` se fija a `^0.186.0` (la `0.186.1` no existe en el registro).

---

## D-010 - Paginación RC0, scroll infinito en RC2

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

El Explorer RC0 necesita un listado funcional sin anticipar toda la UX de RC2.

### Decisión

RC0 usa paginación con `?page=` en URL (24 por página) + batch acotado de summaries con caché compartida. RC2 la sustituye por infinite scroll + búsqueda global + filtros + orden.

### Consecuencias

La búsqueda RC0 es local a la página cargada; el contrato de query keys y caché no cambia en RC2.

---

## D-011 - Detalle compone pokemon + species en paralelo

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

El dossier necesita datos de `/pokemon` y `/pokemon-species`.

### Decisión

`pokemonDetailsOptions` dispara ambas peticiones en paralelo dentro de una sola query, mapeando a un único `PokemonDetails`. Sin waterfall; una sola clave de caché.

---

## D-012 - Sin Zustand en RC0

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

`ARCHITECTURE.md` solo contempla Zustand ante un caso global real.

### Decisión

RC0 no instala Zustand: estado local + URL + TanStack Query cubren explorer y detalle. Se reevalúa en RC5 (favoritos/team).

### Alternativas consideradas

Instalarlo preventivamente; descartado por disciplina de dependencias.

---

## D-013 - Pointer effects vía CSS vars + rAF, sin setState

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

`HolographicSurface` y `PokemonCard` v2 necesitan tilt, specular y foil reactivos al puntero.

### Decisión

El handler escribe `--px/--py/--rx/--ry` directamente en el estilo del elemento dentro de un `requestAnimationFrame` (cancelado en cada evento); React no re-renderiza por `pointermove`. Touch recibe sheen estático; `prefers-reduced-motion` desactiva tilt y loops por CSS y por guarda en JS.

### Consecuencias

Efectos a 60fps sin renders; fallback garantizado sin puntero fino.

---

## D-014 - /lab como ruta interna permanente

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

RC1 exige playground visual validable en navegador y E2E.

### Decisión

`/lab` es ruta lazy fuera de la navegación principal (enlace en footer). Aloja matriz de tipos, estudios de especímenes y primitivas; sirve como fixture visual para screenshots y tests de reduced-motion/responsive.

---

## D-015 - Explorer RC2: índice canónico + filtros en cliente

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

El Explorer necesita búsqueda global, filtros por tipo/generación y orden sin disparar cientos de peticiones de detalle.

### Decisión

- Un único `GET /pokemon?limit=2000` mapeado a índice canónico (especies ≤ 1025, formas excluidas), cacheado 7 días.
- Filtro de tipo vía `GET /type/{name}` (solo cuando se selecciona) intersectado en cliente.
- Filtro de generación vía rangos canónicos en dominio (sin round-trip a `/generation`; datos estables y documentados).
- Búsqueda, intersección y orden como función pura `applyExplorerFilters` sobre el índice; detalles solo para la ventana visible.
- Filtros serializados en URL (`q`, `type`, `generation`, `sort`); defaults omitidos; parse validado con fallback.

### Consecuencias

Búsqueda/orden instantáneos sin debounce de red; una sola petición de índice por sesión; prefetch y ventanas acotadas como en RC0.

---

## D-016 - Árbol de evolución como tiers DOM, sin canvas

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

RC4 necesita un árbol evolutivo visual que soporte ramas y siga siendo accesible.

### Decisión

Columnas por estadio (`tiersOf` puro sobre el dominio) con artwork, tipos y condiciones por nodo. La estructura DOM (listas ordenadas por estadio) ES la representación accesible: sin versión paralela, sin canvas, sin grafos SVG medidos por JS.

### Consecuencias

Ramas explícitas, responsive por CSS (columnas ↔ flujo vertical), nodos 100% navegables por teclado. Efectos espaciales WebGL quedan para RC7 si aportan valor medido.

---

## D-017 - Generations vía explorer + enlaces, sin ruta enciclopédica

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

RC4 pedía "generation exploration" sin explotar el alcance.

### Decisión

Sin ruta `/generations` dedicada: la exploración por generación vive en el rail del explorer (con conteos) + `DataLabel` de generación en el dossier enlazando a `/pokedex?generation=N` (vía `generationIdFor`). Sin round-trip: rangos canónicos D-015.

### Consecuencias

Descubrimiento por generación con cero peticiones extra y cero vistas de bajo valor.

---

## D-019 - Sin Motion ni Three.js en el bundle (RC7)

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

Auditoría de bundle RC7: `motion` (122 kB) solo servía fades de entrada; `three`/`fiber`/`drei` no se importaban en ningún módulo (política CSS-first validada en la práctica).

### Decisión

- `FadeIn` reimplementado en CSS puro (`px-enter` + `animation-delay`; reduced-motion global lo anula).
- Desinstalados `motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
- `sourcemap: false` en build de producción (artefacto limpio; debug vía dev).

### Consecuencias

Chunk de entrada 122 kB → 0,19 kB; vendor 347 kB (react+router+query). Motion/Three se reintroducen solo ante una necesidad real (springs/gestos, escena 3D).

---

## D-018 - Collections con Context, sin Zustand (RC5)

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

`ARCHITECTURE.md` reserva Zustand para estado global real no resuelto por React/URL/Query/Context.

### Decisión

Favorites y Team usan Context + `useState` + `localStorage` versionado + sync cross-tab. Solo viven ids en el store; ningún server state se duplica. `accessibility`/`performance` no justifican un store global.

### Consecuencias

Cero dependencias nuevas; reglas puras testeables (`team-rules`); migración versionada vía `readCollection`.

---

## D-020 - Mensajes de error sin rastros de transporte (post-RC8)

**Fecha:** 2026-10-07
**Estado:** aceptada

### Contexto

La auditoría de outage mostró que `ApiError` renderizaba URLs crudas de PokéAPI en los `ErrorPanel` visibles (§39 prohíbe exponer payloads del servidor).

### Decisión

- Los mensajes user-facing de `client.ts` nunca incluyen URLs, estados internos ni payloads; la URL vive solo en código/devtools.
- Gate permanente `e2e/outage.spec.ts` (tráfico abortado → alerts sin `http` ni menciones a la API).

### Consecuencias

Textos de error estables ante cambios de endpoint; debug de red sigue disponible en devtools y `status` tipado de `ApiError`.

---

## D-021 - View Transitions SPA morph card → dossier (§7 P0-1)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P0-1 pide el morph card→dossier como patrón de continuidad/orientación sin librerías (D-019 vigente: CSS-first, 0 kB).

### Decisión

- `src/lib/view-transitions.ts`: helpers puros (`pokemonArtTransitionName` / `pokemonNumeralTransitionName` por specimen id, `shouldUseViewTransition`, `transitionNavigate`).
- `src/app/router/TransitionLink.tsx`: wrapper de `Link` que envuelve la navegación en `document.startViewTransition` + `flushSync`; clicks con modificadores y teclado intactos (ancla real).
- Pares compartidos por id: artwork card ↔ hero del dossier (`pokemon-art-<id>`) y watermark ↔ readout numeral (`pokemon-numeral-<id>`); el resto hace crossfade del root. Dossier↔dossier con distinto id cruza por crossfade (sin morph entre especies distintas, deliberado).
- `src/app/styles/view-transitions.css`: duraciones desde tokens, `@view-transition { navigation: auto }` como mejora progresiva cross-document, kill-switch total con `prefers-reduced-motion`.
- Sin el API o con reduced-motion, `TransitionLink` se comporta exactamente como `Link` (fallback verificado por unit + E2E).

### Consecuencias

Chunk `TransitionLink` 0,77 kB; vendor 347,52 kB (gzip 109,25 kB) sin regresión. E2E permanente `e2e/view-transitions.spec.ts` (par compartido + reduced-motion intacto).

### Alternativas consideradas

`navigate(to, { viewTransition: true })` nativo de React Router; descartado porque no respeta `prefers-reduced-motion` por sí solo — el wrapper manual sí.

---

## D-022 - Scroll-driven reveals transform-only (§7 P0-2)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P0-2 pide reveals ligados al scroll para cards del explorer y secciones del dossier, con contenido visible por defecto y sin pelear con el IntersectionObserver de 48 ventanas.

### Decisión

- `src/app/styles/scroll-reveals.css` (puro CSS, cero componentes tocados):
  `.explorer-grid > li` (entry→cover 24 %), `.dossier-panels .panel`
  (entry→cover 18 %), parallax contenido de `.scanner-art` (cover→exit).
  Todo tras `@supports (animation-timeline: view())`; fuera de él no existe
  ninguna regla → visible por defecto en Safari <26 / Firefox <159.
- El reveal es **solo `transform`, nunca opacity**: un muestreo estático
  (axe) sobre un panel a caballo del fold encontró contraste transitorio
  bajo con el fade 0→1; sin opacity el contraste AA es invariante durante
  todo el vuelo. Evidencia: axe 10/10 tras el cambio (2 rutas dossier
  fallaban con el fade).
- El parallax usa `transform` para componer con el `translate` del tilt de
  puntero (no lo pisa); kill explícito con `prefers-reduced-motion`.
- El IO de ventanas sigue siendo el único que materializa (el reveal solo
  anima la entrada); solo transform → sin CLS ni coste de paint por frame.

### Consecuencias

Vendor 347,52 kB / gzip 109,25 kB sin cambios. E2E permanente
`e2e/scroll-reveals.spec.ts` (timeline `view()` activo, opacity siempre 1,
reduced-motion intacto).

### Alternativas consideradas

Fade 0→1 + rise (más vistoso); descartado por el hallazgo axe — la
legibilidad invariante gana al pulido.

---

## D-023 - Popover nativo + `@starting-style` (§7 P0-3)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P0-3 pide popover nativo con entrada declarativa para
habilidades, matchups y ayuda — fin de hacks de temporizadores para animar
desde `display: none`, con a11y nativa (top layer, Esc, foco).

### Decisión

- `HelpPopover` (sin estado, `popovertarget` nativo, cero JS de
  apertura/cierre) para contenido suplementario: leyenda de matchups
  (“How to read”) y ayuda de filtros del explorer (“Search help”).
- `AbilityRows` migra el expandible inline a popover por fila: el fetch
  on-demand se dispara con el evento `toggle` (`newState === 'open'`,
  cacheado después); `aria-expanded` se sincroniza desde el mismo evento.
- `HelpPopover.css`: overlay tras `@supports selector(:popover-open)`,
  entrada con `@starting-style`, salida con `allow-discrete`,
  `::backdrop` tenue; kill con `prefers-reduced-motion`.
- Fallback sin API (probe `src/lib/popover.ts`): el MISMO contenido como
  `<details>` nativo — verificado en unit (jsdom) y en E2E con la API
  extirpada vía `addInitScript`.
- Hallazgo en regresión: la leyenda cerrada contiene los tokens `4×`/`0×`
  y rompió el locator `getByText('4×').first()` de `detail.spec.ts`;
  fix acotando al `.matchup-group` (el test, no la app, estaba mal).

### Consecuencias

Vendor 347,56 kB / gzip 109,28 kB (+40 B / +0,03 kB: solo CSS). E2E
permanente `e2e/popover.spec.ts` (5: apertura/Esc, leyenda, teclado,
fallback, reduced-motion).

### Alternativas consideradas

Mantener el expandible inline de habilidades; descartado porque el §7 lo
pide explícitamente como popover y el patrón conserva fetch on-demand,
orden de lectura y retorno de foco nativo.

---

## D-024 - Anchor tooltips en `TypeBadge` (§7 P0-4)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P0-4 pide que cada `TypeBadge` muestre su tabla de
efectividades anclada (`position-area` + `flip-block`), sin JS de
posicionamiento y con fallback estático.

### Decisión

- `TypeBadge` genera un anchor único por instancia (`useId` → nombre
  `--px-tip-*`) y monta el tip con `position-anchor` al mismo nombre;
  CSS (`TypeBadge.css`, tras `@supports (position-area: block-start)`)
  lo coloca en `block-start` con `flip-block`, centrado sobre el badge.
- Datos defensivos (Weak/Resists/Immune con multiplicadores en texto) vía
  `typeRelationsOptions` del documento compartido de tipo: fetch perezoso
  al primer hover, cacheado por tipo; tipos fuera del rail (`unknown`)
  no arman tip (evita un fetch condenado a 404).
- El tip vive en el top layer (`popover="manual"` mostrado en hover):
  el `overflow: hidden` de la card lo recortaba como hijo normal
  (verificado en screenshot); en top layer flota sin clip. Cero JS de
  posicionamiento — solo apertura/cierre.
- Accesibilidad deliberada: tip `aria-hidden` + `pointer-events: none`,
  badge fuera del tab order (sin nuevas paradas); la información es
  suplementaria — los matchups completos viven como texto en el panel del
  dossier. Sin soporte, el `title` estático sirve de fallback.
- Hallazgo técnico: `anchor-name` exige `<dashed-ident>` — sin prefijo
  `--` Chrome descarta la declaración en silencio (el tip caía al origen
  del viewport). Con valores `--px-tip-*` el `style` declarativo de React
  serializa con normalidad; documentado aquí para no repetir el error.

### Consecuencias

Vendor 347,53 kB / gzip 109,26 kB (red de tooltip: 0 fetches hasta el
primer hover; después 1 por tipo, compartido). Unit (4) + E2E
`type-tooltips.spec.ts` (5: hover live, flip sin overflow, tab-order,
fallback con `CSS.supports` neutralizado, reduced-motion) verdes.

### Alternativas consideradas

Tip como hijo posicionado normal (recortado por la card); badge enfocable
con tooltip en `focus-visible` (96 paradas de tab extra en el grid —
descartado por ergonomía de teclado).

---

## D-025 - Container queries en cards y tira evo (§7 P1-5)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P1-5 pide que la card responda a su contenedor (no al
viewport). Baseline Widely available: sin `@supports`; el base
narrow-first es el fallback.

### Decisión

- `container-queries.css` (puro CSS, cero TSX): `card-cell` sobre celdas
  del explorer/shelf/lab → card horizontal (cámara + identidad lado a
  lado) en celdas ≥26rem; `evo-strip` sobre la tira de estadios → nodo
  solitario en showcase horizontal en strips ≥60rem.
- `.explorer-grid`: `auto-fill` → `auto-fit` (idéntico a volumen; con
  pocos resultados las celdas se estiran en vez de dejar tracks vacíos —
  es lo que habilita la card horizontal en el shelf).
- Los grids internos de paneles (related/sprites) ya eran intrínsecamente
  responsivos (`auto-fill`/`auto-fit`): verificados, sin cambios.
- Medición que evitó un error: el ancho de estadio NO separa contextos
  (mobile apilado 22.4rem vs desktop-3col 22.8rem, indistinguibles); el
  primer diseño (umbral 30rem por estadio) rompía Eevee desktop y se
  sustituyó por el strip (48rem vs 70rem, separación limpia). Los nodos
  conservan el media de viewport V1.
- `container-queries.css` carga ÚLTIMO en `main.tsx`: a igual
  especificidad sus reglas deben ganar a los estilos base (un orden
  anterior rompió la card horizontal; verificado en E2E).

### Consecuencias

Vendor 347,53 kB / gzip 109,27 kB (solo CSS). E2E
`container-queries.spec.ts` (6: shelf horizontal/vertical, strip
estrecho V1, showcase solitario ancho/estrecho, reduced-motion).

### Alternativas consideradas

Umbral por ancho de estadio (descartado por la medición §anterior:
22.4rem vs 22.8rem inseparables).

---

## D-026 - `:has()` para estados sin JS de padre (§7 P1-6)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P1-6 pide que los contenedores reaccionen a estados
(`:has()`), eliminando JS que añade clases al padre. En este repo no hay
tal JS (el shiny del dossier vive en la URL, sin estado React): la
ganancia es no añadirlo nunca — la reacción es declarativa.

### Decisión

- `state-has.css` (puro CSS, cero TSX, Widely available → sin `@supports`;
  sin soporte queda el aspecto V1):
  - `.scanner-chamber:has(.scanner-variant > :last-child[aria-pressed='true'])`:
    borde, halo y saturación del artwork cuando el shiny está en cámara
    (el toggle Shiny es el último botón del grupo; su `pressed` ES el
    estado, semántica nativa, sin marcado extra).
  - `.explorer-filter-group:has(... .px-chip:not(:first-child)[aria-pressed='true']) > legend`:
    la leyenda se acentúa con filtro real ("All" no cuenta).
  - `.explorer-search:has(input:not(:placeholder-shown))`: etiqueta y
    borde activos mientras filtra.
- Sin motion implicado: reduced-motion trivialmente satisfecho.

### Consecuencias

Vendor 347,53 kB / gzip 109,26 kB (solo CSS). E2E `state-has.spec.ts`
(4: cámara STD↔SHN reversible, leyenda, búsqueda, reduced-motion).

### Alternativas consideradas

`data-shiny` renderizado por React en la cámara; descartado — duplica en
markup lo que `aria-pressed` ya expresa.

---

## D-027 - Command palette a mano con panel lazy (§7 P1-7)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P1-7 pide quick jump Ctrl+K construido a mano sobre el
índice existente, con popover+anchor, ranking propio y E2E de teclado —
sin dependencias nuevas.

### Decisión

- `domain/palette/ranking.ts` puro y testeado (id exacto > prefijo de id
  > nombre exacto > prefijo > substring, desempate por id, tope 8);
  > reutiliza `squashName` ("mr mime" funciona, cero lógica duplicada).
- `CommandPalette` (trigger eager en el header: botón ⌕ Jump + Ctrl K,
  también en mobile donde no hay teclado) + `CommandPalettePanel` en
  `lazy()`: el panel (query del índice, ranking, listbox) carga al primer
  intento. Contrato listbox completo (flechas cíclicas, Enter, Esc nativo,
  `aria-activedescendant`, prefetch del resaltado, retorno de foco al
  trigger, query vacía = acciones: explorer/compare/favorites/team +
  surprise-me).
- Panel `popover=auto` anclado al trigger (`block-end` + flip) con fallback
  centrado sin anchor; navegación por `goWithTransition` (crossfade
  coherente con P0-1).
- Presupuesto (medido, no estimado): la primera versión eager sumaba
  +22,9 kB al entry (arrastraba toda la capa API); con el split el entry
  queda en 349,01 kB / gzip 109,73 (+1,5/+0,5: solo el trigger) y el
  panel viaja en chunk propio de 4,08 kB bajo demanda. Se acepta el
  +1,5 kB por el trigger global (mobile lo necesita: sin botón no hay
  palette táctil).

### Consecuencias

E2E `palette.spec.ts` (8: salto exacto, teclado puro, tolerancia,
acciones, Esc+foco, fallback sin anchor, mobile, reduced-motion).

### Alternativas consideradas

Librería de command palette (descartada: D-019/dependencias); trigger
solo-teclado sin botón (descartado: excluye táctil).

---

## D-028 - `useOptimistic` en favoritos/team (§7 P1-8)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P1-8 pide feedback instantáneo en toggles vía
`useOptimistic` (React 19). Matiz honesto: los toggles YA eran
instantáneos (estado local); el valor real del cambio es semántico —
persistencia como transición asíncrona con rollback ante fallo, en vez
de escritura silenciosa en efecto que podía divergir de la UI sin
avisar (cuota/modo privado).

### Decisión

- Ambos providers: `committed` + `useOptimistic(committed, (_, next) =>
next)` + `startTransition(async persist → setCommitted)`; `baseRef`
  como base viva para toggles encadenados durante un vuelo.
- Nuevo `persistCollection` (aditivo en `storage.ts`, no toca lo
  existente): rechaza si el storage falla; el `catch` revierte la ref y
  publica `persistError` (nuevo campo de ambos contextos) con alerta
  `role="alert"` en TeamAddButton y páginas de colección.
- Validación de team (full/duplicate) sigue síncrona y previa; cross-tab
  sync intacto (último escritor gana, como en V1).

### Consecuencias

Vendor 349,76 kB / gzip 109,90 (+0,75/+0,2: lógica de providers).
Unit 100/100 (2 rollback con cuota simulada + `persistCollection`);
E2E collections 4/4 (persistencia, cap-6, cross-tab) + axe/keyboard
verdes; dossier con colecciones sin cambios visuales.

### Alternativas consideradas

Dejar el `useState`+efecto (descartado: el item pide el patrón
optimista y el rollback ante cuota es mejora real de robustez).

---

## D-029 - Numerales fluidos sí, variable-font no (§7 P1-9)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P1-9 pide numerales cinéticos con `clamp()` y
transiciones de peso/variable-font, SOLO si no rompe el budget de
fuentes. Verificación previa obligatoria.

### Decisión

- Presupuesto medido: el proyecto sirve **0 bytes de fuentes** (sin
  `@font-face`, sin CDN, sin woff/woff2 en `src/`, `index.html` ni
  `public/`; las pilas `Space Grotesk/Inter/JetBrains Mono` resuelven a
  fallbacks del sistema). Una variable-font real exigiría ~25–100 kB
  descargados + `preload`/FOUT con riesgo de CLS en el propio numeral
  del hero: rompe el budget. **Slice descartado con esta evidencia.**
- Slice implementado: `clamp()` fluido en numerales (watermark de card
  `clamp(2.6rem, 2rem + 4vw, 4.2rem)`, `.dossier-id` y
  `.scanner-readout` fluidos; desktop conserva la voz V1 exacta). Cero
  bytes, estable en layout (sin swap → sin CLS), sin motion (reduced
  motion trivial).
- La escala display/title/heading ya era fluida desde RC1; esto cierra
  la familia numeral.

### Consecuencias

Vendor 349,76 kB / gzip 109,89 (solo CSS). E2E
`kinetic-numerals.spec.ts` (3: fluidez 390<1440 con desktop exacto V1,
legibilidad, reduced-motion).

### Alternativas consideradas

Self-host de Space Grotesk variable + `font-display: swap`
(descartado: peso + FOUT/CLS + tercera parte/archivo nuevo por un
adorno tipográfico).

---

## D-030 - Speculation Rules descartado en SPA (§7 P2-10)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P2-10 propone prerender same-origin como progresiva del
prefetch hover/focus. P2 = "explorar con budget estricto": la
exploración concluye que el mecanismo no transfiere a esta arquitectura.

### Decisión

Descartar sin enviar ningún byte, con evidencia:

1. **Sin activación posible:** los clics internos son navegaciones del
   mismo documento (router `pushState`, probado por el E2E de round-trip
   explorer↔dossier que preserva estado) — un documento prerenderizado
   jamás se activa. El beneficio del prerender (activación
   cross-document instantánea) no puede materializarse.
2. **Cobertura existente:** el prefetch hover/focus de TanStack ya
   calienta datos + chunks compartidos (card→dossier medido en 131 ms
   en build). Una regla en modo `prefetch` solo calentaría el
   `index.html`, idéntico en todas las rutas y ya cacheado: ganancia
   cero medible.
3. **Coste real y dañino:** cada prerender arrancaría una copia completa
   de la app (JS + datos de detalle por card hovereada) — ráfagas
   especulativas contra la disciplina fair-use/anti-throttling del
   proyecto (`prefetch limitado`, nunca mass crawling) y contra
   batería/datos en navegación con puntero.
4. "Solo Chromium / nunca dependencia" se cumpliría trivialmente, pero
   el item exige una MEJORA — ninguna es medible.

### Consecuencias

Cero cambios de código, cero bytes, cero requests nuevas. El prefetch
selectivo actual queda como mecanismo único (documentado en RC2/RC7).

### Alternativas consideradas

Enviar reglas en modo `prefetch` "por si acaso" (descartado: script
muerto que sugiere un beneficio inexistente y cuesta revisión).

---

## D-031 - Canvas 2D de ambiente descartado (§7 P2-11)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

El backlog §7 P2-11 permite un canvas 2D mínimo SOLO con medición que
pruebe CSS insuficiente (+ DPR capado + pausa fuera de viewport + kill
con reduced-motion); D-019 pone la carga de la prueba en quien lo
proponga, y si no se justifica manda registrar evidencia y no hacerlo.

### Decisión

Descartar sin construir, con evidencia:

1. **Sin efecto objetivo:** el backlog no nombra ningún ambiente
   concreto que CSS no exprese; todo lo visible (halos por tipo, foil,
   retícula scanner, parallax, reveals, morphs) es CSS verificado en
   10 rondas de screenshots desktop+mobile.
2. **Coste en reposo medido: cero.** Auditoría §2:
   `document.getAnimations() = 0` en reposo; el único `rAF` del árbol
   es el tilt de puntero (por evento, sin loop). Cualquier canvas, por
   capado que esté, convierte el reposo en coste permanente (> 0
   frames, memoria DPR, ciclo de vida pausa/reanudación + kill-switch +
   tests) a cambio de decoración.
3. **Identidad ya cubierta:** la identidad por tipo vive en atmósfera
   estática (halos, foil, badges con texto) legible con reduced-motion;
   partículas añadirían movimiento-sin-función contra AGENTS.md (cada
   efecto debe servir a jerarquía, feedback, orientación o identidad —
   ya servidas).
4. **Budget sin margen decorativo:** vendor 349,76 kB / gzip 109,90
   tras P1-7/8; cada kB cuenta y este no compra función.

### Consecuencias

Cero cambios de código. La política CSS-first (D-019) queda
re-revalidada para ambiente; si un efecto futuro lo exige, esta
decisión documenta el listón (medición contra CSS + DPR + pausa +
reduced-motion).

### Alternativas consideradas

Construir un canvas mínimo para "medir después" (descartado: invierte
la carga de la prueba y envía peso igualmente).

---

## D-032 - Alias `/evolution/pokemon/:idOrName` con redirect canónico (§6.1)

**Fecha:** 2026-10-09
**Estado:** aceptada

### Contexto

La auditoría §6.1: `/evolution/:id` es chain ID, así que
`/evolution/133` es Poochyena (chain #133), no Eevee (#133) — hallazgo
de descubribilidad. Opciones del §6.1: aceptar Pokémon ID resolviendo
a su chain, o renombrar a `/evolution/chain/:chainId`.

### Decisión

Alias aditivo + redirect canónico, sin renombrar nada:

- Nueva ruta lazy `/evolution/pokemon/:idOrName`
  (`EvolutionResolverPage`, chunk propio 1,23 kB): resuelve el
  espécimen vía el dossier-query existente (`species.evolutionChainId`,
  sin lógica nueva) y redirige con `replace` a `/evolution/:chainId`.
  Inválidos → error recuperable con retry; sin cadena registrada →
  estado vacío con vuelta al dossier.
- `/evolution/:id` sigue siendo chain ID canónico: enlaces del dossier,
  URLs compartidas y E2E existentes no cambian de forma.
- El estado vacío de cadena desconocida ahora anuncia el alias
  (`/evolution/pokemon/133`).

### Consecuencias

Vendor 350,07 kB / gzip 109,98 (+0,3 por la tabla de rutas; resolver
lazy). E2E en `evolution.spec.ts` (4 nuevos: id 133→chain 67, nombre,
cadena unitaria, inválido recuperable).

### Alternativas consideradas

- Parámetro inteligente en `/evolution/:id` (chain o Pokémon según
  exista): descartado — los rangos se solapan (67 = chain Eevee y a la
  vez id Machoke), comportamiento mágico e impredecible.
- Renombrar a `/evolution/chain/:chainId`: descartado — rompe URLs
  compartidas y E2E fijados sin aportar nada que el alias no dé.

---

## Plantilla

```md
## D-XXX - Título

**Fecha:**
**Estado:** propuesta | aceptada | reemplazada

### Contexto

### Decisión

### Consecuencias

### Alternativas consideradas
```
