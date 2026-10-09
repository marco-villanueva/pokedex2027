# PROGRESS

## Estado global

RC8 Showcase Release completo y validado con evidencia. La aplicación es
producción-lista según la Definición de Done (§66): RC0–RC8 cerrados,
gates verdes, documentación al día.

## Backlog auditoría §7 + §6.1 (completo, 2026-10-09)

Fase activa: **completo** — §7 11/11 + §6.1 verificados (ver Cierre global).

### Completado

- [x] §7 P0-1 View Transitions SPA morph card→dossier (D-021):
      `TransitionLink` + pares `pokemon-art-<id>` / `pokemon-numeral-<id>`,
      crossfade resto, feature-detect + skip con reduced-motion,
      `@view-transition navigation: auto` progresivo. Gates: `tsc`, `eslint`,
      `prettier`, `vitest` (83), `build` (vendor 347,52 kB / gzip 109,25 kB)
      limpios; E2E `view-transitions` (2) + detail/smoke/explorer (19) +
      reduced-motion/evolution (5) + axe (10) verdes; visual 1440+390 sin
      overflow ni errores de consola.
- [x] §7 P0-2 scroll-driven reveals (D-022): `scroll-reveals.css` puro CSS
      (`@supports (animation-timeline: view())`, visible por defecto) para
      `.explorer-grid > li`, `.dossier-panels .panel` + parallax contenido
      de `.scanner-art`; reveal solo-transform (nunca opacity) tras
      hallazgo axe con el fade 0→1. Gates: `tsc`, `eslint`, `prettier`,
      `vitest` (83), `build` (vendor/gzip sin cambios) limpios;
      E2E `scroll-reveals` (3) + axe 10/10 (×2 en dossier) +
      reduced-motion + `view-transitions` (3) verdes; visual mid-scroll
      1440+390 sin overflow ni errores de consola.
- [x] §7 P0-3 popover nativo + `@starting-style` (D-023): `HelpPopover`
      (popovertarget, cero JS) para leyenda de matchups + ayuda de filtros;
      `AbilityRows` a popover por fila con fetch on-demand vía `toggle`;
      fallback `<details>` verificado con la API extirpada. Gates: `tsc`,
      `eslint`, `prettier`, `vitest` (85), `build` (vendor 347,56 kB /
      gzip 109,28 kB) limpios; E2E `popover` (5) + detail (9) + axe (10)
      verdes (locator `4×` de detail acotado a `.matchup-group`); visual
      1440+390 con popovers abiertos, sin overflow ni errores.
- [x] §7 P0-4 anchor tooltips en `TypeBadge` (D-024): tip defensivo en
      texto por badge (anchor único, `position-area: block-start` +
      `flip-block`, fetch perezoso al hover por documento compartido);
      top layer `popover=manual` (el `overflow` de la card lo recortaba);
      `aria-hidden`, fuera del tab order, `title` sin soporte; hallazgo:
      `anchor-name` exige `--`-prefijo. Gates: `tsc`, `eslint`,
      `prettier`, `vitest` (89), `build` (vendor 347,53 kB / gzip
      109,26 kB) limpios; E2E `type-tooltips` (5) + axe (10) verdes;
      visual 1440+390 con tooltip anclado, sin overflow ni errores.
- [x] §7 P1-5 container queries (D-025): `container-queries.css`
      (card-cell → card horizontal ≥26rem; evo-strip → nodo solitario
      horizontal ≥60rem) + `.explorer-grid` a `auto-fit`; grids de paneles
      ya intrínsecos, sin cambios; medición descartó el umbral por estadio.
      Gates: `tsc`, `eslint`, `prettier`, `vitest` (89), `build` (vendor
      347,53 kB / gzip 109,27 kB) limpios; E2E `container-queries` (6) +
      regresión explorer/collections/evolution (14) + axe (10) verdes;
      visual 1440+390 (shelf horizontal, evo lineal, mobile V1 intacto).
- [x] §7 P1-6 `:has()` para estados (D-026): `state-has.css` puro, cero
      TSX (cámara↔shiny reversible, leyenda con filtro real, búsqueda
      activa). Gates: `tsc`, `eslint`, `prettier`, `vitest` (89),
      `build` (vendor 347,53 kB / gzip 109,26 kB) limpios;
      E2E `state-has` (4) + axe (10) verdes; visual 1440+390 (cámara SHN),
      sin overflow ni errores.
- [x] §7 P1-7 command palette Ctrl+K (D-027): ranking propio testeado +
      trigger eager con panel lazy (entry 349,01/gzip 109,73; panel
      4,08 kB bajo demanda), listbox completo con prefetch. Gates: `tsc`,
      `eslint`, `prettier`, `vitest` (96), `build` limpios;
      E2E `palette` (8) + axe (10) verdes; visual 1440+390, sin overflow
      ni errores.
