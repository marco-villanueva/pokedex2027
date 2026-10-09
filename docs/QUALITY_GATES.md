# QUALITY GATES

## Regla

Un RC puede cerrarse únicamente cuando cumple los gates relevantes.

## Gate 1 - Build

Debe pasar:

- TypeScript;
- ESLint;
- tests;
- production build.

No warnings críticos.

## Gate 2 - Runtime

Comprobar:

- sin errores de consola;
- sin promesas rechazadas;
- sin loops de requests;
- sin 404 internos inesperados;
- sin hydration issues si en el futuro existiera SSR.

## Gate 3 - Functional

Flujos críticos:

- abrir explorer;
- buscar;
- aplicar filtros;
- abrir detalle;
- navegar anterior/siguiente;
- ver evolución;
- comparar;
- añadir favorito;
- administrar team.

Según RC activo.

## Gate 4 - Responsive

Revisar como mínimo:

- 360;
- 390;
- 430;
- 768;
- 1024;
- 1440.

Validar:

- overflow;
- clipping;
- stacking;
- safe area;
- legibilidad;
- touch targets.

## Gate 5 - Accessibility

- navegación teclado;
- focus visible;
- headings;
- landmarks;
- labels;
- contraste;
- alt;
- reduced motion;
- controles semánticos;
- no información solo por color.

Objetivo Lighthouse Accessibility >= 95.

## Gate 6 - Performance

Objetivo inicial Lighthouse Performance >= 90 en una configuración razonable.

La métrica no reemplaza inspección real.

Validar:

- LCP;
- CLS;
- INP;
- long tasks;
- images;
- bundle;
- canvas.

## Gate 7 - Network

- sin N+1 descontrolado;
- caché funcionando;
- prefetch limitado;
- requests cancelables;
- payloads razonables;
- retries limitados.

## Gate 8 - Visual

Checklist:

- jerarquía clara;
- composición coherente;
- tipo visual consistente;
- estados hover/focus;
- reduced motion;
- loading integrado;
- no componentes genéricos sin adaptar;
- no efectos arbitrarios;
- no saturación.

## Gate 9 - Cross-browser

Validar al menos:

- Chromium;
- Firefox;
- Safari/WebKit mediante Playwright cuando sea posible.

Features progresivas deben degradar correctamente.

## Gate 10 - Documentation

Actualizar:

- PROGRESS;
- DECISIONS;
- documentación especializada si cambió arquitectura.

## Severidad de issues

### Blocker

Impide release.

Ejemplos:

- build roto;
- navegación principal rota;
- pérdida de datos local;
- crash;
- inaccesibilidad severa.

### Critical

Debe resolverse antes de cerrar RC.

Ejemplos:

- filtro incorrecto;
- móvil inutilizable;
- memoria WebGL no liberada;
- requests infinitos.

### Major

Puede cerrar RC solo si existe decisión explícita y backlog.

### Minor

Polish.

## Criterio final

No usar "se ve bien" como única aceptación.

Debe existir evidencia técnica y visual.
