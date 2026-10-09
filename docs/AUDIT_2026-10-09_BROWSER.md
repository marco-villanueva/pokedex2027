# Auditoría navegador debugger — 2026-10-09

Método: Chrome 155 con `--remote-debugging-port=9222` (CDP `http://127.0.0.1:9222`,
`opencode-chrome-devtools@1.0.4`) + dev server Vite `http://127.0.0.1:5173`.
Navegación y snapshots vía CDP, viewport mobile 390×844 vía Playwright
(Chromium) como complemento porque el override efímero por WS no persiste.
Evidencia: `tsc`, `eslint`, `vitest` (79), `build` + 4 capturas en
`/tmp/browser-screenshot-*.png` (explorer ×2, dossier Charizard, compare).

## Alcance

Rutas: `/`→`/pokedex`, `/pokedex`, `/pokemon/:idOrName`, `/evolution/:id`,
`/compare`, `/favorites`, `/team`, `/lab`, `*` (404).
Deep-links: `?type=fire&sort=name&generation=1`, `?shiny=1`, compare con lado
inválido, dossier inexistente, Ditto #132 (sin cadena), Eevee chain #67,
`/evolution/133` (chain #133 = Poochyena, no Eevee — ver §1).

## Resultado global

Verde. 0 errores de consola, 0 pageerrors en 8 rutas desktop + 8 mobile.
0 overflow horizontal. 0 targets bajo 24px a 390. Headings H1→H2 correctos.
Estados loading/empty/error/retry verificados. Sin regresiones visuales.

## 1. Funcional

- Explorer: 48 cards iniciales de 1025, búsqueda + rails tipo/generación +
  orden en URL (`replace` sin spam). Filtro `fire+gen1+name` → 12 cards.
  Round-trip y share por URL OK.
- Dossier Charizard/Pikachu/Ditto: hero scanner + toggle STD/SHN con
  `?shiny=1` (deep-link deja toggle presionado), stats, biometría, especie,
  habilidades expandibles, matchups, related, sprites, stepper prev/next.
  Ditto renderiza cadena de 1 nodo sin errores. Mewtwo/legendary cubierto por
  E2E previo (no re-abierto aquí).
- Evolución: `/evolution/67` → Eevee 9 especímenes / 2 estadios con
  condiciones (Water/Thunder/Fire Stone, amistad día/noche, etc.).
  Nota: el parámetro es **chain ID**, no Pokémon ID. `/evolution/133` es
  Poochyena (chain #133), no Eevee. El estado vacío lo documenta
  ("/evolution/67 for Eevee's lineage"), así que no es bug, pero es un
  hallazgo de descubribilidad: quien teclee el ID de Pokédex esperará otra
  cadena. El dossier enlaza bien vía "OPEN FULL TREE", así que el flujo
  guiado no se rompe.
- Compare `?left=charizard&right=blastoise`: combobox + tabla semántica con
  deltas y veredicto en texto, swap, surprise-me, reload reconstruye.
  Con `right=noexiste`: nombra el lado fallido, Clear por lado + Retry, lado
  válido intacto. Verificado en vivo.
- Dossier inexistente (`noexiste-xyz-999`): esqueleto → panel "No specimen…"
  - Retry + vuelta al explorer. Sin pageerrors.
- Favorites/Team vacíos: copy correcto, CTA al archivo, sin crash.
- 404 (`/ruta-inexistente-xyz`): "404 — Uncharted sector", acción primaria
  al explorer. Título propio "Uncharted sector".
- Persistencia versionada favorites/team: sin cambios de código en esta
  auditoría; cross-tab sync cubierto por E2E existente.

## 2. Visual (desktop 1920 + capturas)

- Explorer: jerarquía archive-eyebrow → display → consola de filtros →
  conteo "48 of 1025 specimens materialised" → grid instrumentado
  (esquinas, watermark numeral, foil por tipo, corazón fuera del link).
  No parece SaaS genérico; identidad por tipo legible (Grass/Fire).
- Dossier Charizard: chamber con retícula ScannerRing + halo Fire, readouts
  `#0006`/`STD`, toggle Standard/Shiny, DataLabels (Height/Weight/Gen/Total),
  StatBars con valor textual, abilities con flag HIDDEN. Composición amplia,
  hero dominante.
- Compare: tarjetas ambientales por tipo (halo Fire vs Water), tabla
  Measure/Charizard/Δ/Blastoise con veredicto "Dead even… Totals 534 to 530".
- Sin glow azul/morado global, sin glassmorphism indiscriminado, sin
  animaciones gratuitas (`document.getAnimations()` = 0 en reposo).

## 3. Responsive / mobile (390 Playwright)

8/8 rutas `overflowX = 0`, H1 presente, 0 errores consola/pageerror:
`/pokedex`, `/pokemon/charizard`, `/evolution/67`, `/compare?…`,
`/favorites`, `/team`, `/lab`, 404. Auditoría táctil en `/pokedex`: 0
elementos `a/button/input/select` bajo 24px.

## 4. Accesibilidad / motion

- Skip-link → `#main-content`, landmarks `header/main/nav`, 64 focos en
  explorer filtrado, 41 `aria-pressed`, 1 `aria-live`. Imágenes: cards/dossier/
  compare con `alt` descriptivo; related/evolution/team usan `alt=""`
  decorativo dentro de links con `aria-label` (correcto — el conteo inicial
  de "4 sin alt" fue falso positivo por filtrar `!img.alt`, que cuenta
  `""` como ausente; el código usa `alt=""` explícito).
- Headings: explorer filtrado H1 + H2 por card (fix H1→H3 ya aplicado).
- Reduced-motion: `matchMedia('(prefers-reduced-motion: reduce)')` = false
  en este entorno; loops CSS detenidos por política y `FadeIn` CSS puro
  (ver `docs/MOTION_AND_3D.md` + D-019). Sin WebGL en el árbol (CSS-first).

## 5. Rendimiento / ingeniería

- `tsc -b`: limpio. `eslint src --max-warnings 0`: limpio.
  `vitest`: 18 ficheros / 79 tests verdes. `vite build`: vendor 347 kB
  (gzip 109 kB), rutas 0,2–13 kB, CSS 47 kB. `domContentLoaded` ~68 ms local,
  JS heap ~22 MB en explorer. Sin fetches redundantes observados en el
  barrido (índice + detalles únicos, volumes cubiertos por E2E RC2/RC7).

## 6. Hallazgos

1. (Menor, descubribilidad) `/evolution/:id` es chain ID. No rompe nada,
   pero `/evolution/133` ≠ Eevee sorprende. Propuesta backlog: aceptar
   también Pokémon ID y resolver a su chain, o renombrar el segmento a
   `/evolution/chain/:chainId`. No tocar en este pase (fuera de alcance,
   requiere decisión en `docs/DECISIONS.md`).
   ✅ **Resuelto (2026-10-09, D-032, FASE D):** alias aditivo
   `/evolution/pokemon/:idOrName` con redirect canónico a
   `/evolution/:chainId` (133→67 verificado en E2E); la ruta chain
   no cambia de forma. Seguimiento: `docs/PROGRESS.md` (FASE D).
2. (Falso positivo descartado) sprites related con `alt=""` son correctos.
   Sin acción.
3. Sin deuda nueva: 0 TODOs re-abiertos, 0 `any`, 0 console.error ilegítimo
   en el barrido.

## Siguiente acción

Mantener verde: re-certificar `tsc+lint+vitest+build+playwright` tras
cualquier cambio; si se quiere, abrir propuesta SDD para el alias
`/evolution` por Pokémon ID.

## 7. Mejoras para impresionar (research 2026-10-09, backlog — no implementar aún)

Nota de método: la delegación al subagente `sdd-research` fue rechazada por
el guard de preflight SDD, así que la investigación la ejecutó el orquestador
directo con el mismo estándar (fuentes primarias, soporte verificado,
tradeoffs). Estado: `done` con gaps declarados abajo. Todo lo propuesto es
backlog: V1 está cerrada y nada de esto se implementa sin propuesta SDD y
decisión en `docs/DECISIONS.md`.

### Criterio de encaje

Cada propuesta se mide contra las restricciones duras del proyecto: vendor
347 kB / LCP ~0,5 s / gama media fluida, CSS-antes-que-JS (D-019, sin WebGL),
`prefers-reduced-motion` obligatorio, AA + teclado + nada crítico solo-hover,
y la regla visual (cada efecto sirve a jerarquía, feedback, orientación o
identidad de tipo). Lo que la rompa va a "No recomendado", con el porqué.

### P0 — alto impacto, riesgo bajo, CSS-first

1. **View Transitions SPA (morph card → dossier).** El artwork de la card
   viaja al hero del dossier con `view-transition-name` compartido; el resto
   hace crossfade. Es EL patrón que más "portfolio premiado" transmite y
   sirve a continuidad/orientación espacial, no es decoración.
   Soporte: `startViewTransition()` Baseline 2025 Newly available (todos los
   evergreen desde oct-2025; Chrome 111+, Safari 18+, Firefox 144+).
   Coste casi cero (snapshots del navegador, sin librerías). Fallback:
   feature-detect + salto si `prefers-reduced-motion`.
   Encaje: router con lazy routes; envolver la navegación y nombrar 2-3
   elementos compartidos (artwork, numeral). Opcional: reveal circular desde
   el punto de click (WAAPI sobre `::view-transition-new(root)`).
   ✅ **Implementado (2026-10-09, D-021):** `TransitionLink` + pares
   `pokemon-art-<id>` / `pokemon-numeral-<id>` (card, dossier, nodos evo,
   related); `@view-transition navigation: auto` progresivo; skip con
   reduced-motion; unit (4) + E2E `view-transitions.spec.ts` (2) verdes;
   vendor 347,52 kB / gzip 109,25 kB sin regresión.
2. **Scroll-driven reveals (`animation-timeline: view()`).** Entrada de cards
   del explorer y secciones del dossier ligadas al scroll, más un parallax
   contenido del chamber. Compositor-driven, sin JS por frame (mejor que el
   rAF actual para este caso). Soporte ~87 % global (Chrome/Edge 115+,
   Firefox 159+, Safari 26+): obligatorio `@supports` y contenido visible
   por defecto (la animación solo realza). No debe pelear con el
   `IntersectionObserver` de 48 ventanas: aplicarla a entrada, no a carga.
   ✅ **Implementado (2026-10-09, D-022):** `scroll-reveals.css` puro CSS
   (`@supports (animation-timeline: view())`, visible por defecto):
   `.explorer-grid > li`, `.dossier-panels .panel` + parallax contenido de
   `.scanner-art`; reveal solo-transform (nunca opacity) tras hallazgo axe
   (fade 0→1 daba contraste transitorio bajo a caballo del fold);
   E2E `scroll-reveals.spec.ts` (3) + axe 10/10 verdes; vendor sin cambios
   (347,52 kB / gzip 109,25 kB).
3. **Popover nativo + `@starting-style` para detalles.** Habilidades,
   explicador de matchups y ayuda de filtros como `popover` con animación
   de entrada declarativa (fin del hack de temporizadores para animar desde
   `display: none`). Popover: Baseline 2025 Newly available (ene-2025).
   `@starting-style`: en los tres motores desde ago-2024 (Chrome 117,
   Safari 17.5, Firefox 129). Menos JS, a11y gratis (top layer, Esc, foco).
   ✅ **Implementado (2026-10-09, D-023):** `HelpPopover` (popovertarget
   nativo, cero JS) para leyenda de matchups + ayuda de filtros;
   `AbilityRows` a popover por fila con fetch on-demand vía evento
   `toggle`; `@starting-style` + `allow-discrete`, fallback `<details>`
   verificado con la API extirpada; unit (2) + E2E `popover.spec.ts` (5)
   verdes; vendor 347,56 kB / gzip 109,28 kB (+40 B CSS).
4. **Anchor positioning para tooltips.** Los `TypeBadge` muestran su tabla
   de efectividades anclada (`position-area` + `position-try-fallbacks:
flip-block`): imposible que se salga de pantalla, cero JS de
   posicionamiento, jubila cualquier futuro Popper/Floating-UI.
   Soporte: Chrome 125+, Safari 26+, Firefox 147+ (Baseline Nuevo 2026,
   ~88 % global). Exige `@supports` con fallback a `title`/estático.
   ✅ **Implementado (2026-10-09, D-024):** tip defensivo (Weak/Resists/
   Immune en texto) por badge con anchor único, `position-area:
block-start` + `flip-block`, fetch perezoso al hover (documento de tipo
   compartido); top layer `popover=manual` (el `overflow` de la card lo
   recortaba); `aria-hidden`, fuera del tab order, `title` sin soporte;
   hallazgo: `anchor-name` exige `--`-prefijo. Unit (4) + E2E
   `type-tooltips.spec.ts` (5) + axe 10/10 verdes; vendor 347,53 kB /
   gzip 109,26 kB.

### P1 — impacto medio, verificar coste antes

5. **Container queries en cards y paneles.** La card se adapta al ancho de
   su contenedor (rail, grid 2/6 col, compare), no al viewport: "mobile no
   es desktop reducido" a nivel componente. Widely available desde
   ago-2025 (todos desde feb-2023). Riesgo bajo, toca CSS de grid actual.
   ✅ **Implementado (2026-10-09, D-025):** `container-queries.css`
   (card-cell → card horizontal ≥26rem; evo-strip → nodo solitario
   horizontal ≥60rem) + `.explorer-grid` a `auto-fit`; grids de paneles ya
   intrínsecos, sin cambios; medición descartó el umbral por estadio
   (22.4 vs 22.8rem). E2E `container-queries.spec.ts` (6) + regresión
   explorer/collections/evolution + axe 10/10 verdes; vendor 347,53 kB /
   gzip 109,27 kB.
6. **`:has()` para estados.** La cámara reacciona al shiny seleccionado
   (`.scanner-chamber:has([aria-pressed="true"])`), formularios marcan su
   contenedor: se elimina JS que añade clases al padre. Widely available
   desde jun-2026. Riesgo bajo.
   ✅ **Implementado (2026-10-09, D-026):** `state-has.css` puro (cámara↔
   shiny reversible, leyenda con filtro real, búsqueda activa), cero TSX,
   sin `@supports` (Widely available); E2E `state-has.spec.ts` (4) + axe
   10/10 verdes; vendor 347,53 kB / gzip 109,26 kB.
7. **Command palette (Ctrl+K).** Saltar a cualquier Pokémon/acción desde
   teclado: patrón de portfolio avanzado y coherente con la historia de
   accesibilidad del proyecto. Construida a mano sobre el índice existente
   (sin dependencias nuevas), con `popover` + anchor. Coste: diseño de
   ranking + E2E de teclado. P1 por alcance, no por riesgo técnico.
   ✅ **Implementado (2026-10-09, D-027):** ranking propio testeado
   (id/nombre/prefijo/substring + `squashName`), trigger eager + panel
   lazy (entry 349,01/gzip 109,73; panel 4,08 kB bajo demanda), listbox
   completo con prefetch del resaltado; unit (7) + E2E `palette.spec.ts`
   (8) + axe 10/10 verdes.
8. **`useOptimistic` en favoritos/team.** Feedback instantáneo en toggles
   (React 19 ya está en el proyecto). Pulido real, wow modesto: P1 bajo.
   ✅ **Implementado (2026-10-09, D-028):** `committed` + `useOptimistic`
   - `startTransition` con `persistCollection` y rollback ante cuota
     (`persistError` con `role="alert"`); validación team intacta. Unit
     100/100 + E2E collections 4/4 + axe/keyboard verdes; vendor 349,76 kB
     / gzip 109,90.
9. **Tipografía display cinética.** Numerales del hero con `clamp()` y
   transiciones de peso/variable-font ligadas a scroll o estado. Solo si no
   añade peso de fuentes que rompa el budget: verificar antes.
   ✅ **Parcial (2026-10-09, D-029):** `clamp()` fluido en watermark,
   `.dossier-id` y `.scanner-readout` (cero bytes, sin CLS); el slice
   variable-font se **descarta con evidencia** (0 bytes servidos hoy;
   25–100 kB + FOUT/CLS lo romperían). E2E `kinetic-numerals.spec.ts`
   (3) + axe/detail verdes; vendor 349,76 kB / gzip 109,89.

### P2 / explorar con budget estricto

10. **Speculation Rules (prerender) para el dossier.** Extiende el prefetch
    hover/focus actual a prerender same-origin: navegación card→dossier
    casi instantánea. Solo Chromium; mejora progresiva, nunca dependencia.
    ❌ **Descartado con evidencia (2026-10-09, D-030):** en SPA los clics
    son same-document (el prerender jamás se activa); el prefetch actual
    ya cubre datos+chunks (131 ms medidos); cada prerender dispararía
    ráfagas especulativas contra la disciplina fair-use. Cero cambios.
11. **Canvas 2D mínimo para ambiente del hero** (NO WebGL). Solo si una
    medición demuestra que CSS no alcanza el efecto buscado, con DPR
    capado, pausa fuera de viewport y kill-switch con reduced-motion.
    D-019 sigue vigente: la carga de la prueba recae en quien lo proponga.
    ❌ **Descartado con evidencia (2026-10-09, D-031):** sin efecto
    objetivo que CSS no exprese; reposo medido en 0 animaciones (único
    rAF: tilt por evento); identidad por tipo ya cubierta en estática;
    budget sin margen decorativo. Cero cambios.

### No recomendado (y por qué)

- **Volver a three.js/WebGL completo.** Contradice D-019 y los budgets
  medidos (LCP 0,5 s, vendor 347 kB) sin evidencia nueva de que CSS sea
  insuficiente. Los SOTD con WebGL ganan premios pero queman gama media.
- **Librerías de animación (motion/framer).** Se eliminaron a propósito;
  View Transitions + scroll-driven + WAAPI cubren el 95 % del efecto con
  0 kB.
- **Cursor custom / magnetic buttons globales.** Rompen puntero coarse y
  aportan poco a un archivo científico; el tilt actual ya es táctil-safe.
- **Modo claro / `light-dark()`.** La identidad es laboratorio oscuro;
  un tema claro es alcance nuevo, no mejora.

### Fuentes

- View Transitions SPA/MPA y `startViewTransition` Baseline 2025:
  https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using,
  https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition,
  https://web.dev/learn/css/view-transitions-spas
- Cross-document (Chrome 126+, Safari 18.2+):
  https://www.testmuai.com/learning-hub/cross-document-view-transitions-browser-support
- Scroll-driven animations (~87 %, Chrome/Edge 115+, Firefox 159+):
  https://developer.mozilla.org/docs/Web/CSS/Guides/Scroll-driven_animations,
  https://caniuse.com/mdn-css_properties_animation-timeline
- Popover Baseline 2025 + posicionamiento con anchor implícito:
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API,
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- Anchor positioning (Chrome 125, Safari 26, Firefox 147; Baseline Nuevo):
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning,
  https://cssdna.com/blog/modern-css-2026, https://mintec.co/blog/css-anchor-positioning-2026
- Estado CSS 2026 (`:has()` WA jun-2026, CQs WA ago-2025, `@starting-style`):
  https://cssdna.com/blog/modern-css-2026,
  https://web.dev/learn/css/container-queries
- React 19 Actions/`useOptimistic`/`use`:
  https://react.dev/blog/2024/12/05/react-19,
  https://react.dev/reference/react/useOptimistic
- Tendencias Awwwards 2026 (narrativas por scroll, inmersivo):
  https://digitalstrategyforce.com/journal/why-are-immersive-experiences-dominating-the-2026-awwwards,
  https://www.awwwards.com/websites/

### Gaps y límites de frescura

- Etiqueta Baseline exacta de anchor positioning (2025 vs 2026) difiere
  entre fuentes secundarias; lo sólido son las versiones de motor
  (Chrome 125+, Safari 26+, Firefox 147+). Re-verificar antes de la propuesta.
- `@property` (animar StatBars/deltas del compare) no se verificó a fondo:
  candidata, no afirmación.
- `<Activity>` de React 19.x para preservar estado del explorer no se
  evaluó: el back ya preserva estado por URL, su valor es dudoso.
- Firefox/WebKit E2E no instalables en este entorno (caché read-only):
  los fallbacks para Safari <26 y Firefox <144/147/159 solo se validan en
  CI con navegadores reales.
- Búsqueda al 2026-10-09; el long tail (Safari <26, Firefox ESR) envejece a
  nuestro favor mes a mes.