- [x] §7 P1-8 `useOptimistic` (D-028): providers con `committed` +
      optimista + transición y rollback ante cuota (`persistError` con
      alerta); validación team intacta. Gates: `tsc`, `eslint`,
      `prettier`, `vitest` (100), `build` (vendor 349,76 kB / gzip
      109,90) limpios; E2E collections (4) + axe/keyboard verdes;
      dossier sin cambios visuales.
- [x] §7 P1-9 numerales (D-029): `clamp()` fluido en watermark,
      `.dossier-id` y `.scanner-readout` (cero bytes, sin CLS); slice
      variable-font descartado con evidencia (0 bytes hoy vs 25–100 kB +
      FOUT/CLS). Gates: `tsc`, `eslint`, `prettier`, `vitest` (100),
      `build` (vendor 349,76 kB / gzip 109,89) limpios;
      E2E `kinetic-numerals` (3) + axe/detail verdes; visual 1440+390.
- [x] §7 P2-10 Speculation Rules (D-030): **descartado con evidencia**
      (el prerender jamás se activa en SPA same-document; prefetch actual
      131 ms; ráfagas especulativas romperían fair-use). Cero cambios de
      código, cero bytes; smoke verde como constancia.
- [x] §7 P2-11 canvas 2D (D-031): **descartado con evidencia** (sin
      efecto objetivo que CSS no exprese; reposo medido en 0 animaciones;
      identidad por tipo cubierta en estática; budget sin margen).
      Cero cambios de código.
- [x] FASE D §6.1 alias evolution (D-032):
      `/evolution/pokemon/:idOrName` resuelve id/nombre a su chain con
      redirect canónico (133→67 verificado); ruta chain intacta, dossier
      y URLs sin cambios. Gates: `tsc`, `eslint`, `prettier`, `vitest`
      (100), `build` (vendor 350,07 kB / gzip 109,98; resolver lazy
      1,23 kB) limpios; E2E `evolution` (8: 4 alias nuevos) + axe (10)
      verdes; visual 1440+390, sin overflow ni errores.

### En progreso

- Ninguno — objetivo completo (ver Cierre global abajo).

### Pendientes

- Ninguno: §7 (11/11 hechos o descartados con evidencia) + §6.1
  (alias evolution) completos.

### Siguiente acción recomendada

Mantener verde: re-certificar suites tras cualquier cambio futuro. No
reabrir alcance sin decisión registrada.

## Cierre global del objetivo backlog §7 + §6.1 (2026-10-09)

- §7: P0-1 View Transitions morph (D-021), P0-2 scroll reveals (D-022),
  P0-3 popover+`@starting-style` (D-023), P0-4 anchor tooltips (D-024),
  P1-5 container queries (D-025), P1-6 `:has()` (D-026), P1-7 palette
  Ctrl+K (D-027), P1-8 `useOptimistic` (D-028), P1-9 parcial
  clamp+descarte variable (D-029), P2-10 Speculation descartado (D-030),
  P2-11 canvas descartado (D-031). §6.1: alias evolution (D-032).
- Gates finales: `tsc`, `eslint`, `prettier`, `vitest` 100/100,
  `build` (vendor 350,07 kB / gzip 109,98) limpios.
- E2E completa: **100/100 verdes** (`workers: 2`; las 2 de vitals
  medidas contra preview `:4173` según su procedimiento).
- Vitals producción (`dist/` en `:4173`): explorer LCP 568 ms /
  CLS 0,010; dossier LCP 552 ms / CLS 0,010 — sin regresión.
- Axe 10/10 en rutas tocadas; desktop 1440 + mobile 390 sin overflow
  ni errores de consola/red en cada item.
- "No recomendado": nada implementado (sin three.js/WebGL, sin
  librerías de animación, sin cursor custom, sin modo claro, sin
  dependencias nuevas, sin `any`).

## Siguiente acción recomendada (V1)

Mantener el release verde: re-certificar suites tras cualquier cambio,
vigilar deriva documento/código y no reabrir alcance V1 sin decisión registrada.

## Auditoría navegador debugger (2026-10-09)

- Barrido CDP completo (Chrome 155, `:9222` + dev `:5173`): 8 rutas desktop
  - 8 mobile 390 sin errores de consola/pageerror y sin overflow.
- Deep-links verificados: filtros+orden, `?shiny=1`, compare con lado
  inválido (Clear+Retry por lado), dossier inexistente con retry, Ditto sin
  cadena, Eevee chain #67 con 9 especímenes.
- Hallazgo menor: `/evolution/:id` es chain ID (`/evolution/133` = Poochyena,
  no Eevee); documentado en el estado vacío, sin rotura. Posible alias por
  Pokémon ID como backlog (requiere decisión, no se toca).
- Falso positivo descartado: related/evolution usan `alt=""` decorativo
  correcto dentro de links con `aria-label`.
- Gates: `tsc`, `eslint`, `vitest` (79), `build` (vendor 347 kB / gzip 109 kB)
  limpios. Táctil 390: 0 targets bajo 24px.
