# DESIGN SYSTEM

## Objetivo

Definir reglas visuales y tokens suficientes para mantener coherencia sin convertir el proyecto en un design system genérico.

## Tokens principales

Usar CSS Custom Properties.

### Color

Base sugerida:

```css
:root {
  --color-bg-0: oklch(...);
  --color-bg-1: oklch(...);
  --color-surface-0: oklch(...);
  --color-surface-1: oklch(...);
  --color-text-0: oklch(...);
  --color-text-1: oklch(...);
  --color-border: oklch(...);

  --type-primary: ...;
  --type-secondary: ...;
  --type-accent: ...;
}
```

Los colores de tipo se inyectan en un contenedor de contexto.

Usar cuando sea útil:

- `oklch()`;
- `color-mix()`;
- alpha;
- variables derivadas.

## Escala espacial

Definir una escala consistente.

Ejemplo conceptual:

- xs
- sm
- md
- lg
- xl
- 2xl
- 3xl

No usar números arbitrarios repetidos en distintos componentes.

## Radius

Usar pocos niveles.

Evitar que toda la interfaz tenga esquinas extremadamente redondeadas.

## Bordes

Diferenciar:

- borde funcional;
- borde de panel;
- línea técnica;
- highlight óptico.

## Shadows

Separar:

- elevación;
- glow;
- contacto;
- iluminación.

No usar glow como sustituto de jerarquía.

## Blur

`backdrop-filter` se reserva para superficies que realmente lo necesitan.

Debe existir fallback visual razonable.

## Tipografía

Definir tokens:

- `--font-display`
- `--font-ui`
- `--font-mono`

Escalas fluidas mediante `clamp()`.

Evitar textos demasiado pequeños para simular telemetría.

## Iconografía

Elegir una única familia de iconos.

Reglas:

- stroke consistente;
- tamaños normalizados;
- labels para acciones ambiguas;
- no mezclar estilos.

## Motion tokens

Definir:

- duration-fast;
- duration-base;
- duration-slow;
- easing-standard;
- easing-emphasized;
- spring presets cuando corresponda.

## Breakpoints

Los componentes reutilizables deben preferir Container Queries.

Media Queries quedan para composición global.

## Componentes base

### Button

Variantes:

- primary;
- secondary;
- ghost;
- icon.

Estados:

- hover;
- focus-visible;
- pressed;
- disabled;
- loading.

### TypeBadge

Debe mostrar tipo mediante:

- color;
- texto;
- posible icono.

Nunca depender solo del color.

### SearchField

Soportar:

- clear;
- keyboard focus;
- loading;
- empty;
- suggestions si se implementan.

### FilterChip

Debe diferenciar:

- default;
- selected;
- disabled;
- focus.

### GlassPanel

Usar solo en regiones relevantes.

No convertirlo en el contenedor universal.

### DataLabel

Para biometría y telemetría.

Debe conservar contraste y semántica.

### StatBar

Debe ser accesible.

El valor numérico no puede depender de la longitud visual.

### HolographicSurface

Componente de presentación.

Debe contar con fallback sin pointer y sin motion.

### PokemonCard

Debe tener:

- estado base;
- hover;
- focus;
- selected;
- loading;
- reduced motion.

## CSS moderno a explorar

Cuando exista soporte razonable o degradación segura:

- container queries;
- nesting;
- custom properties;
- `@property`;
- `oklch()`;
- `color-mix()`;
- `backdrop-filter`;
- `mask-image`;
- `clip-path`;
- `mix-blend-mode`;
- 3D transforms;
- `perspective`;
- `transform-style: preserve-3d`;
- scroll-driven animations;
- View Transitions;
- Anchor Positioning;
- fluid typography;
- dynamic viewport units.

No usar una capacidad nueva únicamente para demostrarla.
