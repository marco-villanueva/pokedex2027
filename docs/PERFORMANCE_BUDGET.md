# PERFORMANCE BUDGET

> Nota V1 (D-019): no hay WebGL en el bundle — las secciones Three.js quedan
> como guía condicional si una escena 3D real lo justifica en el futuro.
> Ver `docs/MOTION_AND_3D.md`.

## Objetivo

Conservar una experiencia fluida a pesar del nivel visual.

## Principios

- CSS antes que JS cuando sea suficiente;
- DOM antes que canvas para contenido;
- lazy loading;
- imágenes correctas;
- caché agresiva para datos estables;
- renderizado adaptativo;
- medir antes de optimizar.

## JavaScript

Evitar que la ruta Explorer cargue automáticamente:

- toda la lógica 3D;
- compare;
- evolution graph pesado;
- team analytics.

Usar code splitting.

## Imágenes

- lazy load fuera de viewport;
- priorizar imagen hero visible;
- definir dimensiones;
- evitar CLS;
- usar decoding async cuando corresponda;
- no descargar múltiples artworks grandes si solo se muestra uno.

## API

- staleTime largo;
- gcTime apropiado;
- prefetch selectivo;
- no consultar detalles de cientos de Pokémon al mismo tiempo;
- abort de búsquedas obsoletas.

## CSS

Vigilar:

- blur grande;
- backdrop filters múltiples;
- sombras gigantes;
- filtros animados;
- blend modes sobre grandes superficies.

## Motion

Animar preferentemente:

- transform;
- opacity.

Evitar animar layout en loops.

## Pointer tracking

Nunca usar `setState` en cada pointer move.

Alternativas:

- CSS variables;
- refs;
- MotionValues;
- requestAnimationFrame controlado.

## Three.js

### Canvas

Crear solo donde aporte valor.

### DPR

Limitar.

Ejemplo conceptual:

```text
dpr = [1, 1.5]
```

Ajustar con medición real.

### Geometría

- reutilizar;
- dispose;
- instancing si aplica;
- limitar draw calls.

### Texturas

- tamaño razonable;
- liberar;
- no cargar activos que no se usan.

### Partículas

Adaptativas.

### Postprocessing

Solo si existe presupuesto.

## Lifecycle

Al cambiar de ruta:

- detener loops;
- liberar listeners;
- cancelar requests;
- dispose de recursos;
- evitar canvas huérfanos.

## Virtualización

Introducir cuando el Explorer muestre suficientes nodos para justificarla.

No añadirla prematuramente si complica layout y animación.

## Métricas

Controlar:

- LCP;
- CLS;
- INP;
- Total Blocking Time en laboratorio;
- bundle inicial;
- requests iniciales;
- memoria;
- FPS en vistas 3D.

## Quality degradation

Diseñar niveles visuales implícitos.

### Full

- WebGL;
- partículas;
- tilt;
- blur;
- transiciones.

### Reduced

- menos partículas;
- DPR bajo;
- sin postprocessing;
- menos blur.

### Reduced Motion

- animación mínima;
- sin tilt;
- sin loops;
- sin boot sequence.

La información debe ser idéntica en todos los modos.