- Artefacto: `docs/AUDIT_2026-10-09_BROWSER.md`.
- Mejoras backlog (research 2026-10-09, §7 de la auditoría): P0 View
  Transitions morph, scroll-driven reveals, popover+`@starting-style`,
  anchor tooltips; P1 container queries, `:has()`, command palette,
  `useOptimistic`; no-WebGL/no-libs explícitos. Nada implementado (V1
  cerrada, requiere propuesta SDD).

## README + legal (2026-10-09)

- README reescrito en inglés: proyecto clásico de aprendizaje potenciado
  por IA, comandos, 3 capturas, composición del proyecto, cómo estudiarlo,
  autor (Marco Villanueva) y licencia MIT (`LICENSE`).
- `.gitignore` completado (`coverage`, `*.tsbuildinfo`, `.env*`).

## Fix cuadrado hover en dossier (2026-10-09)

- Bug: en el dossier, con mouse over aparecía un cuadrado cálido de bordes
  duros tras el artwork. Causa: las capas foil/spec de `HolographicSurface`
  (`inset: 0`, `opacity: 1` en `:hover`) son una caja cuadrada flotando sobre
  la cámara. Reproducido por CDP (hover on/off con screenshots).
- Fix mínimo en `DetailPage.css`: máscara radial feathered
  (`circle closest-side, black 58%, transparent 82%`) solo sobre
  `.scanner-holo .px-holo-foil/.px-holo-spec`. El sheen ahora es un halo
  circular acorde al scanner ring; el artwork queda intacto. También cubre
  el sheen estático de touch (`opacity: 0.35`).
- Verificado: hover activo (`:hover: true`, foil `opacity: 1`) sin cuadrado a
  1440 y 390, 0 overflow, 0 errores consola. `tsc`, `eslint`, `prettier`,
  `vitest` (79), `build` limpios.

## RC activo

RC8 - Showcase Release (RC7 completo y cerrado con evidencia)

## Cierre RC7 — evidencia (2026-10-07)

- Bundle: `motion`+`three`/`fiber`/`drei` eliminados (D-019); `FadeIn` a CSS puro; chunk entrada 122 kB → 0,19 kB; vendor 347 kB (gzip 109 kB); `sourcemap: false` en prod.
- Vitals en build prod: explorer LCP ~0,54s / CLS 0,010 (era 0,16 → skeleton cells in-grid); dossier LCP ~0,5s / CLS 0,058.
- Caché verificado: revisitas sin refetch; unificado documento de tipo (roster+relations, 1 fetch por tipo).
- a11y: axe wcag2a+wcag2aa 9/9 rutas limpias; contraste AA; teclado; reduced-motion.
- Cross-browser: Chromium + Chrome 155 críticos verdes; Firefox/WebKit no instalables (caché pre-seed read-only) — baseline evergreen documentada (oklch/color-mix/nesting 2023+; backdrop-filter progresivo).
- Lighthouse CLI bloqueado por sandbox (interstitial en headless); sustituido por axe + vitals medidos + contraste.
- `tsc`, `eslint`, `prettier`, `vitest` (76), `build`: limpios. `playwright`: 50 verdes + 1 flaky live-API sanado.

## Cierre RC6 — evidencia (2026-10-07)

- Auditoría handheld completa: 0 targets bajo 24px en 6 rutas (medido a 390); controles primarios a 44px (Button, chips, nav, inputs, selects, favorites, team arrows, stepper/context links).
- Safe areas: `env()` insets en header/main/footer con `viewport-fit=cover`.
- Header mobile a dos filas con nav táctil; rails, compare, team, favorites verificados a 390.
- Efectos: sin WebGL en el árbol (política CSS-first); holo estático en touch; loops CSS detenidos con reduced-motion — nada que recortar.
- E2E: 39 verdes + 1 flaky live-API sanado en retry; `test.setTimeout(120s)` en ventana infinita (el timeout de test, no el expect, era el flake).

## Cierre RC5 — evidencia (2026-10-07)

- Compare `/compare?left=&right=`: combobox accesible (listbox + teclado), tabla semántica con deltas y veredicto en texto, swap, surprise-me, recarga reconstruye.
- Favorites shelf y Team bench (6 slots, reorder, composición por tipos, disband) con persistencia versionada.
- `tsc`, `eslint`, `prettier`, `vitest` (76), `build`: limpios.
- `playwright`: **39 verdes + 1 flaky live-API sanado en retry** (5 compare/collections nuevos).
- Compare, Team y compare-mobile revisados visualmente.
- Criterios de salida RC5 cumplidos: compare por URL, persistencia versionada, team usable en mobile, sin cuentas.

## Cierre RC4 — evidencia (2026-10-07)

- Árbol `/evolution/:id` por estadios (D-016), ramas, condiciones, nodos navegables con prefetch; preview en dossier.
- Descubrimiento: Matchups defensivos (2×/4×/½×/¼×/0× con texto, dual calculados), habilidades expandibles on-demand (`/ability`), Related strip determinista + `Browse all`, generación enlazada al explorer (D-017).
- `tsc`, `eslint`, `prettier`, `vitest` (57), `build`: limpios.
- `playwright`: **32 verdes** (3 discovery: matchups, abilities, related+generation).
- Dossier Charizard completo revisado: matchups, related, habilidades, cadena, sprites.
- Criterios de salida RC4 cumplidos: cadenas complejas, responsive, navegación accesible, condiciones entendibles, no-linealidad real.

## Cierre RC3 — evidencia (2026-10-07)

- Dossier completo: scanner hero con retícula + holographic + entorno por tipo, shiny con URL y fallback, stats (StatBar), biometría (DataLabel), especie, flags, habilidades, galería de sprites (pixel, shiny-aware), stepper prev/next con prefetch, preview de evolución ramificada navegable, entrance `FadeIn` con reduced-motion.
- `tsc`, `eslint`, `prettier`, `vitest` (44), `build`: limpios.
- `playwright`: **25 verdes** (4 detail: shiny×2, sprites, evolución; timeout 45s en filtro tipo por throttling live).
- Dossiers Eevee/Bulbasaur/Charizard/Gengar/Pikachu revisados a 1440 y 390.
- Criterios de salida RC3 cumplidos: carga progresiva, hero usable sin WebGL, reduced-motion, sin CLS severo, prev/next rápido, imágenes con fallback.

## Cierre RC2 — evidencia (2026-10-07)

- Explorer completo: índice canónico (1 petición), búsqueda global, filtros tipo/generación, orden, URL compartible, scroll infinito acotado (48), prefetch hover/focus, round-trip a detalle preserva estado.
- Red a volumen (480 cards, build prod): 1 índice + 480 detalles únicos, **0 duplicados**, sin waterfall; imágenes lazy (~47MB solo tras scrollear 480 artworks — uso, no patología).
- Rails mobile: fades de scroll, targets 44px, verificado a 390 sin overflow.
- `tsc`, `eslint`, `prettier`, `vitest` (41), `build`: limpios.
- `playwright`: **21 verdes ×2 consecutivas** (tras `retries: 1` + timeout 60s en ventana infinita por throttling transitorio de la API live).
- Criterios de salida RC2 cumplidos: URL compartible, búsqueda robusta, scroll estable, teclado funcional, mobile completo.

## Cierre RC1 — evidencia (2026-10-07)

- Primitivas: Button, TypeBadge, SearchField, FilterChip, DataLabel, StatBar, HolographicSurface, ScannerRing — con estados, tests y reduced-motion.
- `PokemonCard` con identidad deliberada (tilt/foil/parallax/watermark/instrumentación); type-driven themes en 18 tipos vía `data-type`.
- Estudios Fire/Water/Grass/Electric/Psychic/Ghost con especímenes reales en `/lab`.
- Motion tokens definidos y documentados (`tokens.css`).
- `tsc`, `eslint`, `prettier`, `vitest` (31), `build`: limpios.
- `playwright`: 15 verdes (smoke 3, runtime 2, responsive 6, reduced-motion 1, keyboard 2, contrast 1).
- Contraste AA verificado en pares sólidos; navegación por teclado con focus visible verificada; cero overflow 360→1440.

## Completado

- [x] definición de producto;
- [x] dirección visual inicial;
- [x] arquitectura objetivo;
- [x] modelo de datos inicial;
- [x] estrategia PokéAPI;
- [x] estrategia de motion y 3D;
- [x] roadmap;
- [x] quality gates;
- [x] presupuesto de performance;
- [x] accesibilidad;
- [x] testing;
- [x] decisiones iniciales;
- [x] crear Vite + React + TypeScript;
- [x] configurar ESLint;
- [x] configurar Prettier;
- [x] configurar Vitest;
- [x] configurar React Testing Library;
- [x] configurar Playwright;
- [x] instalar router;
- [x] instalar TanStack Query;
- [x] crear estructura;
- [x] crear API client;
- [x] crear DTOs;
- [x] crear domain models;
- [x] crear mappers;
- [x] crear query keys;
- [x] implementar listado mínimo;
- [x] implementar detalle mínimo;
- [x] configurar error boundary;
- [x] configurar estilos base;
- [x] typecheck estable;
- [x] lint estable;
- [x] 23 unit/component tests en verde;
- [x] production build estable con code-splitting por ruta.

## En progreso

Ninguno — objetivo completo (ver Cierre RC8).

## Revisión independiente post-release (2026-10-07)

- Barrido §67: lab, 404, estados vacíos, copy, consola (cero errores).
- Hallazgo: empty-team prometía “let fate decide” sin feature asociada → copy corregido a la acción real.
- Gates tras el fix: `tsc`, `eslint`, `prettier`, `vitest` (76), `build` limpios; smoke E2E 6 verdes.
- Artefacto release: 22 flujos críticos (smoke/detail/collections/compare/evolution) verificados contra el build de producción en preview (22/22).
- Rebuild post-cambios (client sanitizado, NotFound, configs): preview sirve el hash vigente; smoke 6 verdes.
- Re-confirmación final: `tsc`, `vitest` (76), `build` y `playwright` **51/51 limpias sin flakes** sobre el workspace actual.
- Auditoría de dependencias: `npm audit` → 0 vulnerabilidades.
- Re-verificación axe post-release (9/9) y floor táctil 24px (0 bajo el umbral en 3 rutas).
- Auditoría README vs workspace: conteos (76 unit, 50+ E2E), scripts y estructura verificados — sin deriva.
- Barrido de integridad de rutas: 14 rutas renderizan sin errores de consola; 6 destinos de navegación resuelven.
- Cold-load de deep links (filtros+orden, shiny, compare, árbol): 4/4 renderizan sin pageerrors.
- Back desde dossier restaura explorer filtrado (URL + 48 cards eléctricas).
- Latencia de interacción en build producción: card→dossier 131ms, filtro→URL 329ms.
- Suite E2E completa post-cambios: 53/53 verdes (1.6 min).
- Re-certificación post-404/headings: tsc+lint+76 unit+build OK; suite E2E 54/54 verdes.
- Outline de headings auditado: salto H1→H3 en cards del explorer → corregido a H2; sin saltos en 7 rutas.
- 404 rediseñado (numeral fantasma, ticks de instrumento, acción primaria); verificado 1440+390, release reconstruido.
- Axe ampliado a 10 rutas (incluye 404 rediseñado): 10/10 sin violaciones.
- Dossier pending rediseñado: esqueleto que replica la geometría del hero (chamber + identidad + paneles) con el shimmer compartido; 16/16 regresión (detail/smoke/responsive).
- Re-certificación post-skeleton: build OK; suite 55/55 (un flake transitorio de API viva en una pasada, verde al retry y 55/55 limpios en repetición).
- Higiene de errores en outage: los mensajes exponían URLs crudas de API (§39) → saneados en `client.ts`; gate permanente `e2e/outage.spec.ts`.
- Sync cross-tab de favoritos verificado en vivo (storage event → estado sin recarga); test permanente en `collections.spec.ts`.
- Responsive endurecido: 9 rutas × 6 viewports en estado loading Y settled (antes solo loading).
- Despliegue: verificados deep-links SPA en preview; añadidos `public/_redirects` (Netlify) y `vercel.json`; sección Deployment en README; rebuild con artefactos release en `dist/`.
- Títulos por ruta (`usePageTitle` + `sectionTitle`): dossier dinámico (nombre + id), resto estático; pin E2E en smoke + unit del helper. Suite 56/56; unit 78/78.
- Dossiers límite verificados: Ditto sin cadena (sin errores) y Mewtwo con flag legendary; test permanente en detail.spec. Suite 57/57.
- Random-discovery ("Surprise me") con pin E2E en compare.spec. Suite 58/58.
- Stepper: next-link incondicional enlazaba al vacío en #1025; ahora se deshabilita como previous en #1 (tope `MAX_CANONICAL_ID`); test permanente. Suite 59/59.
- Búsqueda tolerante (§31): `applyExplorerFilters` ignora separadores ("mr mime", "farfetch'd" → slugs); unit + verificación live. Unit 79/79.
- El combobox de compare compartía el hueco; reutiliza `squashName` exportado (sin duplicar lógica). Compare 6/6.
- `?type=` inválido saneado a sin-filtro (sort/generation ya lo hacían); evita un fetch condenado. Unit + verificación live.
- Empty-state recovery verificado live: limpia query+tipo, restaura el grid.
- Compare con slug inválido verificado live: nombra el lado fallido, Clear por lado + Retry, lado válido intacto.
- Watermark de carta unificado a `formatPokedexId` (antes `padStart(3)` duplicado); verificado visual + explorer 6/6.
- `docs/assets/explorer.png` recapturado a 1440×900 con el build actual (watermark canónico).
- Deep-link `?shiny=1` verificado live: héroe shiny + toggle presionado al cargar directo.
- Full E2E 60/60 limpio tras el cambio de carta (cero flakes).
- Re-certificación 60/60 (ronda 221): árbol actual verde sin cambios.
- Re-certificación 60/60 (ronda 255): cero flakes, suite completa verde.
- Vitals re-medidos contra el preview de producción `:4173` (el `baseURL` de CI es dev `:5173`): budgets LCP/CLS verdes también en `dist/`.
- Tolerancia del combobox verificada en vivo ("mr mime" → opción Mr. Mime). Full suite 59/59 limpios.
- Combobox operable por teclado (flechas+Enter) con pin E2E en keyboard.spec. Suite 60/60.

## Cierre RC8 — evidencia (2026-10-07)

- Favicon propio (retícula + diamante), OG cover 1200×630 generada de la app, meta OG/Twitter/robots/theme-color.
- README reescrito (concepto, features, arquitectura, setup, testing, estructura, PokéAPI, a11y, perf, diseño) con 3 screenshots en `docs/assets/`.
- Revisión independiente: 0 TODOs, 0 `any`, 1 `console.error` legítimo; eliminados `PlaceholderPage`, `oxlint`, `icons.svg`.
- Suite: `workers: 3` tras diagnosticar throttling de Cloudflare bajo paralelismo total (51/51 en 47s); assertion de ventana infinita robusta (`>=`).
- Re-verificación final: `workers: 2` como punto estable (51/51 limpias en 1,1m, cero flakes); assertion de crecimiento abaratada (`>48`, 90s).
- `tsc`, `eslint`, `prettier`, `vitest` (76), `build`: limpios. `playwright`: **51 verdes**.
- `docs/MOTION_AND_3D.md` actualizado a V1 real (CSS-only + D-019).

## Pendientes RC8 (lanzamiento)

- [x] README final, metadata/OG/SEO, favicon, screenshots, QA final responsive/a11y/perf.

## Pendientes RC6 (alcance `ROADMAP.md`)

- [ ] ergonomía de pulgar y targets en filtros/compare/team;
- [ ] composiciones específicas mobile donde aporte;
- [ ] safe areas;
- [ ] canvas/efectos escalados (n/a: sin WebGL aún — verificar política CSS-first);
- [ ] sin overflow horizontal en todos los viewports (ya cubierto por spec permanente).

## RC5 iteración 1 — persistencia y acciones (2026-10-07)

**Completado**

- [x] `lib/storage`: colecciones versionadas con migración y fallback ante JSON/versión inválida (6 tests);
- [x] `team-rules` puras: máx 6, duplicados, reorder con bounds (4 tests);
- [x] `FavoritesProvider` + `TeamProvider` (Context, cross-tab sync, solo ids; D-018 sin Zustand);
- [x] `FavoriteButton` (SVG + `aria-pressed`) en cards (fuera del link) y dossier; `TeamAddButton` con estados full/duplicate;
- [x] `e2e/collections.spec.ts`: toggle→reload, add→reload, cap-6, malformed sin crash;
- [x] endurecido keyboard spec (timeout 30s tras filtrar).

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (72), `build`: limpios.
- `playwright`: 34 verdes + 1 flaky live-API que sana en retry (×2 runs).

## Pendientes RC5 (alcance `ROADMAP.md`)

- [ ] Compare lado a lado con URL (`/compare?left=6&right=9`);
- [ ] favorites persistidos y versionados;
- [ ] Team Builder (máx 6, add/remove/reorder, composición por tipos);
- [ ] random discovery;
- [ ] personalización local útil.

## RC4 iteración 1 — vista del árbol (2026-10-07)

**Completado**

- [x] ruta `/evolution/:id` (lazy, reemplaza placeholder): estadios por profundidad, artwork + tipos + condiciones por nodo, highlight implícito por contexto, prefetch en nodos;
- [x] `tiersOf`/`chainSpeciesIds` puros con tests (2 nuevos; 46 verdes en total);
- [x] `e2e/evolution.spec.ts`: 4 flujos (ramas Eevee, lineal Bulbasaur, dossier↔árbol, cadena inválida recuperable);
- [x] decisión D-016 registrada.

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (46), `build`: limpios.
- `playwright`: 29 verdes (28 + 1 flaky por carga que pasó en retry; keyboard estable 4/4 aislado).
- Árbol Eevee revisado a 1440 (columnas) y 390 (flujo vertical): condiciones explícitas, sin overflow.

## Pendientes RC4 (alcance `ROADMAP.md`)

- [ ] evolution tree visual + condiciones por nodo;
- [ ] soporte de ramas (ya modelado; falta vista);
- [ ] generation explorer;
- [ ] forms donde aporte;
- [ ] abilities detail;
- [ ] type effectiveness;
- [ ] related Pokémon (descubrimiento).

## RC3 iteración 1 — hero scanner + shiny (2026-10-07)

**Completado**

- [x] `scanner-chamber`: retícula `ScannerRing` tras artwork, `HolographicSurface` con parallax, entorno por tipo, readouts `#NNNN` + `STD/SHN`;
- [x] shiny toggle con URL (`?shiny=1`, `replace`, `aria-pressed`) + fallback con nota cuando no hay shiny archivado;
- [x] migración a primitivas: stats → `StatBar`, meta → `DataLabel` (se elimina CSS duplicado);
- [x] prefetch en stepper prev/next (hover/focus);
- [x] `e2e/detail.spec.ts`: swap de artwork por shiny + persistencia en URL + limpieza del param.

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (41), `build`: limpios.
- `playwright`: **23 verdes** (2 nuevos shiny).
- Heroes Charizard/Gengar/Pikachu revisados a 1440 y 390: retícula por tipo, segmentos Standard/Shiny legibles, mobile apilado con chamber protagonista.

## Pendientes RC3 (alcance `ROADMAP.md`)

- [ ] hero visual + entorno de tipo + scanner 3D-selectivo (CSS primero);
- [ ] shiny toggle (con fallback y URL);
- [ ] biometría, stats (StatBar), especie, descripción, legendario/mythical;
- [ ] habilidades, galería de sprites, navegación prev/next (existe, pulir prefetch);
- [ ] acceso a evolución (preparar RC4);
- [ ] animación de apoyo + composición responsive;
- [ ] E2E: render, shiny, prev/next, navegación a evolución, 404.

## RC2 iteración 2 — UI del explorer (2026-10-07)

**Completado**

- [x] reescritura `ExplorerPage`: búsqueda global, rails de tipo (18) y generación (9 con conteos), orden, todo en URL (`q/type/generation/sort`, `replace` sin spam de historial);
- [x] scroll infinito por `IntersectionObserver` (ventanas de 48, batch acotado de summaries) + botón `Show more` con restante;
- [x] estados: loading/empty con recuperación, error de índice y de roster con retry, errores parciales de batch con retry;
- [x] `e2e/explorer.spec.ts`: 6 flujos (búsqueda→URL, tipo→URL, generación+orden→reload, vacío→recuperar, ida/vuelta a detalle preserva estado, ventana infinita);
- [x] `smoke.spec.ts` actualizado (adiós paginación RC0);
- [x] grid mobile a 2 columnas (9.5rem) tras detectar 1 columna a 390.

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (41), `build`: limpios.
- `playwright`: 21 verdes (incluye 6 nuevos RC2; suite repetida 3× estable 18/18).
- Screenshots 1440 (`?type=fire` → 81 roster, 48 materialised) y 390 revisados: consola de filtros legible, rails con scroll interno sin overflow de página.

## RC2 iteración 1 — capa de datos del catálogo (2026-10-07)

**Completado**

- [x] endpoints `getPokemonIndex` (una petición) y `getType`;
- [x] `mapPokemonIndex` (canónico ≤ 1025, ordenado) y `mapTypeIds`;
- [x] `pokemonIndexOptions` + `pokemonTypeOptions` (D-015) y query keys;
- [x] dominio `explorer`: `GENERATIONS` (rangos 1–1025 sin huecos), `generationForId`, filtros puros (`parse`/`serialize`/`apply`), orden id/nombre ±;
- [x] tests: 10 nuevos (41 verdes en total);
- [x] decisión D-015 registrada.

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (41), `build`: limpios.

## Pendientes RC2 (alcance `ROADMAP.md`)

- [ ] búsqueda global por nombre/número con URL;
- [ ] filtros por tipo y generación con URL (`/pokedex?type=fire&generation=1&sort=id`);
- [ ] orden (id, nombre, …);
- [ ] scroll infinito o paginación escalable;
- [ ] skeletons/empty/error/retry finales;
- [ ] navegación por teclado en grid;
- [ ] prefetch selectivo + transición a detalle;
- [ ] validación de rendimiento con volumen significativo.

## RC1 iteración 2 — primitivas + card expresiva (2026-10-07)

**Completado**

- [x] `SearchField` (label, clear accesible, loading), `FilterChip` (`aria-pressed` + count + disabled), `DataLabel` (`dt`/`dd` en `dl`), `StatBar` (valor textual + barra redundante, tematizable por tipo);
- [x] `HolographicSurface`: tilt/foil/specular vía CSS vars escritas en rAF (cero `setState` por `pointermove`); fallback estático en touch y `prefers-reduced-motion`;
- [x] `ScannerRing`: retícula CSS pura (ticks + sweep), animación detenida con reduced-motion;
- [x] `PokemonCard` v2: cámara de artwork con grid + esquinas de instrumento, watermark numeral, parallax de artwork, foil por tipo;
- [x] `/lab`: secciones de primitivas + 6 estudios de especímenes (Charizard, Blastoise, Venusaur, Pikachu, Alakazam, Gengar);
- [x] `e2e/reduced-motion.spec.ts`: loops detenidos, contenido intacto;
- [x] tests: 31 verdes (5 nuevos de primitivas).

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (31), `build`: limpios.
- `playwright`: 12 verdes (3 smoke + 2 runtime + 6 responsive + 1 reduced-motion).
- Screenshots 1440/390: cards con identidad por tipo (glow ambiental, foil en hover), lab mobile apilado sin overflow.

## RC1 iteración 1 — sistema de tipos + primitivas (2026-10-07)

**Completado**

- [x] `src/app/styles/types.css`: tokens `--type-*` para los 18 tipos vía `data-type` (paleta mineral oklch, sin neón);
- [x] ruta interna `/lab` (lazy, fuera de nav principal, enlazada en footer);
- [x] `Button` (primary/secondary/ghost/icon + hover/focus/active/disabled/loading + reduced-motion);
- [x] `TypeBadge` (color + etiqueta + glifo; nunca solo color);
- [x] `PokemonCard` y dossier migran a `TypeBadge`; dossier expone `data-type`;
- [x] tests de primitivas (3 nuevos; total 26 verdes).

**Validación**

- `tsc`, `eslint`, `prettier`, `vitest` (26), `build`: limpios.
- `/lab` y `/pokedex` inspeccionados a 1440: matriz de 18 tipos legible, badges con identidad por tipo, sin overflow.

**Siguiente paso**

- Resto de primitivas RC1 + `PokemonCard` expresiva + tokens de motion; luego validación desktop/mobile/focus/reduced-motion/contraste para cierre RC1.

## Cierre RC0 — evidencia (2026-10-07)

- `npx tsc -b`: limpio.
- `npx eslint src --max-warnings 0`: limpio.
- `npx prettier --check .`: limpio.
- `npx vitest run`: 5 ficheros, 23 tests verdes.
- `npm run build`: estable (vendor 344 kB / gzip 108 kB; Explorer 8 kB; Detail 4.8 kB; chunks por ruta).
- `npx playwright test`: 11 verdes (3 smoke, 2 runtime consola/red, 6 responsive 360→1440).
- Consola: cero errores, cero pageerrors, cero requests fallidas genuinas (abortos StrictMode-dev filtrados y documentados en `e2e/runtime.spec.ts`).
- Visual: explorer + detalle inspeccionados a 1440 y 390; jerarquía clara, sin CLS, sin overflow tras corregir header-nav y skeleton-grid.
- Criterios de salida RC0 cumplidos: rutas listado + detalle funcionales, sin DTOs en UI, sin errores de consola.

## Pendientes RC1

- [ ] playground/ruta visual con Button, TypeBadge, SearchField, FilterChip, GlassPanel, DataLabel, StatBar, PokemonCard, HolographicSurface, ScannerRing;
- [ ] estados Fire, Water, Grass, Electric, Psychic, Ghost;
- [ ] motion tokens y validaciones (desktop, mobile, focus, reduced motion, contraste).

## Problemas conocidos

- Sin deuda funcional conocida. Búsqueda RC0 es local a la página (documentado como alcance RC0; búsqueda global en RC2).
- Nota de entorno: `/tmp` no persiste entre rondas y `PLAYWRIGHT_BROWSERS_PATH` apuntaba a una ruta efímera; los E2E deben correrse con el caché por defecto (`~/.cache/ms-playwright`, preinstalado).

## Siguiente acción recomendada

Ejecutar E2E smoke, inspeccionar consola/red, y cerrar RC0 formalmente antes de abrir RC1.

## Registro de iteraciones

### 2026-10-07 - Iteración 1 (RC0 Foundation)

**Objetivo**

Inicializar el repositorio y completar RC0 según `ROADMAP.md` y `ARCHITECTURE.md`.

**Cambios**

- Scaffold Vite + React 19 + TypeScript con alias `@`, code-splitting por ruta y chunks separados Explorer/Detail/queries.
- Capa API `src/api/pokeapi`: client con taxonomía de errores (network/not-found/service/malformed), DTOs mínimos, endpoints, mappers con tests, query keys centralizadas y hooks con `staleTime` 24h / `gcTime` 7d / sin retry en 404.
- Dominio `src/domain`: `PokemonDetails`, `PokemonSummary`, artwork fallback (official → home → dream → sprite + shiny), unidades, labels, árbol de evolución ramificado.
- Shell: `RootLayout` con landmarks + skip-link, `ErrorBoundary`, tokens base oklch, estilos base con `prefers-reduced-motion`, rutas `/pokedex`, `/pokemon/:idOrName`, placeholders RC4/RC5, 404.
- Explorer RC0: paginación por URL (`?page=`), batch acotado (24) de summaries con caché compartida, prefetch en hover/focus, búsqueda local por nombre/número, loading/empty/error/retry.
- Detail RC0: dossier con artwork reservado (sin CLS), tipos, biometría, stats accesibles con valor textual, habilidades, especie, stepper prev/next, 404 recuperable.
- Tests: 23 verdes (mappers, formato/unidades, artwork fallback, evolución ramificada, PokemonCard con roles).
- Docs: decisiones D-009 a D-012 registradas.

**Validación**

- `npx tsc -b`: limpio.
- `npx eslint src --max-warnings 0`: limpio.
- `npx vitest run`: 5 ficheros, 23 tests, todos verdes.
- `npm run build`: estable (vendor 344 kB / gzip 108 kB; Explorer 8 kB; Detail 4.8 kB).
- `npx prettier --check .`: limpio.
- Dev server `:5173/pokedex` responde 200; PokéAPI responde 200 en ~0.37s.
- Pendiente: E2E Playwright + auditoría de consola/red en navegador.

**Problemas**

- `@types/three@^0.186.1` no existe; fijado a `^0.186.0`.
- ESLint sin parser TS; añadido `typescript-eslint` como dependencia de lint.
- E2E pospuesto a instalación de Chromium.

**Siguiente paso**

Correr `npm run test:e2e`, revisar consola/red, cerrar RC0 y abrir RC1.
